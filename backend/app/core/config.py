from functools import cached_property

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Love 21 Community API"
    environment: str = "development"
    allowed_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    umami_enabled: bool = False
    umami_host: str = ""
    umami_website_id: str = ""

    # Meta Graph API publishing (Instagram Business + Facebook Page).
    # Leave meta_user_access_token empty to disable social publishing.
    meta_user_access_token: str = ""
    meta_page_id: str = ""
    # Image hosting for social posts. Meta fetches the image over the public
    # internet at publish time, so it is uploaded to Cloudinary rather than
    # served from this machine.
    cloudinary_cloud_name: str = ""
    cloudinary_api_key: str = ""
    cloudinary_api_secret: str = ""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @cached_property
    def allowed_origin_list(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.allowed_origins.split(",")
            if origin.strip()
        ]


settings = Settings()
