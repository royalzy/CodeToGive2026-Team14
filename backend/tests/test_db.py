import sqlite3

from app import db


def test_init_db_migrates_legacy_pending_only_wall_posts(monkeypatch, tmp_path) -> None:
    database_path = tmp_path / "legacy.db"
    legacy_schema = db.SCHEMA.replace(
        "CHECK (status IN ('pending', 'approved', 'rejected'))",
        "CHECK (status = 'pending')",
    )

    with sqlite3.connect(database_path) as conn:
        conn.executescript(legacy_schema)
        conn.execute(
            "INSERT INTO donor_profiles"
            " (id, email, nickname, name, password_hash, consent_to_updates, created_at)"
            " VALUES ('DONOR-LEGACY', 'legacy@example.com', 'Legacy', 'Legacy',"
            " 'hash', 0, '2026-08-02T00:00:00+00:00')"
        )
        conn.execute(
            "INSERT INTO donation_intents"
            " (id, reference, program, amount, currency, anonymous, created_at)"
            " VALUES ('DON-LEGACY', 'DON-LEGACY', 'dance', 100, 'HKD', 0,"
            " '2026-08-02T00:00:00+00:00')"
        )
        conn.execute(
            "INSERT INTO donor_wall_posts"
            " (id, donor_id, donation_intent_id, message, status, created_at)"
            " VALUES ('WALL-LEGACY', 'DONOR-LEGACY', 'DON-LEGACY', 'Keep me', 'pending',"
            " '2026-08-02T00:00:00+00:00')"
        )

    monkeypatch.setenv("LOVE21_DB_PATH", str(database_path))
    db.init_db()

    with db.get_connection() as conn:
        migrated = conn.execute(
            "SELECT message, status FROM donor_wall_posts WHERE id = 'WALL-LEGACY'"
        ).fetchone()
        conn.execute(
            "UPDATE donor_wall_posts SET status = 'approved' WHERE id = 'WALL-LEGACY'"
        )

    assert dict(migrated) == {"message": "Keep me", "status": "pending"}
