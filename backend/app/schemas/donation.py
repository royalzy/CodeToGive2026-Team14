from enum import StrEnum
from typing import Annotated, Literal

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    field_validator,
    model_validator,
)


class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class CauseId(StrEnum):
    WHERE_NEEDED_MOST = "where_needed_most"
    DANCE = "dance"
    SPORTS = "sports"
    NUTRITION = "nutrition"
    FAMILY_SUPPORT = "family_support"


class DonationCauseOption(StrictModel):
    cause_id: CauseId
    copy_key: str


class DonationImpactOptionsResponse(StrictModel):
    default_cause_id: CauseId
    preset_amounts_hkd: list[int]
    causes: list[DonationCauseOption]
    demo_estimates: Literal[True] = True


class ImpactPreviewRequest(StrictModel):
    cause_id: CauseId
    amount_hkd: int = Field(ge=10, le=1_000_000)


class ImpactBase(StrictModel):
    cause_id: CauseId
    amount_hkd: int
    copy_key: str
    is_estimate: Literal[True] = True


class CountedImpact(ImpactBase):
    mode: Literal["counted"] = "counted"
    estimated_units: int = Field(gt=0)
    unit_key: str


class ContributionImpact(ImpactBase):
    mode: Literal["contribution"] = "contribution"
    estimated_units: None = None
    unit_key: str


class FlexibleImpact(ImpactBase):
    mode: Literal["flexible"] = "flexible"
    estimated_units: None = None
    unit_key: None = None


ImpactPreviewResponse = Annotated[
    CountedImpact | ContributionImpact | FlexibleImpact,
    Field(discriminator="mode"),
]


class DonationIntentRequest(StrictModel):
    cause_id: CauseId
    amount_hkd: int = Field(ge=10, le=1_000_000)
    anonymous: bool = False
    donor_name: str | None = Field(default=None, max_length=100)
    donor_email: EmailStr | None = None
    consent_to_updates: bool = False

    @field_validator("donor_name")
    @classmethod
    def clean_optional_name(cls, value: str | None) -> str | None:
        return value.strip() or None if value is not None else None

    @model_validator(mode="after")
    def require_email_for_updates(self) -> "DonationIntentRequest":
        if self.consent_to_updates and self.donor_email is None:
            raise ValueError("An email address is required to express an updates preference.")
        return self


class DonationIntentResponse(StrictModel):
    donation_intent_id: str
    status: Literal["simulated"]
    simulation: Literal[True] = True
    persistence: Literal["stored"] = "stored"
    impact: ImpactPreviewResponse
