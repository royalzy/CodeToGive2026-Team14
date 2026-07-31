from typing import Literal

from pydantic import BaseModel, Field


class BookingCreate(BaseModel):
    member_slug: str = Field(min_length=1, max_length=80)
    event_id: str = Field(min_length=1, max_length=80)
    event_date: str = Field(min_length=1, max_length=40)


class BookingResponse(BaseModel):
    id: str
    member_slug: str
    event_id: str
    event_date: str
    status: Literal["confirmed"]
    booked_at: str
