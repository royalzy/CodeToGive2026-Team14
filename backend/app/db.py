"""SQLite persistence for the booking and donation demos.

Only bookings and the anonymized subset of donation intents are stored.
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
"""


def get_db_path() -> str:
    return os.environ.get("LOVE21_DB_PATH", str(DEFAULT_DB_PATH))


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(get_db_path())
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    with get_connection() as conn:
        conn.executescript(SCHEMA)


init_db()
