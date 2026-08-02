import io
from typing import Annotated

import httpx
from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status
from PIL import Image, ImageOps, UnidentifiedImageError

from app.schemas.social import (
    FB_MAX_CAPTION,
    IG_MAX_CAPTION,
    WEB_MAX_CAPTION,
    PlatformResult,
    SocialPostResponse,
)
from app.services import image_host, media_store, meta

router = APIRouter(prefix="/social-posts", tags=["social"])

MAX_UPLOAD_BYTES = 10 * 1024 * 1024
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}
# Ordered as they appear in the composer: the website first, then the
# external platforms.
PLATFORM_ORDER = ("website", "instagram", "facebook")
VALID_PLATFORMS = set(PLATFORM_ORDER)
# Only these are published through the Meta Graph API; the website is local.
META_PLATFORMS = {"instagram", "facebook"}
CAPTION_LIMITS = {
    "website": WEB_MAX_CAPTION,
    "instagram": IG_MAX_CAPTION,
    "facebook": FB_MAX_CAPTION,
}
IG_MIN_EDGE = meta.IG_MIN_WIDTH_PX
# Meta's publish calls routinely take 10-30s; the default httpx timeout is too tight.
PUBLISH_TIMEOUT_S = 60.0


def _normalise_image(raw: bytes, filename: str) -> bytes:
    """Re-encode to an Instagram-safe JPEG.

    Instagram rejects images wider than 1440px or narrower than 320px, and
    reports it as a generic 9004 error, so normalise before publishing rather
    than letting Meta reject it. The filename is only used so errors name the
    offending file when several are attached.
    """
    try:
        image = Image.open(io.BytesIO(raw))
        image = ImageOps.exif_transpose(image)  # honour camera orientation
    except (UnidentifiedImageError, OSError) as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"'{filename}' could not be read as an image.",
        ) from exc

    if min(image.size) < IG_MIN_EDGE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"'{filename}' is {image.width}x{image.height}. Instagram needs "
                f"at least {IG_MIN_EDGE}px on the shorter edge."
            ),
        )

    image.thumbnail((meta.IG_MAX_EDGE_PX, meta.IG_MAX_EDGE_PX), Image.LANCZOS)
    image = image.convert("RGB")  # drops alpha and EXIF

    buffer = io.BytesIO()
    image.save(buffer, "JPEG", quality=88, optimize=True)
    return buffer.getvalue()


def _parse_platforms(raw: list[str]) -> list[str]:
    """Accept either repeated fields or one comma-separated value."""
    flattened = [item.strip() for value in raw for item in value.split(",") if item.strip()]
    unknown = sorted(set(flattened) - VALID_PLATFORMS)
    if unknown:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported platform(s): {', '.join(unknown)}.",
        )
    if not flattened:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Choose at least one platform to post to.",
        )
    # Preserve a stable order rather than set ordering.
    return [p for p in PLATFORM_ORDER if p in set(flattened)]


def _resolve_captions(
    caption: str,
    overrides: dict[str, str | None],
    targets: list[str],
) -> dict[str, str]:
    """Pick each platform's caption, falling back to the shared one.

    Validates against that platform's own limit, since Facebook allows far
    more characters than Instagram.
    """
    resolved: dict[str, str] = {}
    for platform in targets:
        text = (overrides.get(platform) or "").strip() or caption
        if not text:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"A caption is required for {platform.title()}.",
            )
        limit = CAPTION_LIMITS[platform]
        if len(text) > limit:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    f"The {platform.title()} caption is {len(text)} characters; "
                    f"the limit is {limit}."
                ),
            )
        resolved[platform] = text
    return resolved


