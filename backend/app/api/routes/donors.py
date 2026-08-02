import sqlite3
from datetime import UTC, datetime
from typing import Annotated
from uuid import uuid4

from fastapi import APIRouter, Cookie, Depends, HTTPException, Response, status

from app.db import get_connection
from app.schemas.donation import CauseId, ImpactPreviewRequest
from app.schemas.donor import (
    DonorAuthResponse,
    DonorDonation,
    DonorProfileCreate,
    DonorProfileResponse,
    DonorSessionCreate,
    DonorSummary,
    PublicWallPost,
    WallPostCreate,
    WallPostResponse,
)
from app.services.donation_impact import calculate_impact
from app.services.donor_auth import (
    DUMMY_PASSWORD_HASH,
    SESSION_COOKIE_NAME,
    CurrentDonor,
    clear_donor_session,
    password_hash,
    require_current_donor,
    set_donor_session,
)

router = APIRouter(tags=["donors"])


def _summary(donor: CurrentDonor) -> DonorSummary:
    return DonorSummary(
        id=donor.id,
        email=donor.email,
        nickname=donor.nickname,
        name=donor.name,
        consent_to_updates=donor.consent_to_updates,
        created_at=donor.created_at,
    )


def _load_donor(donor_id: str) -> CurrentDonor:
    with get_connection() as conn:
        row = conn.execute(
            "SELECT * FROM donor_profiles WHERE id = ?", (donor_id,)
        ).fetchone()
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Donor not found.")
    return CurrentDonor(
        id=row["id"],
        email=row["email"],
        nickname=row["nickname"],
        name=row["name"],
        consent_to_updates=bool(row["consent_to_updates"]),
        created_at=row["created_at"],
    )


def _conflict_detail(email: str, nickname: str) -> dict[str, str]:
    with get_connection() as conn:
        if conn.execute(
            "SELECT 1 FROM donor_profiles WHERE email = ? COLLATE NOCASE", (email,)
        ).fetchone():
            return {"code": "email_taken", "message": "That email already has a donor profile."}
        if conn.execute(
            "SELECT 1 FROM donor_profiles WHERE nickname = ? COLLATE NOCASE", (nickname,)
        ).fetchone():
            return {"code": "nickname_taken", "message": "That nickname is already in use."}
    return {"code": "profile_conflict", "message": "That donor profile already exists."}


@router.post(
    "/donor-profiles",
    response_model=DonorAuthResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_donor_profile(payload: DonorProfileCreate, response: Response) -> DonorAuthResponse:
    email = str(payload.email).strip().lower()
    nickname = payload.nickname.strip()
    donor_id = f"DNR-{uuid4().hex[:12].upper()}"
    created_at = datetime.now(UTC).isoformat()
    try:
        with get_connection() as conn:
            conn.execute(
                "INSERT INTO donor_profiles"
                " (id, email, nickname, name, password_hash, consent_to_updates, created_at)"
                " VALUES (?, ?, ?, ?, ?, ?, ?)",
                (
                    donor_id,
                    email,
                    nickname,
                    payload.name or nickname,
                    password_hash.hash(payload.password),
                    1 if payload.consent_to_updates else 0,
                    created_at,
                ),
            )
    except sqlite3.IntegrityError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=_conflict_detail(email, nickname),
        ) from error

    donor = _load_donor(donor_id)
    set_donor_session(response, donor.id)
    return DonorAuthResponse(profile=_summary(donor))


@router.post("/donor-sessions", response_model=DonorAuthResponse)
def create_donor_session(payload: DonorSessionCreate, response: Response) -> DonorAuthResponse:
    email = str(payload.email).strip().lower()
    with get_connection() as conn:
        row = conn.execute(
            "SELECT * FROM donor_profiles WHERE email = ? COLLATE NOCASE", (email,)
        ).fetchone()

    stored_hash = row["password_hash"] if row is not None else DUMMY_PASSWORD_HASH
    matches = password_hash.verify(payload.password, stored_hash)
    if row is None or not matches:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="The email or password is incorrect.",
        )

    donor = _load_donor(row["id"])
    set_donor_session(response, donor.id)
    return DonorAuthResponse(profile=_summary(donor))


