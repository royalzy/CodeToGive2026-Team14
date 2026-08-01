"""Fire-and-forget client for Umami analytics custom events.

Only anonymized event data may be sent to Umami. Never include personal
information (name, email, contact details) in event names or data props;
personal data belongs in the local SQLite store only.

Disabled by default (``UMAMI_ENABLED=false``): all calls become no-ops so the
existing API behavior and tests are unaffected until analytics is configured.
"""

import logging
from urllib.parse import urlsplit

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)

TIMEOUT_SECONDS = 2.0
"""Short timeout: analytics must never slow down the request path."""


def is_enabled() -> bool:
    """True only when all three Umami settings are configured."""
    return bool(
        settings.umami_enabled and settings.umami_host and settings.umami_website_id
    )


def track_event(
    name: str,
    data: dict[str, object] | None = None,
    *,
    url: str = "",
) -> bool:
    """Send an anonymized custom event to Umami.

    Returns False (never raises) when analytics is disabled, unconfigured, or
    the Umami endpoint is unreachable.
    """
    if not is_enabled():
        return False

    payload = {
        "type": "event",
        "payload": {
            "website": settings.umami_website_id,
            "hostname": urlsplit(url).hostname or "love21.local",
            "url": url,
            "name": name,
            "data": data or {},
        },
    }

    try:
        response = httpx.post(
            f"{settings.umami_host.rstrip('/')}/api/send",
            json=payload,
            headers={"User-Agent": "love21-backend/0.1"},
            timeout=TIMEOUT_SECONDS,
        )
        response.raise_for_status()
        return True
    except httpx.HTTPError:
        logger.warning("Failed to send analytics event '%s'", name, exc_info=True)
        return False
