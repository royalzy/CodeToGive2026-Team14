import pytest
from fastapi.testclient import TestClient

from app.api.routes import questionnaire as questionnaire_route
from app.core.config import settings
from app.db import get_connection
from app.main import app

client = TestClient(app)


def test_valid_submission_is_persisted_locally_with_pii() -> None:
    response = client.post(
        "/api/v1/questionnaire-submissions",
        json={
            "path": "family",
            "name": "Jamie Chan",
            "email": "jamie@example.com",
            "message": "Looking for support groups.",
            "consent": True,
        },
    )

    assert response.status_code == 201
    payload = response.json()
    assert payload["reference"].startswith("QNR-")
    assert payload["status"] == "submitted"
    assert payload["persistence"] == "stored"
    assert "family" in payload["suggested_path"]

    with get_connection() as conn:
        row = conn.execute(
            "SELECT * FROM questionnaire_submissions WHERE reference = ?",
            (payload["reference"],),
        ).fetchone()

    assert row is not None
    assert row["path"] == "family"
    assert row["name"] == "Jamie Chan"
    assert row["email"] == "jamie@example.com"
    assert row["message"] == "Looking for support groups."
    assert row["consent"] == 1


def test_submission_fires_anonymized_umami_event(monkeypatch: pytest.MonkeyPatch) -> None:
    recorded: list[tuple[str, dict[str, object]]] = []
    monkeypatch.setattr(
        questionnaire_route,
        "track_event",
        lambda *args, **kwargs: recorded.append(args),
    )
    monkeypatch.setattr(settings, "umami_enabled", True)

    response = client.post(
        "/api/v1/questionnaire-submissions",
        json={
            "path": "child",
            "name": "Jamie Chan",
            "email": "jamie@example.com",
            "consent": True,
        },
    )

    assert response.status_code == 201
    assert len(recorded) == 1
    name, data = recorded[0]
    assert name == "questionnaire_completed"
    assert data == {"path": "child"}


def test_submission_rejects_without_consent() -> None:
    response = client.post(
        "/api/v1/questionnaire-submissions",
        json={"path": "adult", "consent": False},
    )

    assert response.status_code == 422


def test_submission_rejects_unknown_path() -> None:
    response = client.post(
        "/api/v1/questionnaire-submissions",
        json={"path": "unknown", "consent": True},
    )

    assert response.status_code == 422


def test_submission_rejects_invalid_email() -> None:
    response = client.post(
        "/api/v1/questionnaire-submissions",
        json={"path": "other", "email": "not-an-email", "consent": True},
    )

    assert response.status_code == 422
