import pytest
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
    response = client.post(
        "/api/v1/donation-intents",
        json={
            "amount_hkd": 650,
            "cause_id": "dance",
            "anonymous": False,
            "donor_name": "Alex Lee",
            "donor_email": "alex@example.com",
            "consent_to_updates": True,
        },
    )

    assert response.status_code == 201
    payload = response.json()
    assert payload["donation_intent_id"].startswith("DON-")
    assert payload["status"] == "simulated"
    assert payload["simulation"] is True
    assert payload["persistence"] == "none"
    assert payload["impact"]["amount_hkd"] == 650
    assert payload["impact"]["mode"] == "counted"
    assert payload["impact"]["estimated_units"] == 4


def test_donation_intent_requires_email_for_updates_preference() -> None:
    response = client.post(
        "/api/v1/donation-intents",
        json={
            "amount_hkd": 600,
            "cause_id": "dance",
            "consent_to_updates": True,
        },
    )

    assert response.status_code == 422


def test_donation_intent_rejects_legacy_and_extra_fields() -> None:
    response = client.post(
        "/api/v1/donation-intents",
        json={
            "amount_hkd": 600,
            "cause_id": "sports",
            "estimated_units": 999,
        },
    )

    assert response.status_code == 422
