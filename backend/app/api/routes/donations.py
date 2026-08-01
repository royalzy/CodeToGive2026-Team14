from datetime import UTC, datetime
from uuid import uuid4

from fastapi import APIRouter, BackgroundTasks, status

from app.db import get_connection
from app.schemas.donation import DonationIntentRequest, DonationIntentResponse
from app.services.umami import track_event

router = APIRouter(prefix="/donation-intents", tags=["donation"])


@router.post(
    "",
    response_model=DonationIntentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_donation_intent(
    intent: DonationIntentRequest,
    background_tasks: BackgroundTasks,
) -> DonationIntentResponse:
    # Simulation only: no payment details are accepted. Only the anonymized
    # subset (program, amount, currency, anonymous flag) is stored.
    reference = f"DON-{uuid4().hex[:8].upper()}"
    with get_connection() as conn:
        conn.execute(
            "INSERT INTO donation_intents"
            " (id, reference, program, amount, currency, anonymous, created_at)"
            " VALUES (?, ?, ?, ?, ?, ?, ?)",
            (
                reference,
                reference,
                intent.program.value,
                intent.amount,
                intent.currency,
                1 if intent.anonymous else 0,
                datetime.now(UTC).replace(tzinfo=None).isoformat(),
            ),
        )
    background_tasks.add_task(
        track_event,
        "donation_intent",
        {"program": intent.program.value, "amount": intent.amount, "currency": intent.currency},
        url="https://love21.org/donate",
    )
    return DonationIntentResponse.create(program=intent.program, reference=reference)
