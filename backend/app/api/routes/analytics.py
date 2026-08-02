from datetime import UTC, datetime

from fastapi import APIRouter

from app.db import get_connection
from app.schemas.analytics import (
    AnalyticsSummaryResponse,
    DonationAnalytics,
    DonationProgramRow,
    DonorAnalytics,
    QuizAnalytics,
    QuizRoundRow,
)

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/summary", response_model=AnalyticsSummaryResponse)
async def analytics_summary() -> AnalyticsSummaryResponse:
    """Server-side aggregates for the admin dashboard (PII-free)."""
    with get_connection() as conn:
        quiz_rows = conn.execute(
            "SELECT lang, COUNT(*) AS n FROM quiz_attempts GROUP BY lang ORDER BY n DESC"
        ).fetchall()
        round_rows = conn.execute(
            "SELECT round_id, COUNT(*) AS n FROM quiz_attempts"
            " GROUP BY round_id ORDER BY n DESC"
        ).fetchall()
        donation_totals = conn.execute(
            "SELECT COUNT(*) AS intents,"
            " COALESCE(SUM(amount), 0) AS total_hkd,"
            " COALESCE(SUM(anonymous = 1), 0) AS anonymous_count"
            " FROM donation_intents"
        ).fetchone()
        program_rows = conn.execute(
            "SELECT program, COUNT(*) AS intents, COALESCE(SUM(amount), 0) AS amount_hkd"
            " FROM donation_intents GROUP BY program ORDER BY intents DESC"
        ).fetchall()
        donor_counts = conn.execute(
            "SELECT COUNT(*) AS profiles FROM donor_profiles"
        ).fetchone()
        wall_count_row = conn.execute(
            "SELECT COUNT(*) AS posts FROM donor_wall_posts"
        ).fetchone()
        questionnaire_row = conn.execute(
            "SELECT COUNT(*) AS submissions FROM questionnaire_submissions"
        ).fetchone()

    return AnalyticsSummaryResponse(
        generated_at=datetime.now(UTC).isoformat(),
        questionnaire_submissions=questionnaire_row["submissions"],
        quizzes=QuizAnalytics(
            attempts=sum(row["n"] for row in quiz_rows),
            languages={row["lang"]: row["n"] for row in quiz_rows},
            rounds=[
                QuizRoundRow(round_id=row["round_id"], attempts=row["n"])
                for row in round_rows
            ],
        ),
        donations=DonationAnalytics(
            intents=donation_totals["intents"],
            total_hkd=donation_totals["total_hkd"],
            anonymous_count=donation_totals["anonymous_count"],
            programs=[
                DonationProgramRow(
                    program=row["program"],
                    intents=row["intents"],
                    amount_hkd=row["amount_hkd"],
                )
                for row in program_rows
            ],
        ),
        donors=DonorAnalytics(
            profiles=donor_counts["profiles"],
            wall_posts=wall_count_row["posts"],
        ),
    )