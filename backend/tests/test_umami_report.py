import pytest
from fastapi.testclient import TestClient
from httpx import HTTPError

from app.core.config import settings
from app.main import app
from app.services import umami_report

client = TestClient(app)


class FakeResponse:
    def __init__(self, payload: dict[str, object]) -> None:
        self._payload = payload

    def raise_for_status(self) -> None:
        return None

    def json(self) -> dict[str, object]:
        return self._payload


@pytest.fixture(autouse=True)
def _reset_umami_report_settings(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(settings, "umami_website_id", "")
    monkeypatch.setattr(settings, "umami_api_key", "")
    monkeypatch.setattr(settings, "umami_api_base", "https://api.umami.is/v1")


def test_fetch_report_returns_none_when_unconfigured() -> None:
    assert umami_report.fetch_report() is None


def test_fetch_report_builds_core_metrics(monkeypatch: pytest.MonkeyPatch) -> None:
    settings.umami_website_id = "site-123"
    settings.umami_api_key = "key-abc"

    captured: dict[str, object] = {}
    stats_payload = {
        "pageviews": 1500,
        "visitors": 400,
        "visits": 500,
        "bounces": 100,
        "totaltime": 3600,
    }
    pages_payload = [{"x": "/donate", "y": 90}, {"x": "/", "y": 80}]
    events_payload = [{"x": "donation_intent", "y": 25}]

    def fake_get(self: object, url: str, **kwargs: object) -> FakeResponse:
        captured.setdefault("urls", []).append(url)
        captured["params"] = kwargs["params"]
        captured["headers"] = kwargs["headers"]
        if url.endswith("/stats"):
            return FakeResponse(stats_payload)
        if kwargs["params"].get("type") == "path":
            return FakeResponse(pages_payload)
        return FakeResponse(events_payload)

    monkeypatch.setattr(umami_report.httpx.Client, "get", fake_get)

    report = umami_report.fetch_report(period_days=30)

    assert report is not None
    assert report["pageviews"] == 1500
    assert report["visitors"] == 400
    assert report["visits"] == 500
    assert report["bounce_rate"] == 20.0
    assert report["totaltime_seconds"] == 3600
    assert report["top_pages"] == [
        {"path": "/donate", "visitors": 90},
        {"path": "/", "visitors": 80},
    ]
    assert report["top_events"] == [{"name": "donation_intent", "count": 25}]

    assert captured["headers"]["x-umami-api-key"] == "key-abc"
    params = captured["params"]
    assert params["startAt"] < params["endAt"]


def test_fetch_report_returns_none_on_http_error(monkeypatch: pytest.MonkeyPatch) -> None:
    settings.umami_website_id = "site-123"
    settings.umami_api_key = "key-abc"

    def fake_get(self: object, url: str, **kwargs: object) -> FakeResponse:
        raise HTTPError("boom")

    monkeypatch.setattr(umami_report.httpx.Client, "get", fake_get)

    assert umami_report.fetch_report() is None


def test_report_endpoint_reports_unconfigured() -> None:
    response = client.get("/api/v1/analytics/report")

    assert response.status_code == 200
    payload = response.json()
    assert payload["configured"] is False
    assert payload["report"] is None
    assert "UMAMI_API_KEY" in payload["error"]
