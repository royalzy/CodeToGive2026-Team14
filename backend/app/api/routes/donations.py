from uuid import uuid4

from fastapi import APIRouter, status

from app.data.impact_rules import CAUSE_ORDER, IMPACT_RULES
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
) -> DonationIntentResponse:
    # This is a simulation. No payment details are accepted and nothing is persisted.
    impact = calculate_impact(
        ImpactPreviewRequest(
            cause_id=intent.cause_id,
            amount_hkd=intent.amount_hkd,
        )
    )
    return DonationIntentResponse(
        donation_intent_id=f"DON-{uuid4().hex[:8].upper()}",
        status="simulated",
        impact=impact,
    )