@router.post("", response_model=SocialPostResponse, status_code=status.HTTP_201_CREATED)
async def create_social_post(
    platforms: Annotated[list[str], Form()],
    caption: Annotated[str, Form()] = "",
    # Optional and repeatable. Empty -> text-only (Facebook only); more than one
    # becomes an Instagram carousel / Facebook multi-photo post.
    # Note: a `list[UploadFile] | None` union is NOT parsed as a file list by
    # FastAPI — it silently arrives empty. Keep the plain list with a default.
    images: Annotated[list[UploadFile], File()] = [],  # noqa: B006
    # Optional per-platform overrides; each falls back to `caption`.
    caption_instagram: Annotated[str | None, Form()] = None,
    caption_facebook: Annotated[str | None, Form()] = None,
    caption_website: Annotated[str | None, Form()] = None,
) -> SocialPostResponse:
    targets = _parse_platforms(platforms)
    captions = _resolve_captions(
        caption.strip(),
        {
            "website": caption_website,
            "instagram": caption_instagram,
            "facebook": caption_facebook,
        },
        targets,
    )

    # FastAPI gives an empty UploadFile rather than None when the field is sent
    # but blank, so treat a missing filename as "no image".
    uploads = [item for item in images if item.filename]

    needs_image = sorted({"instagram", "website"} & set(targets))
    if not uploads and needs_image:
        names = " and ".join(name.title() for name in needs_image)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"{names} requires an image. Add one, or post to Facebook only "
                "for a text-only update."
            ),
        )
    if len(uploads) > meta.MAX_CAROUSEL_ITEMS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Up to {meta.MAX_CAROUSEL_ITEMS} images per post; "
                f"you attached {len(uploads)}."
            ),
        )

    normalised: list[bytes] = []
    for upload in uploads:
        if upload.content_type not in ALLOWED_CONTENT_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    f"'{upload.filename}' is {upload.content_type}. "
                    "Use JPEG, PNG or WebP."
                ),
            )

        raw = await upload.read()
        if len(raw) > MAX_UPLOAD_BYTES:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=(
                    f"'{upload.filename}' is over "
                    f"{MAX_UPLOAD_BYTES // (1024 * 1024)}MB."
                ),
            )

        # Validate the payload before the server-configuration check, so a bad
        # upload always reports the upload problem rather than a missing token.
        normalised.append(_normalise_image(raw, upload.filename or "image"))

    results: list[PlatformResult] = []

    # The website is written to disk locally, so it needs neither Meta
    # credentials nor Cloudinary. Handle it before any Meta setup, so a
    # website-only post works with nothing configured at all.
    if "website" in targets:
        try:
            entry = media_store.save_post(normalised, captions["website"])
            results.append(
                PlatformResult(
                    platform="website",
                    status="published",
                    caption=captions["website"],
                    permalink="/media",
                    media_url=entry["images"][0],
                )
            )
        except media_store.MediaStoreError as exc:
            results.append(
                PlatformResult(
                    platform="website",
                    status="failed",
                    caption=captions["website"],
                    error=str(exc),
                )
            )

    meta_targets = [platform for platform in targets if platform in META_PLATFORMS]
    if not meta_targets:
        return SocialPostResponse(image_urls=[], results=results)

    def meta_setup_failed(message: str, http_status: int) -> SocialPostResponse:
        """Report a Meta-side failure without discarding work already done.

        Raising here would throw away the results list, so a website post that
        already succeeded would be reported as a total failure while its files
        sat in the working tree. Once anything has been published, every later
        problem is reported per platform instead.
        """
        if not results:
            raise HTTPException(status_code=http_status, detail=message)
        results.extend(
            PlatformResult(
                platform=platform,
                status="failed",
                caption=captions[platform],
                error=message,
            )
            for platform in meta_targets
        )
        return SocialPostResponse(image_urls=[], results=results)

    try:
        token = meta.require_token()
    except meta.MetaNotConfiguredError as exc:
        return meta_setup_failed(str(exc), status.HTTP_503_SERVICE_UNAVAILABLE)

    image_urls: list[str] = []

    async with httpx.AsyncClient(timeout=PUBLISH_TIMEOUT_S) as client:
        # Host each image somewhere public, then confirm it is genuinely
        # fetchable before Meta tries — an unreachable URL otherwise surfaces
        # as a misleading "media type" error from Meta.
        for payload in normalised:
            try:
                url = await image_host.publish_image(client, payload)
                await image_host.verify_reachable(client, url)
            except image_host.ImageHostError as exc:
                return meta_setup_failed(str(exc), status.HTTP_503_SERVICE_UNAVAILABLE)
            image_urls.append(url)

        try:
            page_id, page_token, ig_user_id = await meta.resolve_targets(client, token)
        except meta.MetaNotConfiguredError as exc:
            return meta_setup_failed(str(exc), status.HTTP_503_SERVICE_UNAVAILABLE)
        except meta.MetaError as exc:
            return meta_setup_failed(exc.as_detail(), status.HTTP_502_BAD_GATEWAY)

        for platform in meta_targets:
            text = captions[platform]
            # Publish each platform independently so a failure on one does not
            # discard a success on the other.
            try:
                if platform == "instagram":
                    if not ig_user_id:
                        raise meta.MetaNotConfiguredError(
                            "No Instagram Business account is linked to this Facebook Page. "
                            "Link one in Meta Business Suite to publish to Instagram."
                        )
                    # Guaranteed non-empty by the Instagram-requires-image check.
                    if len(image_urls) > 1:
                        published = await meta.publish_instagram_carousel(
                            client, ig_user_id, image_urls, text, token
                        )
                    else:
                        published = await meta.publish_instagram_post(
                            client, ig_user_id, image_urls[0], text, token
                        )
                    results.append(
                        PlatformResult(
                            platform="instagram",
                            status="published",
                            caption=text,
                            permalink=published.get("permalink"),
                            media_url=published.get("media_url"),
                        )
                    )
                elif not image_urls:
                    published = await meta.publish_facebook_text_post(
                        client, page_id, text, page_token
                    )
                    results.append(
                        PlatformResult(
                            platform="facebook",
                            status="published",
                            caption=text,
                            permalink=published.get("permalink_url"),
                        )
                    )
                else:
                    if len(image_urls) > 1:
                        published = await meta.publish_facebook_multi_photo_post(
                            client, page_id, image_urls, text, page_token
                        )
                    else:
                        published = await meta.publish_facebook_photo_post(
                            client, page_id, image_urls[0], text, page_token
                        )
                    results.append(
                        PlatformResult(
                            platform="facebook",
                            status="published",
                            caption=text,
                            permalink=published.get("permalink_url"),
                            media_url=published.get("full_picture"),
                        )
                    )
            except meta.MetaError as exc:
                results.append(
                    PlatformResult(
                        platform=platform, status="failed", caption=text, error=exc.as_detail()
                    )
                )
            except meta.MetaNotConfiguredError as exc:
                results.append(
                    PlatformResult(
                        platform=platform, status="failed", caption=text, error=str(exc)
                    )
                )

    return SocialPostResponse(image_urls=image_urls, results=results)
