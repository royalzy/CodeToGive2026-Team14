from enum import StrEnum
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator, model_validator


class VolunteerRoleId(StrEnum):
    DANCE_ACTIVITY_BUDDY = "dance_activity_buddy"
    SPORTS_ACTIVITY_BUDDY = "sports_activity_buddy"
    COMMUNITY_EVENT_VOLUNTEER = "community_event_volunteer"


class VolunteerSessionId(StrEnum):
    SATURDAY_DANCE_PROJECT = "saturday_dance_project"
    SUNDAY_SPORTS_SESSION = "sunday_sports_session"


class VolunteerFirstStep(StrEnum):
    OBSERVE = "observe"
    TRIAL = "trial"
    INTEREST_ONLY = "interest_only"


SESSION_ROLES: dict[VolunteerSessionId, VolunteerRoleId] = {
    VolunteerSessionId.SATURDAY_DANCE_PROJECT: VolunteerRoleId.DANCE_ACTIVITY_BUDDY,
    VolunteerSessionId.SUNDAY_SPORTS_SESSION: VolunteerRoleId.SPORTS_ACTIVITY_BUDDY,
}


class VolunteerApplicationRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    role_id: VolunteerRoleId
    session_id: VolunteerSessionId | None = None
    first_step: VolunteerFirstStep
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

    @model_validator(mode="after")
    def selected_session_must_match_role(self) -> "VolunteerApplicationRequest":
        if self.session_id is None:
            return self
        if SESSION_ROLES[self.session_id] != self.role_id:
            raise ValueError("Selected session does not belong to the selected role")
        if self.first_step is VolunteerFirstStep.INTEREST_ONLY:
            raise ValueError("A selected session requires an observe or trial first step")
        return self


class VolunteerApplicationResponse(BaseModel):
    simulation: Literal[True] = True
    persistence: Literal["none"] = "none"
    status: Literal["interest_submitted", "pending_confirmation"]
    role_id: VolunteerRoleId
    session_id: VolunteerSessionId | None
    next_steps: list[str]

    @classmethod
    def create(cls, application: VolunteerApplicationRequest) -> "VolunteerApplicationResponse":
        if application.session_id is None:
            return cls(
                status="interest_submitted",
                role_id=application.role_id,
                session_id=None,
                next_steps=[
                    "This demo has recorded your preferred role and first step "
                    "for this screen only.",
                    "In a live service, Love 21 would contact you before "
                    "suggesting an activity.",
                ],
            )
        return cls(
            status="pending_confirmation",
            role_id=application.role_id,
            session_id=application.session_id,
            next_steps=[
                "This is a demonstration request, not a confirmed booking.",
                "In a live service, Love 21 would review the request before "
                "confirming the session.",
            ],
        )
