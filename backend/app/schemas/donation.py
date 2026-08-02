from enum import StrEnum
from typing import Annotated, Literal

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
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


class DonationIntentResponse(StrictModel):
    donation_intent_id: str
    status: Literal["simulated"]
    simulation: Literal[True] = True
    persistence: Literal["stored"] = "stored"
    impact: ImpactPreviewResponse
