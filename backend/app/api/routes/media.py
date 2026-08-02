"""Managing website posts after they have been published.

Publishing lives in `social.py` alongside Instagram and Facebook. This module
covers the admin-side management of what is already on the site.
"""

from fastapi import APIRouter, HTTPException, status

from app.services import media_store

router = APIRouter(prefix="/media-posts", tags=["media"])


@router.get("")
def list_media_posts() -> list[dict]:
    """Every website post, newest first."""
    return media_store.list_posts()


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_media_post(post_id: str) -> None:
    """Remove a post and its images from disk.

    The change lands in the working tree like any other edit; committing it is
    left to a person.
    """
    try:
        removed = media_store.delete_post(post_id)
    except media_store.MediaStoreError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc)
        ) from exc

    if not removed:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No website post with id '{post_id}'.",
        )
