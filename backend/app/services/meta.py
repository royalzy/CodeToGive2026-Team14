"""Meta Graph API publishing for Instagram Business and Facebook Pages.

Instagram publishing is a two-step flow: create a media container from a
publicly fetchable image URL, then publish that container. Meta's servers
fetch the URL themselves, so it must be reachable from the public internet —
a localhost URL will fail with a misleading "Only photo or video can be
accepted as media type" error (code 9004 / subcode 2207052).
"""

from __future__ import annotations

import asyncio
import json
import time
from typing import Any

import httpx

from app.core.config import settings

GRAPH_BASE_URL = "https://graph.facebook.com/v26.0"

# Meta's fetcher rejects images outside these bounds, also with error 9004.
IG_MAX_EDGE_PX = 1440
IG_MIN_WIDTH_PX = 320

# Instagram carousels take 2-10 items; Facebook's feed attachment limit is the
# same in practice, so 10 is the shared ceiling.
MAX_CAROUSEL_ITEMS = 10


class MetaError(Exception):
    """Carries Meta's own error payload so callers can surface an actionable message."""

    def __init__(self, endpoint: str, status_code: int, payload: dict[str, Any]) -> None:
        error = payload.get("error", {})
        self.endpoint = endpoint
        self.status_code = status_code
        self.message = error.get("message", "Unknown error")
        self.type = error.get("type", "Unknown")
        self.code = error.get("code", "Unknown")
        self.error_subcode = error.get("error_subcode")
        super().__init__(self.message)

    def as_detail(self) -> str:
        detail = f"{self.message} (type={self.type}, code={self.code}"
        if self.error_subcode:
            detail += f", subcode={self.error_subcode}"
        return detail + f", endpoint={self.endpoint})"


class MetaNotConfiguredError(Exception):
    """Raised when the Meta credentials or public base URL are missing."""


async def _request(
    client: httpx.AsyncClient,
    method: str,
    path: str,
    *,
    params: dict[str, Any] | None = None,
    data: dict[str, Any] | None = None,
) -> dict[str, Any]:
    url = f"{GRAPH_BASE_URL}{path}"
    try:
        response = await client.request(method, url, params=params, data=data)
    except httpx.RequestError as exc:
        raise MetaError(
            endpoint=f"{method} {path}",
            status_code=0,
            payload={"error": {"message": str(exc), "type": "NetworkError", "code": "N/A"}},
        ) from exc

    payload: dict[str, Any] = response.json() if response.content else {}

    if response.status_code >= 400 or "error" in payload:
        raise MetaError(
            endpoint=f"{method} {path}",
            status_code=response.status_code,
            payload=payload,
        )

    return payload


def require_token() -> str:
    """Return the configured user access token, or raise if it is missing.

    Image hosting is validated separately by ``app.services.image_host``.
    """
    token = settings.meta_user_access_token.strip()
    if not token:
        raise MetaNotConfiguredError(
            "META_USER_ACCESS_TOKEN is not set. Add it to backend/.env to enable publishing."
        )
    return token


async def resolve_targets(client: httpx.AsyncClient, token: str) -> tuple[str, str, str]:
    """Resolve (page_id, page_access_token, instagram_user_id).

    Uses PAGE_ID from settings when set, otherwise the first Page the token can see.
    """
    payload = await _request(
        client,
        "GET",
        "/me/accounts",
        params={"access_token": token, "fields": "id,name,access_token,instagram_business_account"},
    )
    pages = payload.get("data", [])
    if not pages:
        raise MetaNotConfiguredError(
            "The access token can see no Facebook Pages. Confirm the token was granted "
            "access to a Page and that the account administers one."
        )

    configured_id = settings.meta_page_id.strip()
    if configured_id:
        page = next((p for p in pages if p["id"] == configured_id), None)
        if page is None:
            raise MetaNotConfiguredError(
                f"PAGE_ID '{configured_id}' was not among the Pages this token can access."
            )
    else:
        page = pages[0]

    ig_account = page.get("instagram_business_account") or {}
    return page["id"], page["access_token"], ig_account.get("id", "")


async def publish_instagram_post(
    client: httpx.AsyncClient,
    ig_user_id: str,
    image_url: str,
    caption: str,
    access_token: str,
) -> dict[str, Any]:
    """Create and publish an Instagram media container; return the published post's details."""
    container = await _request(
        client,
        "POST",
        f"/{ig_user_id}/media",
        data={"image_url": image_url, "caption": caption, "access_token": access_token},
    )
    published = await _request(
        client,
        "POST",
        f"/{ig_user_id}/media_publish",
        data={"creation_id": container["id"], "access_token": access_token},
    )
    return await _request(
        client,
        "GET",
        f"/{published['id']}",
        params={"fields": "caption,media_url,permalink", "access_token": access_token},
    )


