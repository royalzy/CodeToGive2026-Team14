from typing import Literal

from pydantic import BaseModel, Field

Platform = Literal["instagram", "facebook"]

# Instagram's caption cap. Facebook's is far higher, so each platform is
# validated against its own limit rather than forcing the stricter one on both.
IG_MAX_CAPTION = 2200
FB_MAX_CAPTION = 63_206


class PlatformResult(BaseModel):
    """Outcome for a single platform. Platforms are published independently,
    so one can succeed while another fails."""

    platform: Platform
    status: Literal["published", "failed"]
    caption: str | None = Field(
        default=None,
        description="The caption actually used for this platform.",
    )
    permalink: str | None = None
    media_url: str | None = None
    error: str | None = Field(
        default=None,
        description="Meta's own error message when status is 'failed'.",
    )


class SocialPostResponse(BaseModel):
    # Empty for a text-only post, which Facebook supports and Instagram does
    # not. More than one becomes an Instagram carousel / Facebook multi-photo.
    image_urls: list[str] = Field(default_factory=list)
    results: list[PlatformResult]

    @property
    def any_published(self) -> bool:
        return any(result.status == "published" for result in self.results)
