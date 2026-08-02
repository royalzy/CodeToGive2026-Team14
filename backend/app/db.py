"""SQLite persistence for the Love 21 demo journeys.

Donation payment details are never collected. Donor identity is kept in
separate tables from donation intents and connected through an explicit link.
Set ``LOVE21_DB_PATH`` to override the database location (used by tests
for isolation).
"""

import os
import sqlite3
from pathlib import Path

DEFAULT_DB_PATH = Path(__file__).resolve().parent.parent / "love21.db"

SCHEMA = """
CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    member_slug TEXT NOT NULL,
    event_id TEXT NOT NULL,
    event_date TEXT NOT NULL,
    status TEXT NOT NULL,
    booked_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS donation_intents (
    id TEXT PRIMARY KEY,
    reference TEXT NOT NULL UNIQUE,
    program TEXT NOT NULL,
    amount INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'HKD',
    anonymous INTEGER NOT NULL,
    created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS questionnaire_submissions (
    id TEXT PRIMARY KEY,
    reference TEXT NOT NULL UNIQUE,
    path TEXT NOT NULL,
    name TEXT,
    email TEXT,
    message TEXT,
    consent INTEGER NOT NULL,
    created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id TEXT PRIMARY KEY,
    reference TEXT NOT NULL UNIQUE,
    round_id TEXT NOT NULL,
    selected_statement_id TEXT NOT NULL,
    lang TEXT NOT NULL DEFAULT 'en',
    answered_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS donor_profiles (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    nickname TEXT NOT NULL UNIQUE COLLATE NOCASE,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    consent_to_updates INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS donor_sessions (
    id TEXT PRIMARY KEY,
    donor_id TEXT NOT NULL,
    token_hash TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    FOREIGN KEY (donor_id) REFERENCES donor_profiles(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS donor_sessions_token_hash_idx
    ON donor_sessions(token_hash);
CREATE TABLE IF NOT EXISTS donor_donation_links (
    donor_id TEXT NOT NULL,
    donation_intent_id TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL,
    PRIMARY KEY (donor_id, donation_intent_id),
    FOREIGN KEY (donor_id) REFERENCES donor_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (donation_intent_id) REFERENCES donation_intents(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS donor_wall_posts (
    id TEXT PRIMARY KEY,
    donor_id TEXT NOT NULL,
    donation_intent_id TEXT NOT NULL UNIQUE,
    message TEXT,
    status TEXT NOT NULL CHECK (status = 'pending'),
    created_at TEXT NOT NULL,
    FOREIGN KEY (donor_id) REFERENCES donor_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (donation_intent_id) REFERENCES donation_intents(id) ON DELETE CASCADE
);
"""


def get_db_path() -> str:
    return os.environ.get("LOVE21_DB_PATH", str(DEFAULT_DB_PATH))


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(get_db_path())
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db() -> None:
    with get_connection() as conn:
        conn.executescript(SCHEMA)


init_db()
