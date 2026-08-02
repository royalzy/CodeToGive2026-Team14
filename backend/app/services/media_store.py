"""Stores website posts on disk so they can be committed to the repository.

Unlike Instagram and Facebook, a website post is not sent anywhere: the image
is written into the frontend's public folder and an entry is prepended to a
JSON index the Media page imports directly. Both paths are tracked by git, so
publishing a post produces a normal working-tree change for review.

Nothing here runs git. Committing is left to a person, deliberately — a web
request should not be staging files or pushing to a shared branch.
"""

from __future__ import annotations

import json
from datetime import UTC, datetime
from pathlib import Path
from typing import Any
from uuid import uuid4

# backend/app/services/media_store.py -> repository root
REPO_ROOT = Path(__file__).resolve().parents[3]
MEDIA_DIR = REPO_ROOT / "frontend" / "public" / "media"
INDEX_PATH = REPO_ROOT / "frontend" / "src" / "content" / "media-posts.json"

# Served from the frontend's public root, so the URL drops the "public" part.
PUBLIC_PREFIX = "/media"


class MediaStoreError(Exception):
    """Raised when a website post could not be written to disk."""


def _read_index() -> list[dict[str, Any]]:
    if not INDEX_PATH.exists():
        return []
    try:
        data = json.loads(INDEX_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise MediaStoreError(
            f"{INDEX_PATH.name} is not valid JSON, so the post was not saved: {exc}"
        ) from exc
    return data if isinstance(data, list) else []


def list_posts() -> list[dict[str, Any]]:
    """Every stored post, newest first."""
    return _read_index()


def delete_post(post_id: str) -> bool:
    """Remove a post and its images. Returns False if the id is unknown."""
    index_data = _read_index()
    remaining = [entry for entry in index_data if entry.get("id") != post_id]
    if len(remaining) == len(index_data):
        return False

    removed = next(entry for entry in index_data if entry.get("id") == post_id)

    try:
        for url in removed.get("images", []):
            # Stored as a public URL; map it back to a file inside MEDIA_DIR.
            name = Path(url).name
            target = MEDIA_DIR / name
            # Guard against a doctored index pointing outside the media folder.
            if target.parent == MEDIA_DIR:
                target.unlink(missing_ok=True)

        INDEX_PATH.write_text(
            json.dumps(remaining, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
    except OSError as exc:
        raise MediaStoreError(f"Could not delete the post: {exc}") from exc

    return True


def save_post(images: list[bytes], caption: str) -> dict[str, Any]:
    """Write the images and prepend an index entry. Returns the new entry.

    Images are already normalised to Instagram-safe JPEGs upstream, which
    happens to be a sensible size for the web too, so they are written as-is.
    """
    if not images:
        raise MediaStoreError("A website post needs at least one image.")

    post_id = uuid4().hex[:12]

    try:
        MEDIA_DIR.mkdir(parents=True, exist_ok=True)
        written: list[str] = []
        for index, payload in enumerate(images, start=1):
            filename = f"{post_id}-{index}.jpg"
            (MEDIA_DIR / filename).write_bytes(payload)
            written.append(f"{PUBLIC_PREFIX}/{filename}")

        entry = {
            "id": post_id,
            "caption": caption,
            "images": written,
            "published_at": datetime.now(UTC).isoformat(timespec="seconds"),
        }

        # Newest first: the page renders the index in order without sorting.
        index_data = [entry, *_read_index()]
        INDEX_PATH.parent.mkdir(parents=True, exist_ok=True)
        INDEX_PATH.write_text(
            json.dumps(index_data, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
    except OSError as exc:
        raise MediaStoreError(f"Could not write the post to disk: {exc}") from exc

    return entry
