from fastapi import APIRouter, HTTPException, status

from app.schemas.quiz import (
    HeroRoundAnswerRequest,
    HeroRoundResponse,
    RevealResponse,
)
from app.services.quiz import get_hero_round, grade_hero_round

router = APIRouter(prefix="/quiz", tags=["quiz"])


@router.get("/rounds/hero", response_model=HeroRoundResponse)
async def hero_round() -> HeroRoundResponse:
    round_ = get_hero_round()
    if not round_:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No verified hero round is available.",
        )
    return HeroRoundResponse(**round_)


@router.post("/rounds/answer", response_model=RevealResponse)
async def answer_hero_round(request: HeroRoundAnswerRequest) -> RevealResponse:
    reveal = grade_hero_round(
        request.round_id,
        request.selected_statement_id,
        lang=request.lang,
    )
    if reveal is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Unknown round or statement id.",
        )
    return RevealResponse(**reveal)
