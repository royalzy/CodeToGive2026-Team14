from enum import StrEnum
from typing import Literal
from uuid import uuid4

from pydantic import BaseModel, EmailStr, Field, model_validator


class DonationProgram(StrEnum):
    GENERAL = "general"
    SPORTS = "sports"
    NUTRITION = "nutrition"
    ENRICHMENT = "enrichment"
    FAMILY_SUPPORT = "family_support"
    COMMUNITY = "community"


PROGRAM_MESSAGES: dict[DonationProgram, str] = {
    DonationProgram.GENERAL: "helps Love 21 direct support where it is most useful",
    DonationProgram.SPORTS: "expresses support for sports and fitness programmes",
    DonationProgram.NUTRITION: "expresses support for nutrition and dietetics programmes",
    DonationProgram.ENRICHMENT: "expresses support for enrichment and intervention programmes",
    DonationProgram.FAMILY_SUPPORT: "expresses support for families and caregivers",
    DonationProgram.COMMUNITY: "expresses support for community and education programmes",
}


class DonationIntentRequest(BaseModel):
    amount: int = Field(gt=0, le=1_000_000)
    currency: Literal["HKD"] = "HKD"
    program: DonationProgram
    anonymous: bool = False
    donor_name: str | None = Field(default=None, max_length=80)
    email: EmailStr | None = None

    @model_validator(mode="after")
    def clean_optional_name(self) -> "DonationIntentRequest":
        if self.donor_name is not None:
            self.donor_name = self.donor_name.strip() or None
        return self


class DonationIntentResponse(BaseModel):
    reference: str
    status: Literal["simulated"]
    simulation: Literal[True] = True
    impact_message: str
    acknowledgement: str
    persistence: Literal["none"] = "none"

    @classmethod
    def create(cls, program: DonationProgram) -> "DonationIntentResponse":
        return cls(
            reference=f"DON-{uuid4().hex[:8].upper()}",
            status="simulated",
            impact_message=f"Your preference {PROGRAM_MESSAGES[program]}.",
            acknowledgement=(
                "Thank you for exploring how your support could become part of "
                "the Love 21 community."
            ),
        )

