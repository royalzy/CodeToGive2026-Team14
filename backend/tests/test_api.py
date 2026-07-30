from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_check() -> None:
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "love21-api"}


def test_valid_volunteer_application_is_accepted_without_persistence() -> None:
    response = client.post(
        "/api/v1/volunteer-applications",
        json={
            "name": "Jamie Chan",
            "email": "jamie@example.com",
            "interests": ["sports", "community"],
            "availability": "weekend",
            "message": "I would love to learn more.",
            "consent": True,
        },
    )

    assert response.status_code == 201
    payload = response.json()
    assert payload["reference"].startswith("VOL-")
    assert payload["status"] == "submitted"
    assert payload["persistence"] == "none"
    assert len(payload["next_steps"]) == 2


def test_volunteer_application_rejects_invalid_email_and_missing_consent() -> None:
    response = client.post(
        "/api/v1/volunteer-applications",
        json={
            "name": "Jamie Chan",
            "email": "not-an-email",
            "interests": ["sports"],
            "availability": "weekend",
            "consent": False,
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

