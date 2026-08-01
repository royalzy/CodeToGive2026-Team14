from datetime import UTC, datetime
from uuid import uuid4

from fastapi import APIRouter, BackgroundTasks, HTTPException, status

from app.db import get_connection
from app.schemas.questionnaire import (
    QuestionnaireRequest,
    QuestionnaireResponse,
)
from app.services.umami import track_event

router = APIRouter(prefix="/questionnaire-submissions", tags=["questionnaire"])


@router.post(
    "",
    response_model=QuestionnaireResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_questionnaire_submission(
    submission: QuestionnaireRequest,
    background_tasks: BackgroundTasks,
) -> QuestionnaireResponse:
    if not submission.consent:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="Consent is required to submit the questionnaire.",
        )

    reference = f"QNR-{uuid4().hex[:8].upper()}"
    with get_connection() as conn:
        conn.execute(
            "INSERT INTO questionnaire_submissions"
            " (id, reference, path, name, email, message, consent, created_at)"
            " VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            (
                reference,
                reference,
                submission.path.value,
                submission.name,
                submission.email,
                submission.message,
                1 if submission.consent else 0,
                datetime.now(UTC).replace(tzinfo=None).isoformat(),
            ),
        )
    # Only the help path is shared with analytics; the name, email and message
    # stay in the local database.
    background_tasks.add_task(
        track_event,
        "questionnaire_completed",
        {"path": submission.path.value},
        url="https://love21.org/help",
    )
    return QuestionnaireResponse.create(path=submission.path, reference=reference)
