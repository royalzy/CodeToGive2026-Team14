"""Publishes an uploaded image somewhere Meta's servers can fetch it.

Meta fetches the image over the public internet at publish time, so it has to
live somewhere publicly reachable — a path on this server is not enough.
Images are uploaded to Cloudinary, which returns a permanent CDN URL and
requires no tunnel, so the admin composer works the same on a teammate's
laptop or a deployed server.

Meta downloads its own copy when the post is published, so the Cloudinary
asset is only needed for the duration of the publish call. It is kept
afterwards as a record of what was posted.
"""

from __future__ import annotations

import hashlib
import time

import httpx

from app.core.config import settings

CLOUDINARY_FOLDER = "love21-social"
UPLOAD_TIMEOUT_S = 60.0


class ImageHostError(Exception):
    """Raised when the image could not be made publicly fetchable."""


def cloudinary_configured() -> bool:
    return bool(
        settings.cloudinary_cloud_name.strip()
        and settings.cloudinary_api_key.strip()
        and settings.cloudinary_api_secret.strip()
    )


def _sign(params: dict[str, str], api_secret: str) -> str:
    """Cloudinary signature: sorted `k=v` pairs joined by `&`, then SHA-1 with the secret."""
    payload = "&".join(f"{key}={params[key]}" for key in sorted(params))
    return hashlib.sha1(f"{payload}{api_secret}".encode()).hexdigest()  # noqa: S324


async def publish_image(client: httpx.AsyncClient, image: bytes) -> str:
    """Upload ``image`` to Cloudinary and return its public CDN URL."""
    if not cloudinary_configured():
        raise ImageHostError(
            "Image hosting is not configured. Set CLOUDINARY_CLOUD_NAME, "
            "CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in backend/.env — "
            "Meta fetches the image over the public internet, so it cannot be "
            "served from this machine directly."
        )

    cloud_name = settings.cloudinary_cloud_name.strip()
    api_key = settings.cloudinary_api_key.strip()
    api_secret = settings.cloudinary_api_secret.strip()

    timestamp = str(int(time.time()))
    signed = {"folder": CLOUDINARY_FOLDER, "timestamp": timestamp}

    try:
        response = await client.post(
            f"https://api.cloudinary.com/v1_1/{cloud_name}/image/upload",
            data={
                **signed,
                "api_key": api_key,
                "signature": _sign(signed, api_secret),
            },
            files={"file": ("upload.jpg", image, "image/jpeg")},
            timeout=UPLOAD_TIMEOUT_S,
        )
    except httpx.RequestError as exc:
        raise ImageHostError(f"Could not reach Cloudinary: {exc}") from exc

    payload = response.json() if response.content else {}

    if response.status_code >= 400:
        message = payload.get("error", {}).get("message", response.text[:200])
        raise ImageHostError(f"Cloudinary rejected the upload: {message}")

    url = payload.get("secure_url")
    if not url:
        raise ImageHostError("Cloudinary did not return a secure_url for the upload.")
    return url


async def verify_reachable(client: httpx.AsyncClient, url: str) -> None:
    """Confirm the URL really serves an image before handing it to Meta.

    Without this, an unreachable or non-image URL surfaces as Meta's
    misleading "Only photo or video can be accepted as media type" error
    rather than the actual problem.
    """
    try:
        response = await client.get(
            url,
            headers={"User-Agent": "facebookexternalhit/1.1"},
            timeout=20.0,
        )
    except httpx.RequestError as exc:
        raise ImageHostError(
            f"The uploaded image is not reachable at {url} ({exc}). "
            "Meta will not be able to fetch it."
        ) from exc

    if response.status_code >= 400:
        raise ImageHostError(
            f"The uploaded image returned HTTP {response.status_code} at {url}. "
            "Meta will not be able to fetch it."
        )

    content_type = response.headers.get("content-type", "")
    if not content_type.startswith("image/"):
        raise ImageHostError(
            f"{url} returned '{content_type or 'no content-type'}' instead of an image. "
            "Meta cannot read that."
        )
