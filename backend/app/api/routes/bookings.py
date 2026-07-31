from datetime import UTC, datetime, timedelta
from uuid import uuid4

from fastapi import APIRouter, HTTPException, status

from app.db import get_connection
from app.schemas.booking import BookingCreate, BookingResponse

router = APIRouter(prefix="/bookings", tags=["bookings"])

MAX_PER_WEEK = 4
MAX_PER_DAY = 2


def _count_since(member_slug: str, since: datetime) -> int:
    with get_connection() as conn:
        row = conn.execute(
            "SELECT COUNT(*) FROM bookings WHERE member_slug = ? AND booked_at >= ?",
            (member_slug, since.isoformat()),
        ).fetchone()
    return int(row[0])


@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(payload: BookingCreate) -> BookingResponse:
    now = datetime.now(UTC).replace(tzinfo=None)

    if _count_since(payload.member_slug, now - timedelta(days=7)) >= MAX_PER_WEEK:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Weekly booking limit reached for this member.",
        )

    day_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    if _count_since(payload.member_slug, day_start) >= MAX_PER_DAY:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Daily booking limit reached for this member.",
        )

    booking_id = f"BK-{uuid4().hex[:8].upper()}"
    booked_at = now.isoformat()

    with get_connection() as conn:
        conn.execute(
            "INSERT INTO bookings (id, member_slug, event_id, event_date, status, booked_at)"
            " VALUES (?, ?, ?, ?, ?, ?)",
            (
                booking_id,
                payload.member_slug,
                payload.event_id,
                payload.event_date,
                "confirmed",
                booked_at,
            ),
        )

    return BookingResponse(
        id=booking_id,
        member_slug=payload.member_slug,
        event_id=payload.event_id,
        event_date=payload.event_date,
        status="confirmed",
        booked_at=booked_at,
    )


@router.get("", response_model=list[BookingResponse])
def list_bookings(member_slug: str | None = None) -> list[BookingResponse]:
    with get_connection() as conn:
        if member_slug is None:
            rows = conn.execute("SELECT * FROM bookings").fetchall()
        else:
            rows = conn.execute(
                "SELECT * FROM bookings WHERE member_slug = ?", (member_slug,)
            ).fetchall()
    return [BookingResponse(**dict(row)) for row in rows]
