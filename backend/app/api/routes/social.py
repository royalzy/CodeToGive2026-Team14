import io
from typing import Annotated

import httpx
from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status
from PIL import Image, ImageOps, UnidentifiedImageError

from app.schemas.social import PlatformResult, SocialPostResponse
from app.services import image_host, meta

router = APIRouter(prefix="/social-posts", tags=["social"])

MAX_UPLOAD_BYTES = 10 * 1024 * 1024
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}
VALID_PLATFORMS = {"instagram", "facebook"}
MAX_CAPTION_CHARS = 2200  # Instagram's limit
IG_MIN_EDGE = meta.IG_MIN_WIDTH_PX
# Meta's publish calls routinely take 10-30s; the default httpx timeout is too tight.
PUBLISH_TIMEOUT_S = 60.0


def _normalise_image(raw: bytes) -> bytes:
    """Re-encode to an Instagram-safe JPEG.

    Instagram rejects images wider than 1440px or narrower than 320px, and
    reports it as a generic 9004 error, so normalise before publishing rather
    than letting Meta reject it.
    """
    try:
        image = Image.open(io.BytesIO(raw))
        image = ImageOps.exif_transpose(image)  # honour camera orientation
    except (UnidentifiedImageError, OSError) as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="That file could not be read as an image.",
        ) from exc

    if min(image.size) < IG_MIN_EDGE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Image is {image.width}x{image.height}. Instagram needs at least "
                f"{IG_MIN_EDGE}px on the shorter edge."
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
    return [p for p in ("instagram", "facebook") if p in set(flattened)]


@router.post("", response_model=SocialPostResponse, status_code=status.HTTP_201_CREATED)
async def create_social_post(
    image: Annotated[UploadFile, File()],
    caption: Annotated[str, Form()],
    platforms: Annotated[list[str], Form()],
) -> SocialPostResponse:
    caption = caption.strip()
    if not caption:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A caption is required.",
        )
    if len(caption) > MAX_CAPTION_CHARS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Caption must be {MAX_CAPTION_CHARS} characters or fewer.",
        )

    targets = _parse_platforms(platforms)

    if image.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type '{image.content_type}'. Use JPEG, PNG or WebP.",
        )

    raw = await image.read()
    if len(raw) > MAX_UPLOAD_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Image must be under {MAX_UPLOAD_BYTES // (1024 * 1024)}MB.",
        )

    # Validate the payload before the server-configuration check, so a bad
    # upload always reports the upload problem rather than a missing token.
    normalised = _normalise_image(raw)

    try:
        token = meta.require_token()
    except meta.MetaNotConfiguredError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)
        ) from exc

    async with httpx.AsyncClient(timeout=PUBLISH_TIMEOUT_S) as client:
        # Host the image somewhere public, then confirm it is genuinely
        # fetchable before Meta tries — an unreachable URL otherwise surfaces
        # as a misleading "media type" error from Meta.
        try:
            image_url = await image_host.publish_image(client, normalised)
            await image_host.verify_reachable(client, image_url)
        except image_host.ImageHostError as exc:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)
            ) from exc

        try:
            page_id, page_token, ig_user_id = await meta.resolve_targets(client, token)
        except meta.MetaNotConfiguredError as exc:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)
            ) from exc
        except meta.MetaError as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY, detail=exc.as_detail()
            ) from exc

        results: list[PlatformResult] = []

        for platform in targets:
            # Publish each platform independently so a failure on one does not
            # discard a success on the other.
            try:
                if platform == "instagram":
                    if not ig_user_id:
                        raise meta.MetaNotConfiguredError(
                            "No Instagram Business account is linked to this Facebook Page. "
                            "Link one in Meta Business Suite to publish to Instagram."
                        )
                    published = await meta.publish_instagram_post(
                        client, ig_user_id, image_url, caption, token
                    )
                    results.append(
                        PlatformResult(
                            platform="instagram",
                            status="published",
                            permalink=published.get("permalink"),
                            media_url=published.get("media_url"),
                        )
                    )
                else:
                    published = await meta.publish_facebook_photo_post(
                        client, page_id, image_url, caption, page_token
                    )
                    results.append(
                        PlatformResult(
                            platform="facebook",
                            status="published",
                            permalink=published.get("permalink_url"),
                            media_url=published.get("full_picture"),
                        )
                    )
            except meta.MetaError as exc:
                results.append(
                    PlatformResult(platform=platform, status="failed", error=exc.as_detail())
                )
            except meta.MetaNotConfiguredError as exc:
                results.append(
                    PlatformResult(platform=platform, status="failed", error=str(exc))
                )

    return SocialPostResponse(caption=caption, image_url=image_url, results=results)
