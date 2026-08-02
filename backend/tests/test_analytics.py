from fastapi.testclient import TestClient

from app.db import get_connection
from app.main import app


def _seed_database() -> None:
    with get_connection() as conn:
        conn.execute(
            "INSERT INTO quiz_attempts"
            " (id, reference, round_id, selected_statement_id, lang, answered_at)"
            " VALUES ('AN-Q1', 'AN-Q1', 'rw-analytics-test', 'st-001a', 'ko',"
            " '2026-08-02T00:00:00')"
        )
        conn.execute(
            "INSERT INTO donation_intents"
            " (id, reference, program, amount, currency, anonymous, created_at)"
            " VALUES ('AN-D1', 'AN-D1', 'sports', 12345, 'HKD', 1,"
            " '2026-08-02T00:00:00')"
        )
        conn.execute(
            "INSERT INTO donation_intents"
            " (id, reference, program, amount, currency, anonymous, created_at)"
            " VALUES ('AN-D2', 'AN-D2', 'dance', 1, 'HKD', 0,"
            " '2026-08-02T00:00:00')"
        )
        conn.execute(
            "INSERT INTO questionnaire_submissions"
            " (id, reference, path, name, email, message, consent, created_at)"
            " VALUES ('AN-F1', 'AN-F1', '/help', NULL, NULL, NULL, 1,"
            " '2026-08-02T00:00:00')"
        )


def test_analytics_summary_covers_quiz_donations_donors_and_questionnaire() -> None:
    _seed_database()

    client = TestClient(app)
    registered = client.post(
        "/api/v1/donor-profiles",
        json={
            "email": "analytics@example.com",
            "password": "secret1",
            "nickname": "Analytics Donor",
            "consent_to_updates": True,
        },
    )
    assert registered.status_code == 201
    donation = client.post(
        "/api/v1/donation-intents",
        json={"cause_id": "sports", "amount_hkd": 500, "anonymous": False},
    )
    assert donation.status_code == 201
    wall = client.post(
        f"/api/v1/donation-intents/{donation.json()['donation_intent_id']}/wall-posts",
        json={"message": "Analytics wall post"},
    )
    assert wall.status_code == 201

    response = client.get("/api/v1/analytics/summary")
    assert response.status_code == 200
    payload = response.json()

    assert payload["generated_at"]
    assert payload["questionnaire_submissions"] >= 1

    quizzes = payload["quizzes"]
    assert quizzes["attempts"] >= 1
    assert quizzes["languages"].get("ko", 0) >= 1
    assert any(
        r["round_id"] == "rw-analytics-test" and r["attempts"] >= 1
        for r in quizzes["rounds"]
    )

    donations = payload["donations"]
    assert donations["intents"] >= 3
    assert donations["total_hkd"] >= 12345 + 1 + 500
    assert donations["anonymous_count"] >= 1
    sports = next(
        (row for row in donations["programs"] if row["program"] == "sports"), None
    )
    assert sports is not None and sports["intents"] >= 1

    assert payload["donors"]["profiles"] >= 1
    assert payload["donors"]["wall_posts"] >= 1


def test_analytics_summary_is_valid_on_an_empty_surface(
    monkeypatch, tmp_path
) -> None:
    monkeypatch.setenv("LOVE21_DB_PATH", str(tmp_path / "empty.db"))
    from app import db

    db.init_db()

    client = TestClient(app)
    response = client.get("/api/v1/analytics/summary")
    assert response.status_code == 200
    payload = response.json()
    assert payload["quizzes"]["attempts"] == 0
    assert payload["quizzes"]["languages"] == {}
    assert payload["donations"]["intents"] == 0
    assert payload["donations"]["total_hkd"] == 0
    assert payload["donors"]["profiles"] == 0