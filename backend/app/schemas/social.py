from typing import Literal

from pydantic import BaseModel, Field

Platform = Literal["instagram", "facebook"]


class PlatformResult(BaseModel):
    """Outcome for a single platform. Platforms are published independently,
    so one can succeed while another fails."""

    platform: Platform
    status: Literal["published", "failed"]
    permalink: str | None = None
    media_url: str | None = None
    error: str | None = Field(
        default=None,
        description="Meta's own error message when status is 'failed'.",
    )


class SocialPostResponse(BaseModel):
    caption: str
    image_url: str
    results: list[PlatformResult]

    @property
    def any_published(self) -> bool:
        return any(result.status == "published" for result in self.results)