async def _wait_for_container(
    client: httpx.AsyncClient,
    container_id: str,
    access_token: str,
    timeout_s: float = 90.0,
) -> None:
    """Block until an Instagram media container is ready to publish.

    A single-image container is usually ready immediately, but a carousel
    parent has to assemble its children first. Publishing too early fails with
    "Media ID is not available" (code 9007 / subcode 2207027), which says
    nothing about the real cause.
    """
    deadline = time.monotonic() + timeout_s
    delay = 1.0

    while True:
        payload = await _request(
            client,
            "GET",
            f"/{container_id}",
            params={"fields": "status_code,status", "access_token": access_token},
        )
        code = payload.get("status_code")

        if code == "FINISHED":
            return
        if code in {"ERROR", "EXPIRED"}:
            raise MetaError(
                endpoint=f"GET /{container_id}",
                status_code=200,
                payload={
                    "error": {
                        "message": (
                            f"Instagram could not process the media ({code}). "
                            f"{payload.get('status', '')}".strip()
                        ),
                        "type": "MediaProcessingError",
                        "code": code,
                    }
                },
            )
        if time.monotonic() > deadline:
            raise MetaError(
                endpoint=f"GET /{container_id}",
                status_code=200,
                payload={
                    "error": {
                        "message": (
                            f"Instagram was still processing the media after "
                            f"{timeout_s:.0f}s (last status: {code})."
                        ),
                        "type": "MediaProcessingTimeout",
                        "code": "N/A",
                    }
                },
            )

        await asyncio.sleep(delay)
        delay = min(delay * 1.5, 5.0)


async def publish_instagram_carousel(
    client: httpx.AsyncClient,
    ig_user_id: str,
    image_urls: list[str],
    caption: str,
    access_token: str,
) -> dict[str, Any]:
    """Publish 2-10 images as a single Instagram carousel post.

    Three stages: one child container per image, a parent container listing
    those children, then publish the parent. The caption belongs on the
    parent — children do not take one.
    """
    child_ids: list[str] = []
    for image_url in image_urls:
        child = await _request(
            client,
            "POST",
            f"/{ig_user_id}/media",
            data={
                "image_url": image_url,
                "is_carousel_item": "true",
                "access_token": access_token,
            },
        )
        child_ids.append(child["id"])

    parent = await _request(
        client,
        "POST",
        f"/{ig_user_id}/media",
        data={
            "media_type": "CAROUSEL",
            "children": ",".join(child_ids),
            "caption": caption,
            "access_token": access_token,
        },
    )
    # The parent has to finish assembling its children before it can publish.
    await _wait_for_container(client, parent["id"], access_token)

    published = await _request(
        client,
        "POST",
        f"/{ig_user_id}/media_publish",
        data={"creation_id": parent["id"], "access_token": access_token},
    )
    return await _request(
        client,
        "GET",
        f"/{published['id']}",
        params={"fields": "caption,media_url,permalink", "access_token": access_token},
    )


async def publish_facebook_multi_photo_post(
    client: httpx.AsyncClient,
    page_id: str,
    image_urls: list[str],
    caption: str,
    page_access_token: str,
) -> dict[str, Any]:
    """Publish several photos as one Facebook Page post.

    Each photo is uploaded unpublished first, then attached to a single feed
    post so they appear together rather than as separate posts.
    """
    media_ids: list[str] = []
    for image_url in image_urls:
        uploaded = await _request(
            client,
            "POST",
            f"/{page_id}/photos",
            data={
                "url": image_url,
                "published": "false",
                "temporary": "true",
                "access_token": page_access_token,
            },
        )
        media_ids.append(uploaded["id"])

    attachments = {
        f"attached_media[{index}]": json.dumps({"media_fbid": media_id})
        for index, media_id in enumerate(media_ids)
    }
    posted = await _request(
        client,
        "POST",
        f"/{page_id}/feed",
        data={"message": caption, **attachments, "access_token": page_access_token},
    )
    return await _request(
        client,
        "GET",
        f"/{posted['id']}",
        params={
            "fields": "message,full_picture,permalink_url",
            "access_token": page_access_token,
        },
    )


async def publish_facebook_text_post(
    client: httpx.AsyncClient,
    page_id: str,
    message: str,
    page_access_token: str,
) -> dict[str, Any]:
    """Post text with no image to a Facebook Page.

    Instagram has no equivalent — every Instagram post requires media — so
    this is Facebook-only by nature.
    """
    posted = await _request(
        client,
        "POST",
        f"/{page_id}/feed",
        data={"message": message, "access_token": page_access_token},
    )
    return await _request(
        client,
        "GET",
        f"/{posted['id']}",
        params={"fields": "message,permalink_url", "access_token": page_access_token},
    )


async def publish_facebook_photo_post(
    client: httpx.AsyncClient,
    page_id: str,
    image_url: str,
    caption: str,
    page_access_token: str,
) -> dict[str, Any]:
    """Post a photo to a Facebook Page; return the published post's details."""
    posted = await _request(
        client,
        "POST",
        f"/{page_id}/photos",
        data={"url": image_url, "caption": caption, "access_token": page_access_token},
    )
    # /photos returns {"id": <photo_id>, "post_id": <page_post_id>}; prefer post_id.
    post_id = posted.get("post_id", posted["id"])
    return await _request(
        client,
        "GET",
        f"/{post_id}",
        params={
            "fields": "message,full_picture,permalink_url",
            "access_token": page_access_token,
        },
    )
