"""SQLite persistence for the booking demo.

The rest of the API remains non-persistent; only bookings are stored so the
member portal demo survives refreshes. Set ``LOVE21_DB_PATH`` to override the
database location (used by tests for isolation).
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
"""


def get_db_path() -> str:
    return os.environ.get("LOVE21_DB_PATH", str(DEFAULT_DB_PATH))


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(get_db_path())
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    with get_connection() as conn:
        conn.execute(SCHEMA)


init_db()