@router.delete("/donor-sessions/current", status_code=status.HTTP_204_NO_CONTENT)
def delete_donor_session(
    response: Response,
    token: Annotated[str | None, Cookie(alias=SESSION_COOKIE_NAME)] = None,
) -> None:
    clear_donor_session(response, token)


@router.get("/donor-profiles/me", response_model=DonorProfileResponse)
def get_my_donor_profile(
    donor: Annotated[CurrentDonor, Depends(require_current_donor)],
) -> DonorProfileResponse:
    with get_connection() as conn:
        rows = conn.execute(
            "SELECT i.* FROM donor_donation_links l"
            " JOIN donation_intents i ON i.id = l.donation_intent_id"
            " WHERE l.donor_id = ? ORDER BY i.created_at DESC",
            (donor.id,),
        ).fetchall()

    donations = [
        DonorDonation(
            donation_intent_id=row["reference"],
            cause_id=row["program"],
            amount_hkd=row["amount"],
            currency=row["currency"],
            created_at=row["created_at"],
            impact=calculate_impact(
                ImpactPreviewRequest(
                    cause_id=CauseId(row["program"]),
                    amount_hkd=row["amount"],
                )
            ),
        )
        for row in rows
    ]
    return DonorProfileResponse(
        profile=_summary(donor),
        lifetime_amount_hkd=sum(item.amount_hkd for item in donations),
        donation_count=len(donations),
        donations=donations,
    )


@router.post(
    "/donation-intents/{donation_intent_id}/wall-posts",
    response_model=WallPostResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_wall_post(
    donation_intent_id: str,
    payload: WallPostCreate,
    donor: Annotated[CurrentDonor, Depends(require_current_donor)],
) -> WallPostResponse:
    with get_connection() as conn:
        owned = conn.execute(
            "SELECT 1 FROM donor_donation_links"
            " WHERE donor_id = ? AND donation_intent_id = ?",
            (donor.id, donation_intent_id),
        ).fetchone()
        if owned is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="That donation was not found in your donor profile.",
            )

        post_id = f"WALL-{uuid4().hex[:12].upper()}"
        created_at = datetime.now(UTC).isoformat()
        try:
            conn.execute(
                "INSERT INTO donor_wall_posts"
                " (id, donor_id, donation_intent_id, message, status, created_at)"
                " VALUES (?, ?, ?, ?, 'pending', ?)",
                (post_id, donor.id, donation_intent_id, payload.message, created_at),
            )
        except sqlite3.IntegrityError as error:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail={
                    "code": "wall_post_exists",
                    "message": "A wall preview already exists for this donation.",
                },
            ) from error

    return WallPostResponse(
        id=post_id,
        donation_intent_id=donation_intent_id,
        nickname=donor.nickname,
        message=payload.message,
        status="pending",
        created_at=created_at,
    )


@router.get("/donor-wall/me", response_model=list[WallPostResponse])
def get_my_wall_posts(
    donor: Annotated[CurrentDonor, Depends(require_current_donor)],
) -> list[WallPostResponse]:
    with get_connection() as conn:
        rows = conn.execute(
            "SELECT * FROM donor_wall_posts"
            " WHERE donor_id = ? ORDER BY created_at DESC",
            (donor.id,),
        ).fetchall()
    return [
        WallPostResponse(
            id=row["id"],
            donation_intent_id=row["donation_intent_id"],
            nickname=donor.nickname,
            message=row["message"],
            status="pending",
            created_at=row["created_at"],
        )
        for row in rows
    ]


@router.get("/donor-wall/public", response_model=list[PublicWallPost])
def get_public_wall_posts(
    limit: int = 50,
) -> list[PublicWallPost]:
    """The public "hall of appreciation": recent wall messages without identity.

    Only nickname, message, and timestamp are exposed — never the donation id
    or the donor's profile id.
    """
    with get_connection() as conn:
        rows = conn.execute(
            "SELECT w.id, p.nickname, w.message, w.created_at"
            " FROM donor_wall_posts w"
            " JOIN donor_profiles p ON p.id = w.donor_id"
            " ORDER BY w.created_at DESC LIMIT ?",
            (max(1, min(limit, 100)),),
        ).fetchall()
    return [
        PublicWallPost(
            id=row["id"],
            nickname=row["nickname"],
            message=row["message"],
            created_at=row["created_at"],
        )
        for row in rows
    ]
