"""Publishes due website posts on a timer.

Only website-only posts are published automatically. Anything targeting
Instagram or Facebook stays pending for a person to send, because a Meta call
can fail, hang, or be blocked, and discovering half a post went out overnight
is worse than it simply waiting.

Website publishing is entirely local — it writes files into the repository —
so there is no network call here that could stall the loop.

The tick runs inside the API process, so it only fires while the backend is
up. Anything that came due while it was down publishes on the next startup.
"""

from __future__ import annotations

import asyncio
import logging
from datetime import datetime
from typing import Any

from app.services import media_store, schedule_store

logger = logging.getLogger(__name__)

TICK_SECONDS = 30

# A post is only sent automatically when this is the whole target list.
AUTO_PLATFORMS = {"website"}


def _is_due(entry: dict[str, Any], now: datetime) -> bool:
    """True when a website-only post has reached its scheduled time.

    `scheduled_for` comes from an `<input type="datetime-local">`, so it has no
    timezone and is compared against local time. Backend and browser are the
    same machine in this setup.
    """
    if set(entry.get("platforms", [])) != AUTO_PLATFORMS:
        return False

    raw = entry.get("scheduled_for", "")
    try:
        when = datetime.fromisoformat(raw)
    except ValueError:
        logger.warning("Scheduled post %s has an unreadable time: %r", entry.get("id"), raw)
        return False

    if when.tzinfo is not None:
        when = when.astimezone().replace(tzinfo=None)
    return when <= now


def publish_due(now: datetime | None = None) -> list[str]:
    """Publish every due website-only post. Returns the ids that went out."""
    moment = now or datetime.now()
    published: list[str] = []

    for entry in schedule_store.list_scheduled():
        if not _is_due(entry, moment):
            continue

        post_id = entry["id"]
        try:
            images = schedule_store.read_images(entry)
            caption = entry.get("captions", {}).get("website", "")
            media_store.save_post(images, caption)
        except (schedule_store.ScheduleStoreError, media_store.MediaStoreError):
            # Leave it pending so it can be retried or sent by hand, and keep
            # the loop alive for the remaining posts.
            logger.exception("Could not auto-publish scheduled post %s", post_id)
            continue

        schedule_store.delete_scheduled(post_id)
        published.append(post_id)
        logger.info("Auto-published scheduled website post %s", post_id)

    return published


async def run_scheduler(stop: asyncio.Event) -> None:
    """Publish due posts now, then keep checking until asked to stop."""
    while not stop.is_set():
        try:
            # File IO, so keep it off the event loop.
            await asyncio.to_thread(publish_due)
        except Exception:  # noqa: BLE001 - a bad tick must not kill the loop
            logger.exception("Scheduled-post tick failed")

        try:
            await asyncio.wait_for(stop.wait(), timeout=TICK_SECONDS)
        except TimeoutError:
            continue
