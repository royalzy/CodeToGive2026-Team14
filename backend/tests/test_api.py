from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_check() -> None:
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "love21-api"}


def test_volunteer_session_request_is_pending_without_persistence() -> None:
    response = client.post(
        "/api/v1/volunteer-applications",
        json={
            "name": "Jamie Chan",
            "email": "jamie@example.com",
            "role_id": "dance_activity_buddy",
            "session_id": "saturday_dance_project",
            "first_step": "trial",
            "consent": True,
        },
    )

    assert response.status_code == 201
    payload = response.json()
    assert payload["simulation"] is True
    assert payload["status"] == "pending_confirmation"
    assert payload["persistence"] == "none"
    assert payload["role_id"] == "dance_activity_buddy"
    assert payload["session_id"] == "saturday_dance_project"
    assert len(payload["next_steps"]) == 2
    assert "name" not in payload
    assert "email" not in payload


def test_volunteer_interest_without_session_is_accepted() -> None:
    response = client.post(
        "/api/v1/volunteer-applications",
        json={
            "name": "Jamie Chan",
            "email": "jamie@example.com",
            "role_id": "community_event_volunteer",
            "session_id": None,
            "first_step": "interest_only",
            "consent": True,
        },
    )

    assert response.status_code == 201
    payload = response.json()
    assert payload["status"] == "interest_submitted"
    assert payload["session_id"] is None


def test_volunteer_application_rejects_invalid_email_and_missing_consent() -> None:
    response = client.post(
        "/api/v1/volunteer-applications",
        json={
            "name": "Jamie Chan",
            "email": "not-an-email",
            "role_id": "sports_activity_buddy",
            "session_id": None,
            "first_step": "interest_only",
            "consent": False,
        },
    )

    assert response.status_code == 422


def test_volunteer_application_rejects_unsupported_personal_fields() -> None:
    response = client.post(
        "/api/v1/volunteer-applications",
        json={
            "name": "Jamie Chan",
            "email": "jamie@example.com",
            "role_id": "dance_activity_buddy",
            "session_id": None,
            "first_step": "interest_only",
            "preparation_needs": ["accessibility"],
            "consent": True,
        },
    )

    assert response.status_code == 422


def test_volunteer_application_rejects_unknown_role_or_session() -> None:
    unknown_role = client.post(
        "/api/v1/volunteer-applications",
        json={
            "name": "Jamie Chan",
            "email": "jamie@example.com",
            "role_id": "unknown",
            "session_id": None,
            "first_step": "interest_only",
            "consent": True,
        },
    )
    unknown_session = client.post(
        "/api/v1/volunteer-applications",
        json={
            "name": "Jamie Chan",
            "email": "jamie@example.com",
            "role_id": "sports_activity_buddy",
            "session_id": "unknown",
            "first_step": "trial",
            "consent": True,
        },
    )

    assert unknown_role.status_code == 422
    assert unknown_session.status_code == 422


def test_volunteer_application_rejects_session_for_another_role() -> None:
    response = client.post(
        "/api/v1/volunteer-applications",
        json={
            "name": "Jamie Chan",
            "email": "jamie@example.com",
            "role_id": "sports_activity_buddy",
            "session_id": "saturday_dance_project",
            "first_step": "trial",
            "consent": True,
        },
    )

    assert response.status_code == 422


def test_valid_donation_intent_is_always_a_simulation() -> None:
    response = client.post(
        "/api/v1/donation-intents",
        json={
            "amount": 500,
            "currency": "HKD",
            "program": "sports",
            "anonymous": False,
            "donor_name": "Alex Lee",
            "email": "alex@example.com",
        },
    )

    assert response.status_code == 201
    payload = response.json()
    assert payload["reference"].startswith("DON-")
    assert payload["status"] == "simulated"
    assert payload["simulation"] is True
    assert payload["persistence"] == "none"
    assert "sports and fitness" in payload["impact_message"]


def test_donation_intent_rejects_invalid_amount() -> None:
    response = client.post(
        "/api/v1/donation-intents",
        json={"amount": 0, "currency": "HKD", "program": "general"},
    )

    assert response.status_code == 422


def test_donation_intent_rejects_unknown_program() -> None:
    response = client.post(
        "/api/v1/donation-intents",
        json={"amount": 100, "currency": "HKD", "program": "unknown"},
    )

    assert response.status_code == 422
