import httpx
import pytest

from app.core.config import settings
from app.services import umami


@pytest.fixture(autouse=True)
def _reset_umami_settings(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(settings, "umami_enabled", False)
    monkeypatch.setattr(settings, "umami_host", "")
    monkeypatch.setattr(settings, "umami_website_id", "")


def test_disabled_by_default_returns_false_without_network() -> None:
    def fail_if_called(*args: object, **kwargs: object) -> httpx.Response:
        raise AssertionError("httpx.post must not be called when disabled")

    monkeypatch = pytest.MonkeyPatch()
    monkeypatch.setattr(umami.httpx, "post", fail_if_called)
    try:
        assert umami.track_event("donation_intent", {"program": "sports"}) is False
    finally:
        monkeypatch.undo()


def test_enabled_sends_payload_to_send_endpoint() -> None:
    settings.umami_enabled = True
    settings.umami_host = "https://analytics.example.org/"
    settings.umami_website_id = "site-123"

    captured: dict[str, object] = {}

    def fake_post(url: str, **kwargs: object) -> httpx.Response:
        captured["url"] = url
        captured["json"] = kwargs["json"]
        captured["timeout"] = kwargs["timeout"]
        return httpx.Response(
            202,
            request=httpx.Request("POST", "https://analytics.example.org/api/send"),
        )

    monkeypatch = pytest.MonkeyPatch()
    monkeypatch.setattr(umami.httpx, "post", fake_post)
    try:
        result = umami.track_event(
            "donation_intent",
            {"program": "sports", "amount": 500},
            url="https://love21.org/donate",
        )
    finally:
        monkeypatch.undo()

    assert result is True
    assert captured["url"] == "https://analytics.example.org/api/send"
    assert captured["timeout"] == umami.TIMEOUT_SECONDS
    payload = captured["json"]["payload"]
    assert payload["website"] == "site-123"
    assert payload["name"] == "donation_intent"
    assert payload["hostname"] == "love21.org"
    assert payload["data"] == {"program": "sports", "amount": 500}


def test_enabled_swallows_http_errors() -> None:
    settings.umami_enabled = True
    settings.umami_host = "https://analytics.example.org"
    settings.umami_website_id = "site-123"

    def fake_post(url: str, **kwargs: object) -> httpx.Response:
        raise httpx.ConnectError("connection refused")

    monkeypatch = pytest.MonkeyPatch()
    monkeypatch.setattr(umami.httpx, "post", fake_post)
    try:
        assert umami.track_event("donation_intent") is False
    finally:
        monkeypatch.undo()


def test_is_enabled_requires_all_three_settings() -> None:
    assert umami.is_enabled() is False

    settings.umami_enabled = True
    assert umami.is_enabled() is False

    settings.umami_host = "https://analytics.example.org"
    assert umami.is_enabled() is False

    settings.umami_website_id = "site-123"
    assert umami.is_enabled() is True
