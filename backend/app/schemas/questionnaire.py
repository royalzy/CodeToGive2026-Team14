from enum import StrEnum
from typing import Literal
from uuid import uuid4

from pydantic import BaseModel, EmailStr, Field, model_validator


class HelpPath(StrEnum):
    CHILD = "child"
    ADULT = "adult"
    FAMILY = "family"
    OTHER = "other"


PATH_LABELS: dict[HelpPath, str] = {
    HelpPath.CHILD: "explore the children's programmes",
    HelpPath.ADULT: "explore the adult programmes",
    HelpPath.FAMILY: "get in touch with family and carer support",
    HelpPath.OTHER: "talk to the team about the right support",
}


class QuestionnaireRequest(BaseModel):
    path: HelpPath
    name: str | None = Field(default=None, max_length=80)
    email: EmailStr | None = None
    message: str | None = Field(default=None, max_length=2000)
    consent: bool = False

    @model_validator(mode="after")
    def clean_optional_fields(self) -> "QuestionnaireRequest":
        if self.name is not None:
            self.name = self.name.strip() or None
        if self.message is not None:
            self.message = self.message.strip() or None
        return self


class QuestionnaireResponse(BaseModel):
    reference: str
    status: Literal["submitted"]
    suggested_path: str
    persistence: Literal["stored"] = "stored"

    @classmethod
    def create(cls, path: HelpPath, reference: str | None = None) -> "QuestionnaireResponse":
        return cls(
            reference=reference or f"QNR-{uuid4().hex[:8].upper()}",
            status="submitted",
            suggested_path=PATH_LABELS[path],
        )
