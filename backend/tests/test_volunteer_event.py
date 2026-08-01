"""The volunteer application fires an anonymized Umami event in the background."""

import pytest
from fastapi.testclient import TestClient

from app.api.routes import volunteers as volunteers_route
from app.core.config import settings
from app.main import app

client = TestClient(app)


def test_volunteer_application_queues_anonymized_umami_event(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    recorded: list[tuple[str, dict[str, object]]] = []
    monkeypatch.setattr(
        volunteers_route, "track_event", lambda *args, **kwargs: recorded.append(args)
    )
    monkeypatch.setattr(settings, "umami_enabled", True)

    response = client.post(
        "/api/v1/volunteer-applications",
        json={
            "name": "Jamie Chan",
            "email": "jamie@example.com",
            "interests": ["sports", "community"],
            "availability": "weekend",
            "consent": True,
        },
    )

    assert response.status_code == 201
    assert len(recorded) == 1
    name, data = recorded[0]
    assert name == "volunteer_application"
    assert data == {"interests": ["sports", "community"], "availability": "weekend"}
