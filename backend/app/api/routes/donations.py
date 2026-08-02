from datetime import UTC, datetime
from typing import Annotated
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status

from app.data.impact_rules import CAUSE_ORDER, IMPACT_RULES
from app.db import get_connection
from app.schemas.donation import (
    CauseId,
    DonationCauseOption,
    DonationImpactOptionsResponse,
    DonationIntentRequest,
    DonationIntentResponse,
    ImpactPreviewRequest,
    ImpactPreviewResponse,
)
from app.services.donation_impact import calculate_impact
from app.services.donor_auth import CurrentDonor, get_optional_current_donor

router = APIRouter(tags=["donation"])


@router.get(
    "/donation-impact/options",
    response_model=DonationImpactOptionsResponse,
)
async def get_donation_impact_options() -> DonationImpactOptionsResponse:
    return DonationImpactOptionsResponse(
        default_cause_id=CauseId.WHERE_NEEDED_MOST,
        preset_amounts_hkd=[200, 400, 600, 1000],
        causes=[
            DonationCauseOption(
                cause_id=cause_id,
                copy_key=IMPACT_RULES[cause_id].copy_key,
            )
            for cause_id in CAUSE_ORDER
        ],
    )


@router.post(
    "/donation-impact/preview",
    response_model=ImpactPreviewResponse,
)
async def preview_donation_impact(
    request: ImpactPreviewRequest,
) -> ImpactPreviewResponse:
    return calculate_impact(request)


@router.post(
    "/donation-intents",
    response_model=DonationIntentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_donation_intent(
    intent: DonationIntentRequest,
    donor: Annotated[CurrentDonor | None, Depends(get_optional_current_donor)],
) -> DonationIntentResponse:
    # Simulation only: no money moves. Identity remains in donor_profiles and
    # is connected here only through a non-public link row.
    if not intent.anonymous and donor is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sign in to your donor profile before confirming this donation.",
        )
    impact = calculate_impact(
        ImpactPreviewRequest(
            cause_id=intent.cause_id,
            amount_hkd=intent.amount_hkd,
        )
    )
    reference = f"DON-{uuid4().hex[:8].upper()}"
    created_at = datetime.now(UTC).isoformat()
    with get_connection() as conn:
        conn.execute(
            "INSERT INTO donation_intents"
            " (id, reference, program, amount, currency, anonymous, created_at)"
            " VALUES (?, ?, ?, ?, ?, ?, ?)",
            (
                reference,
                reference,
                intent.cause_id.value,
                intent.amount_hkd,
                "HKD",
                1 if intent.anonymous else 0,
                created_at,
            ),
        )
        if donor is not None and not intent.anonymous:
            conn.execute(
                "INSERT INTO donor_donation_links"
                " (donor_id, donation_intent_id, created_at) VALUES (?, ?, ?)",
                (donor.id, reference, created_at),
            )
    return DonationIntentResponse(
        donation_intent_id=reference,
        status="simulated",
        impact=impact,
    )
