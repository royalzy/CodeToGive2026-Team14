from datetime import UTC, datetime, timedelta

from fastapi.testclient import TestClient

from app.db import get_connection
from app.main import app
from app.services.donor_auth import hash_session_token


def register(
    client: TestClient,
    *,
    email: str,
    nickname: str,
) -> dict[str, object]:
    response = client.post(
        "/api/v1/donor-profiles",
        json={
            "email": email,
            "password": "secret1",
            "nickname": nickname,
            "name": None,
            "consent_to_updates": True,
        },
    )
    assert response.status_code == 201
    return response.json()


def donate(client: TestClient, amount: int = 600) -> str:
    response = client.post(
        "/api/v1/donation-intents",
        json={"cause_id": "dance", "amount_hkd": amount, "anonymous": False},
    )
    assert response.status_code == 201
    return str(response.json()["donation_intent_id"])


def test_profile_registration_hashes_password_and_starts_session() -> None:
    client = TestClient(app)
    payload = register(client, email="new-donor@example.com", nickname="New Donor")

    assert payload["profile"]["name"] == "New Donor"
    assert client.get("/api/v1/donor-profiles/me").status_code == 200

    with get_connection() as conn:
        row = conn.execute(
            "SELECT * FROM donor_profiles WHERE email = ?", ("new-donor@example.com",)
        ).fetchone()
        session = conn.execute(
            "SELECT * FROM donor_sessions WHERE donor_id = ?", (row["id"],)
        ).fetchone()

    assert row["password_hash"].startswith("$argon2")
    assert "secret1" not in row["password_hash"]
    assert session is not None
    assert session["token_hash"] != client.cookies.get("love21_donor_session")


def test_profile_email_and_nickname_are_unique_case_insensitively() -> None:
    first = TestClient(app)
    register(first, email="case@example.com", nickname="Case Nick")

    duplicate_email = TestClient(app).post(
        "/api/v1/donor-profiles",
        json={
            "email": "CASE@example.com",
            "password": "secret1",
            "nickname": "Another Nick",
            "consent_to_updates": False,
        },
    )
    assert duplicate_email.status_code == 409
    assert duplicate_email.json()["detail"]["code"] == "email_taken"

    duplicate_nickname = TestClient(app).post(
        "/api/v1/donor-profiles",
        json={
            "email": "another-case@example.com",
            "password": "secret1",
            "nickname": "case nick",
            "consent_to_updates": False,
        },
    )
    assert duplicate_nickname.status_code == 409
    assert duplicate_nickname.json()["detail"]["code"] == "nickname_taken"


def test_login_logout_and_expired_sessions() -> None:
    client = TestClient(app)
    register(client, email="login@example.com", nickname="Login Donor")
    assert client.delete("/api/v1/donor-sessions/current").status_code == 204
    assert client.get("/api/v1/donor-profiles/me").status_code == 401

    invalid = client.post(
        "/api/v1/donor-sessions",
        json={"email": "missing@example.com", "password": "wrong-password"},
    )
    assert invalid.status_code == 401
    assert invalid.json()["detail"] == "The email or password is incorrect."

    logged_in = client.post(
        "/api/v1/donor-sessions",
        json={"email": "LOGIN@example.com", "password": "secret1"},
    )
    assert logged_in.status_code == 200
    raw_token = client.cookies.get("love21_donor_session")
    with get_connection() as conn:
        conn.execute(
            "UPDATE donor_sessions SET expires_at = ? WHERE token_hash = ?",
            (
                (datetime.now(UTC) - timedelta(minutes=1)).isoformat(),
                hash_session_token(raw_token),
            ),
        )
    assert client.get("/api/v1/donor-profiles/me").status_code == 401


def test_authenticated_donation_appears_in_profile_and_anonymous_does_not() -> None:
    client = TestClient(app)
    register(client, email="profile-gifts@example.com", nickname="Gift Donor")
    donation_id = donate(client, 600)
    anonymous = client.post(
        "/api/v1/donation-intents",
        json={"cause_id": "sports", "amount_hkd": 200, "anonymous": True},
    )
    assert anonymous.status_code == 201

    profile = client.get("/api/v1/donor-profiles/me")
    assert profile.status_code == 200
    payload = profile.json()
    assert payload["donation_count"] == 1
    assert payload["lifetime_amount_hkd"] == 600
    assert payload["donations"][0]["donation_intent_id"] == donation_id
    assert payload["donations"][0]["impact"]["estimated_units"] == 4


def test_wall_post_is_private_owned_and_limited_to_one_per_donation() -> None:
    donor_a = TestClient(app)
    register(donor_a, email="wall-a@example.com", nickname="Wall A")
    donation_id = donate(donor_a)

    created = donor_a.post(
        f"/api/v1/donation-intents/{donation_id}/wall-posts",
        json={"message": "  Keep this work going.  "},
    )
    assert created.status_code == 201
    assert created.json()["message"] == "Keep this work going."
    assert created.json()["status"] == "pending"

    own_wall = donor_a.get("/api/v1/donor-wall/me")
    assert own_wall.status_code == 200
    assert [post["nickname"] for post in own_wall.json()] == ["Wall A"]

    duplicate = donor_a.post(
        f"/api/v1/donation-intents/{donation_id}/wall-posts",
        json={"message": None},
    )
    assert duplicate.status_code == 409

    empty_message_donation = donate(donor_a, 500)
    empty_message = donor_a.post(
        f"/api/v1/donation-intents/{empty_message_donation}/wall-posts",
        json={"message": "   "},
    )
    assert empty_message.status_code == 201
    assert empty_message.json()["message"] is None

    donor_b = TestClient(app)
    register(donor_b, email="wall-b@example.com", nickname="Wall B")
    assert donor_b.get("/api/v1/donor-wall/me").json() == []
    not_owned = donor_b.post(
        f"/api/v1/donation-intents/{donation_id}/wall-posts",
        json={"message": "Not mine"},
    )
    assert not_owned.status_code == 404

    too_long = donor_a.post(
        f"/api/v1/donation-intents/{donate(donor_a, 400)}/wall-posts",
        json={"message": "x" * 181},
    )
    assert too_long.status_code == 422


def test_public_wall_exposes_nickname_message_time_without_identity() -> None:
    donor = TestClient(app)
    register(donor, email="pubwall@example.com", nickname="Public Wall Donor")
    donation_id = donate(donor, 600)
    created = donor.post(
        f"/api/v1/donation-intents/{donation_id}/wall-posts",
        json={"message": "Proud to support this work."},
    )
    assert created.status_code == 201

    anonymous_visitor = TestClient(app)
    feed = anonymous_visitor.get("/api/v1/donor-wall/public")
    assert feed.status_code == 200
    posts = feed.json()
    assert any(
        post["nickname"] == "Public Wall Donor"
        and post["message"] == "Proud to support this work."
        for post in posts
    )
    exposed = {post["nickname"] for post in posts if post["nickname"] == "Public Wall Donor"}
    assert len(exposed) == 1
    sample = next(post for post in posts if post["nickname"] == "Public Wall Donor")
    assert set(sample) == {"id", "nickname", "message", "created_at"}
