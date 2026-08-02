from pydantic import BaseModel, Field


class HeroRoundAnswerRequest(BaseModel):
    round_id: str = Field(min_length=1)
    selected_statement_id: str = Field(min_length=1)
    lang: str = Field(default="en", max_length=8)


class HeroRoundStatement(BaseModel):
    id: str
    text: str


class HeroRoundResponse(BaseModel):
    id: str
    theme: str | None = None
    kick: str | None = None
    twist: str
    statements: list[HeroRoundStatement]


class RevealStatement(BaseModel):
    id: str
    is_myth: bool
    reveal: str
    source: dict


class RevealResponse(BaseModel):
    round_id: str
    twist: str
    punchline: str
    selected_statement_id: str
    statements: list[RevealStatement]
