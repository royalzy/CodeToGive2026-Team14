import pytest
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


def test_volunteer_application_accepts_new_programme_roles() -> None:
    response = client.post(
        "/api/v1/volunteer-applications",
        json={
            "name": "Jamie Chan",
            "email": "jamie@example.com",
            "role_id": "nutrition_class_assistant",
            "session_id": "nutrition_cooking_workshop",
            "first_step": "trial",
            "consent": True,
        },
    )

    assert response.status_code == 201
    payload = response.json()
    assert payload["role_id"] == "nutrition_class_assistant"
    assert payload["session_id"] == "nutrition_cooking_workshop"


def test_volunteer_application_accepts_class_leader_role_without_session() -> None:
    response = client.post(
        "/api/v1/volunteer-applications",
        json={
            "name": "Jamie Chan",
            "email": "jamie@example.com",
            "role_id": "sports_class_leader",
            "session_id": None,
            "first_step": "interest_only",
            "consent": True,
        },
    )

    assert response.status_code == 201
    payload = response.json()
    assert payload["status"] == "interest_submitted"
    assert payload["role_id"] == "sports_class_leader"


def test_donation_impact_options_return_ordered_demo_configuration() -> None:
    response = client.get("/api/v1/donation-impact/options")

    assert response.status_code == 200
    assert response.json() == {
        "default_cause_id": "where_needed_most",
        "preset_amounts_hkd": [200, 400, 600, 1000],
        "causes": [
            {"cause_id": "where_needed_most", "copy_key": "where_needed_most"},
            {"cause_id": "dance", "copy_key": "dance"},
            {"cause_id": "sports", "copy_key": "sports"},
            {"cause_id": "nutrition", "copy_key": "nutrition"},
            {"cause_id": "family_support", "copy_key": "family_support"},
        ],
        "demo_estimates": True,
    }


@pytest.mark.parametrize(
    ("cause_id", "amount_hkd", "expected_mode", "expected_units"),
    [
        ("dance", 600, "counted", 4),
        ("dance", 100, "contribution", None),
        ("where_needed_most", 600, "flexible", None),
        ("sports", 120, "counted", 1),
        ("nutrition", 1_000_000, "counted", 3333),
        ("family_support", 999, "counted", 1),
    ],
)
def test_donation_impact_preview_modes(
    cause_id: str,
    amount_hkd: int,
    expected_mode: str,
    expected_units: int | None,
) -> None:
    response = client.post(
        "/api/v1/donation-impact/preview",
        json={"cause_id": cause_id, "amount_hkd": amount_hkd},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["mode"] == expected_mode
    assert payload["estimated_units"] == expected_units
    assert payload["is_estimate"] is True
    if expected_mode == "flexible":
        assert payload["unit_key"] is None
    else:
        assert payload["unit_key"] is not None


@pytest.mark.parametrize(
    "payload",
    [
        {"cause_id": "dance", "amount_hkd": 9},
        {"cause_id": "dance", "amount_hkd": 1_000_001},
        {"cause_id": "unknown", "amount_hkd": 600},
        {"cause_id": "dance", "amount_hkd": 600, "estimated_units": 4},
    ],
)
def test_donation_impact_preview_rejects_invalid_input(payload: dict[str, object]) -> None:
    response = client.post("/api/v1/donation-impact/preview", json=payload)

    assert response.status_code == 422


def test_valid_donation_intent_is_simulated_and_recalculates_impact() -> None:
    profile_response = client.post(
        "/api/v1/donor-profiles",
        json={
            "email": "alex-donation@example.com",
            "password": "secret1",
            "nickname": "Alex Donation",
            "name": "Alex Lee",
            "consent_to_updates": True,
        },
    )
    assert profile_response.status_code == 201

    response = client.post(
        "/api/v1/donation-intents",
        json={
            "amount_hkd": 650,
            "cause_id": "dance",
            "anonymous": False,
        },
    )

    assert response.status_code == 201
    payload = response.json()
    assert payload["donation_intent_id"].startswith("DON-")
    assert payload["status"] == "simulated"
    assert payload["simulation"] is True
    assert payload["persistence"] == "stored"
    assert payload["impact"]["amount_hkd"] == 650
    assert payload["impact"]["mode"] == "counted"
    assert payload["impact"]["estimated_units"] == 4

    with get_connection() as conn:
        row = conn.execute(
            "SELECT * FROM donation_intents WHERE reference = ?",
            (payload["donation_intent_id"],),
        ).fetchone()

    assert row is not None
    assert row["program"] == "dance"
    assert row["amount"] == 650
    assert row["currency"] == "HKD"
    assert row["anonymous"] == 0
    assert "donor_name" not in row
    assert "donor_email" not in row
    assert "consent_to_updates" not in row


def test_identified_donation_intent_requires_a_donor_session() -> None:
    unauthenticated_client = TestClient(app)
    response = unauthenticated_client.post(
        "/api/v1/donation-intents",
        json={
            "amount_hkd": 600,
            "cause_id": "dance",
            "anonymous": False,
        },
    )

    assert response.status_code == 401


@pytest.mark.parametrize(
    "payload",
    [
        {"amount": 600, "program": "sports", "email": "alex@example.com"},
        {"amount_hkd": 600, "cause_id": "sports", "estimated_units": 999},
    ],
)
def test_donation_intent_rejects_legacy_and_extra_fields(
    payload: dict[str, object],
) -> None:
    response = client.post(
        "/api/v1/donation-intents",
        json=payload,
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
