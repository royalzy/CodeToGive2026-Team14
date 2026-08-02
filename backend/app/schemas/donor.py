from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from app.schemas.donation import CauseId, ImpactPreviewResponse


class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class DonorProfileCreate(StrictModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)
    nickname: str = Field(min_length=1, max_length=40)
    name: str | None = Field(default=None, max_length=100)
    consent_to_updates: bool = False

    @field_validator("nickname")
    @classmethod
    def clean_nickname(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("Nickname cannot be blank.")
        return cleaned

    @field_validator("name")
    @classmethod
    def clean_name(cls, value: str | None) -> str | None:
        return value.strip() or None if value is not None else None


class DonorSessionCreate(StrictModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)


class DonorSummary(StrictModel):
    id: str
    email: EmailStr
    nickname: str
    name: str
    consent_to_updates: bool
    created_at: datetime


class DonorAuthResponse(StrictModel):
    profile: DonorSummary


class DonorDonation(StrictModel):
    donation_intent_id: str
    cause_id: CauseId
    amount_hkd: int
    currency: Literal["HKD"]
    status: Literal["simulated"] = "simulated"
    created_at: datetime
    impact: ImpactPreviewResponse


class DonorProfileResponse(StrictModel):
    profile: DonorSummary
    lifetime_amount_hkd: int
    donation_count: int
    donations: list[DonorDonation]


class WallPostCreate(StrictModel):
    message: str | None = Field(default=None, max_length=180)

    @field_validator("message")
    @classmethod
    def clean_message(cls, value: str | None) -> str | None:
        return value.strip() or None if value is not None else None


class WallPostResponse(StrictModel):
    id: str
    donation_intent_id: str
    nickname: str
    message: str | None
    status: Literal["pending"]
    created_at: datetime


class PublicWallPost(StrictModel):
    id: str
    nickname: str
    message: str | None
    created_at: datetime
