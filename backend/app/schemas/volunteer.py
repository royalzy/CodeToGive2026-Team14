from enum import StrEnum
from typing import Literal
from uuid import uuid4

from pydantic import BaseModel, EmailStr, Field, field_validator


class VolunteerInterest(StrEnum):
    SPORTS = "sports"
    COMMUNITY = "community"
    FAMILY_SUPPORT = "family_support"
    NUTRITION = "nutrition"
    ENRICHMENT = "enrichment"


class VolunteerAvailability(StrEnum):
    WEEKDAY = "weekday"
    EVENING = "evening"
    WEEKEND = "weekend"
    FLEXIBLE = "flexible"


class VolunteerApplicationRequest(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    interests: list[VolunteerInterest] = Field(min_length=1, max_length=5)
    availability: VolunteerAvailability
    message: str | None = Field(default=None, max_length=500)
    consent: bool

    @field_validator("name")
    @classmethod
    def name_must_include_visible_characters(cls, value: str) -> str:
        cleaned = value.strip()
        if len(cleaned) < 2:
            raise ValueError("Name must contain at least two characters")
        return cleaned

    @field_validator("consent")
    @classmethod
    def consent_must_be_true(cls, value: bool) -> bool:
        if not value:
            raise ValueError("Consent is required")
        return value


class VolunteerApplicationResponse(BaseModel):
    reference: str
    status: Literal["submitted"]
    next_steps: list[str]
    persistence: Literal["none"] = "none"

    @classmethod
    def create(cls) -> "VolunteerApplicationResponse":
        return cls(
            reference=f"VOL-{uuid4().hex[:8].upper()}",
            status="submitted",
            next_steps=[
                "Love 21 would review your interests and availability.",
                "A team member would contact you before any activity is confirmed.",
            ],
        )

