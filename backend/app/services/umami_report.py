"""Read-only client for the Umami Cloud API (admin analytics report).

Requires an API key (Umami Cloud: Settings > API keys) configured via
``UMAMI_API_KEY``. Returns None (never raises) when unconfigured or the API
is unreachable, so the admin report degrades gracefully.
"""

import logging
from datetime import UTC, datetime, timedelta

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)

TIMEOUT_SECONDS = 5.0
TOP_PAGES_LIMIT = 5
TOP_EVENTS_LIMIT = 10


def _api_key() -> str | None:
    return settings.umami_api_key.strip() if settings.umami_api_key else None


def fetch_report(period_days: int = 30) -> dict[str, object] | None:
    """Fetch core metrics for the last ``period_days`` from Umami Cloud."""
    if not (_api_key() and settings.umami_website_id):
        return None

    end_at = datetime.now(UTC)
    start_at = end_at - timedelta(days=period_days)
    params = {
        "startAt": int(start_at.timestamp() * 1000),
        "endAt": int(end_at.timestamp() * 1000),
    }
    headers = {
        "Accept": "application/json",
        "x-umami-api-key": _api_key() or "",
    }
    base = settings.umami_api_base.rstrip("/")
    website_id = settings.umami_website_id

    try:
        with httpx.Client(timeout=TIMEOUT_SECONDS) as client:
            stats = _get_json(client, f"{base}/websites/{website_id}/stats", params, headers)
            top_pages = _get_json(
                client,
                f"{base}/websites/{website_id}/metrics",
                {**params, "type": "path", "limit": TOP_PAGES_LIMIT},
                headers,
            )
            top_events = _get_json(
                client,
                f"{base}/websites/{website_id}/metrics",
                {**params, "type": "event", "limit": TOP_EVENTS_LIMIT},
                headers,
            )
    except httpx.HTTPError:
        logger.warning("Umami report request failed", exc_info=True)
        return None

    visits = stats.get("visits", 0)
    return {
        "period_days": period_days,
        "pageviews": stats.get("pageviews", 0),
        "visitors": stats.get("visitors", 0),
        "visits": visits,
        "bounce_rate": round(stats.get("bounces", 0) / visits * 100, 1) if visits else 0.0,
        "totaltime_seconds": stats.get("totaltime", 0),
        "top_pages": [{"path": row["x"], "visitors": row["y"]} for row in top_pages],
        "top_events": [{"name": row["x"], "count": row["y"]} for row in top_events],
    }


def _get_json(
    client: httpx.Client,
    url: str,
    params: dict[str, object],
    headers: dict[str, str],
) -> dict[str, object]:
    response = client.get(url, params=params, headers=headers)
    response.raise_for_status()
    return response.json()
