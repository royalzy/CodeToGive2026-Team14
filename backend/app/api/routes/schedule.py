"""Scheduling posts for later, and publishing them when an admin chooses.

Nothing publishes on a timer. A scheduled post waits in the list until someone
sends it, which keeps the demo predictable and avoids a background worker that
would only run while the backend happens to be up.
"""

from typing import Annotated

from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status

from app.api.routes.social import (
    ALLOWED_CONTENT_TYPES,
    MAX_UPLOAD_BYTES,
    _normalise_image,
    _parse_platforms,
    _resolve_captions,
    publish_to_platforms,
)
from app.schemas.social import SocialPostResponse
from app.services import meta, schedule_store

router = APIRouter(prefix="/scheduled-posts", tags=["schedule"])


@router.get("")
def list_scheduled_posts() -> list[dict]:
    """Every pending post, soonest first."""
    return schedule_store.list_scheduled()


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_scheduled_post(
    platforms: Annotated[list[str], Form()],
    scheduled_for: Annotated[str, Form()],
    caption: Annotated[str, Form()] = "",
    images: Annotated[list[UploadFile], File()] = [],  # noqa: B006
    caption_instagram: Annotated[str | None, Form()] = None,
    caption_facebook: Annotated[str | None, Form()] = None,
    caption_website: Annotated[str | None, Form()] = None,
) -> dict:
    """Validate exactly as an immediate post would, then store instead of send."""
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

    if not scheduled_for.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Choose a date and time for the post.",
        )

    uploads = [item for item in images if item.filename]
    if not uploads:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A scheduled post needs at least one image.",
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
                detail=f"'{upload.filename}' is {upload.content_type}. Use JPEG, PNG or WebP.",
            )
        raw = await upload.read()
        if len(raw) > MAX_UPLOAD_BYTES:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"'{upload.filename}' is over {MAX_UPLOAD_BYTES // (1024 * 1024)}MB.",
            )
        normalised.append(_normalise_image(raw, upload.filename or "image"))

    try:
        return schedule_store.save_scheduled(
            normalised, captions, targets, scheduled_for.strip()
        )
    except schedule_store.ScheduleStoreError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc)
        ) from exc


@router.post("/{post_id}/publish", response_model=SocialPostResponse)
async def publish_scheduled_post(post_id: str) -> SocialPostResponse:
    """Send a pending post now, then drop it from the schedule.

    The schedule entry is only removed once something actually published, so a
    total failure leaves the post pending and retryable.
    """
    entry = schedule_store.get_scheduled(post_id)
    if entry is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No scheduled post with id '{post_id}'.",
        )

    try:
        images = schedule_store.read_images(entry)
    except schedule_store.ScheduleStoreError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc)
        ) from exc

    response = await publish_to_platforms(
        entry.get("platforms", []), entry.get("captions", {}), images
    )

    if any(result.status == "published" for result in response.results):
        schedule_store.delete_scheduled(post_id)

    return response


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_scheduled_post(post_id: str) -> None:
    """Cancel a scheduled post and remove its pending images."""
    try:
        removed = schedule_store.delete_scheduled(post_id)
    except schedule_store.ScheduleStoreError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc)
        ) from exc

    if not removed:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No scheduled post with id '{post_id}'.",
        )
