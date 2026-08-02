from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from hashlib import sha256
from secrets import token_urlsafe
from typing import Annotated
from uuid import uuid4

from fastapi import Cookie, HTTPException, Response, status
from pwdlib import PasswordHash

from app.core.config import settings
from app.db import get_connection

SESSION_COOKIE_NAME = "love21_donor_session"
SESSION_LIFETIME = timedelta(days=30)
password_hash = PasswordHash.recommended()
DUMMY_PASSWORD_HASH = password_hash.hash("love21-dummy-password")


@dataclass(frozen=True)
class CurrentDonor:
    id: str
    email: str
    nickname: str
    name: str
    consent_to_updates: bool
    created_at: str


def hash_session_token(token: str) -> str:
    return sha256(token.encode("utf-8")).hexdigest()


def set_donor_session(response: Response, donor_id: str) -> None:
    now = datetime.now(UTC)
    expires_at = now + SESSION_LIFETIME
    token = token_urlsafe(32)
    with get_connection() as conn:
        conn.execute(
            "INSERT INTO donor_sessions"
            " (id, donor_id, token_hash, created_at, expires_at)"
            " VALUES (?, ?, ?, ?, ?)",
            (
                f"SES-{uuid4().hex.upper()}",
                donor_id,
                hash_session_token(token),
                now.isoformat(),
                expires_at.isoformat(),
            ),
        )
    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=token,
        max_age=int(SESSION_LIFETIME.total_seconds()),
        expires=expires_at,
        path="/api/v1",
        httponly=True,
        secure=settings.environment.lower() not in {"development", "test"},
        samesite="lax",
    )


def clear_donor_session(response: Response, token: str | None) -> None:
    if token:
        with get_connection() as conn:
            conn.execute(
                "DELETE FROM donor_sessions WHERE token_hash = ?",
                (hash_session_token(token),),
            )
    response.delete_cookie(
        SESSION_COOKIE_NAME,
        path="/api/v1",
        httponly=True,
        secure=settings.environment.lower() not in {"development", "test"},
        samesite="lax",
    )


def _find_current_donor(token: str | None) -> CurrentDonor | None:
    if not token:
        return None
    now = datetime.now(UTC).isoformat()
    with get_connection() as conn:
        row = conn.execute(
            "SELECT p.* FROM donor_sessions s"
            " JOIN donor_profiles p ON p.id = s.donor_id"
            " WHERE s.token_hash = ? AND s.expires_at > ?",
            (hash_session_token(token), now),
        ).fetchone()
    if row is None:
        return None
    return CurrentDonor(
        id=row["id"],
        email=row["email"],
        nickname=row["nickname"],
        name=row["name"],
        consent_to_updates=bool(row["consent_to_updates"]),
        created_at=row["created_at"],
    )


def get_optional_current_donor(
    token: Annotated[str | None, Cookie(alias=SESSION_COOKIE_NAME)] = None,
) -> CurrentDonor | None:
    return _find_current_donor(token)


def require_current_donor(
    token: Annotated[str | None, Cookie(alias=SESSION_COOKIE_NAME)] = None,
) -> CurrentDonor:
    donor = _find_current_donor(token)
    if donor is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sign in to your donor profile to continue.",
        )
    return donor
