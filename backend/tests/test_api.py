from fastapi.testclient import TestClient

from app.db import get_connection
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
    assert payload["persistence"] == "stored"
    assert "sports and fitness" in payload["impact_message"]


def test_donation_intent_is_persisted_anonymized() -> None:
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
    reference = response.json()["reference"]

    with get_connection() as conn:
        row = conn.execute(
            "SELECT * FROM donation_intents WHERE reference = ?", (reference,)
        ).fetchone()

    assert row is not None
    assert row["program"] == "sports"
    assert row["amount"] == 500
    assert row["currency"] == "HKD"
    assert row["anonymous"] == 0
    assert "donor_name" not in row
    assert "email" not in row


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
def test_booking_is_persisted_and_listed() -> None:
    response = client.post(
        "/api/v1/bookings",
        json={
            "member_slug": "crystal",
            "event_id": "bev-1",
            "event_date": "2025-08-09",
        },
    )

    assert response.status_code == 201
    payload = response.json()
    assert payload["id"].startswith("BK-")
    assert payload["member_slug"] == "crystal"
    assert payload["event_id"] == "bev-1"
    assert payload["status"] == "confirmed"

    listed = client.get("/api/v1/bookings", params={"member_slug": "crystal"})
    assert listed.status_code == 200
    assert any(b["id"] == payload["id"] for b in listed.json())


def test_booking_daily_limit_returns_conflict() -> None:
    member = "daily-limit-member"
    for _ in range(2):
        response = client.post(
            "/api/v1/bookings",
            json={
                "member_slug": member,
                "event_id": "bev-1",
                "event_date": "2025-08-09",
            },
        )
        assert response.status_code == 201

    blocked = client.post(
        "/api/v1/bookings",
        json={
            "member_slug": member,
            "event_id": "bev-2",
            "event_date": "2025-08-09",
        },
    )

    assert blocked.status_code == 409


def test_booking_rejects_invalid_payload() -> None:
    response = client.post(
        "/api/v1/bookings",
        json={"member_slug": "", "event_id": "", "event_date": ""},
    )

    assert response.status_code == 422
