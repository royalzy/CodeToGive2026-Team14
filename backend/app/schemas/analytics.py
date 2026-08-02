from pydantic import BaseModel


class QuizRoundRow(BaseModel):
    round_id: str
    attempts: int


class QuizAnalytics(BaseModel):
    attempts: int
    languages: dict[str, int]
    rounds: list[QuizRoundRow]


class DonationProgramRow(BaseModel):
    program: str
    intents: int
    amount_hkd: int


class DonationAnalytics(BaseModel):
    intents: int
    total_hkd: int
    anonymous_count: int
    programs: list[DonationProgramRow]


class DonorAnalytics(BaseModel):
    profiles: int
    wall_posts: int


class AnalyticsSummaryResponse(BaseModel):
    generated_at: str
    questionnaire_submissions: int
    quizzes: QuizAnalytics
    donations: DonationAnalytics
    donors: DonorAnalytics