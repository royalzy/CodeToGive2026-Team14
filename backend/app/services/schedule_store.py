"""Stores scheduled posts on disk until an admin publishes them.

Mirrors `media_store`: images go into the frontend's public folder and the
metadata into a committed JSON file, so a schedule and its image travel
together through git rather than drifting apart.

Pending images live in their own subfolder and are deliberately absent from
`media-posts.json`, so a scheduled post never shows on the public Media page
before it is published.

Nothing here publishes on a timer. A scheduled post sits in the list until an
admin chooses to send it.
"""

from __future__ import annotations

import json
from datetime import UTC, datetime
from pathlib import Path
from typing import Any
from uuid import uuid4

# backend/app/services/schedule_store.py -> repository root
REPO_ROOT = Path(__file__).resolve().parents[3]
PENDING_DIR = REPO_ROOT / "frontend" / "public" / "media" / "pending"
INDEX_PATH = REPO_ROOT / "frontend" / "src" / "content" / "scheduled-posts.json"

PUBLIC_PREFIX = "/media/pending"


class ScheduleStoreError(Exception):
    """Raised when a scheduled post could not be read or written."""


def _read_index() -> list[dict[str, Any]]:
    if not INDEX_PATH.exists():
        return []
    try:
        data = json.loads(INDEX_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise ScheduleStoreError(
            f"{INDEX_PATH.name} is not valid JSON: {exc}"
        ) from exc
    return data if isinstance(data, list) else []


def _write_index(entries: list[dict[str, Any]]) -> None:
    INDEX_PATH.parent.mkdir(parents=True, exist_ok=True)
    INDEX_PATH.write_text(
        json.dumps(entries, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def list_scheduled() -> list[dict[str, Any]]:
    """Every pending post, soonest first."""
    return sorted(_read_index(), key=lambda entry: entry.get("scheduled_for", ""))


def get_scheduled(post_id: str) -> dict[str, Any] | None:
    return next((e for e in _read_index() if e.get("id") == post_id), None)


def read_images(entry: dict[str, Any]) -> list[bytes]:
    """Load a pending post's images back off disk, ready to publish."""
    payloads: list[bytes] = []
    for url in entry.get("images", []):
        target = PENDING_DIR / Path(url).name
        # Guard against a doctored index pointing outside the pending folder.
        if target.parent != PENDING_DIR or not target.exists():
            raise ScheduleStoreError(f"Missing image for scheduled post '{entry.get('id')}'.")
        payloads.append(target.read_bytes())
    if not payloads:
        raise ScheduleStoreError("That scheduled post has no images.")
    return payloads


def save_scheduled(
    images: list[bytes],
    captions: dict[str, str],
    platforms: list[str],
    scheduled_for: str,
) -> dict[str, Any]:
    """Write the images and record the schedule. Returns the new entry."""
    if not images:
        raise ScheduleStoreError("A scheduled post needs at least one image.")

    post_id = uuid4().hex[:12]

    try:
        PENDING_DIR.mkdir(parents=True, exist_ok=True)
        written: list[str] = []
        for index, payload in enumerate(images, start=1):
            filename = f"{post_id}-{index}.jpg"
            (PENDING_DIR / filename).write_bytes(payload)
            written.append(f"{PUBLIC_PREFIX}/{filename}")

        entry = {
            "id": post_id,
            "captions": captions,
            "platforms": platforms,
            "images": written,
            "scheduled_for": scheduled_for,
            "created_at": datetime.now(UTC).isoformat(timespec="seconds"),
        }
        _write_index([*_read_index(), entry])
    except OSError as exc:
        raise ScheduleStoreError(f"Could not save the scheduled post: {exc}") from exc

    return entry


def delete_scheduled(post_id: str) -> bool:
    """Remove a scheduled post and its pending images."""
    entries = _read_index()
    remaining = [e for e in entries if e.get("id") != post_id]
    if len(remaining) == len(entries):
        return False

    removed = next(e for e in entries if e.get("id") == post_id)
    try:
        for url in removed.get("images", []):
            target = PENDING_DIR / Path(url).name
            if target.parent == PENDING_DIR:
                target.unlink(missing_ok=True)
        _write_index(remaining)
    except OSError as exc:
        raise ScheduleStoreError(f"Could not delete the scheduled post: {exc}") from exc

    return True
