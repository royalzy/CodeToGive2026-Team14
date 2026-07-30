from fastapi import APIRouter, status

from app.schemas.donation import DonationIntentRequest, DonationIntentResponse

router = APIRouter(prefix="/donation-intents", tags=["donation"])


@router.post(
    "",
    response_model=DonationIntentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_donation_intent(
    intent: DonationIntentRequest,
) -> DonationIntentResponse:
    # This is a simulation. No payment details are accepted and nothing is persisted.
    return DonationIntentResponse.create(program=intent.program)

