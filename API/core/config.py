from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    cors_origins: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    api_title: str = "UPESustentabilidade API"
    api_version: str = "1.0.0"
    api_prefix: str = "/api/v1"
    max_upload_size: int = 10 * 1024 * 1024


settings = Settings()
