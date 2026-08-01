"""The donation-intent route fires an anonymized Umami event in the background."""

import pytest
from fastapi.testclient import TestClient

from app.api.routes import donations as donations_route
from app.core.config import settings
from app.main import app

client = TestClient(app)


def test_donation_intent_queues_anonymized_umami_event(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    recorded: list[tuple[str, dict[str, object]]] = []
    monkeypatch.setattr(
        donations_route, "track_event", lambda *args, **kwargs: recorded.append(args)
    )
    monkeypatch.setattr(settings, "umami_enabled", True)

    response = client.post(
        "/api/v1/donation-intents",
        json={
            "amount": 300,
            "currency": "HKD",
            "program": "sports",
            "anonymous": True,
            "donor_name": "Alex Lee",
            "email": "alex@example.com",
        },
    )

    assert response.status_code == 201
    assert len(recorded) == 1
    name, data = recorded[0]
    assert name == "donation_intent"
    assert data == {"program": "sports", "amount": 300, "currency": "HKD"}
