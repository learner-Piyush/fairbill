from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings read from environment variables or .env file."""

    internal_api_key: str = ""
    gemini_api_key: str = ""

    model_config = SettingsConfigDict(
        env_file=(".env", "api/.env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def INTERNAL_API_KEY(self) -> str:
        return self.internal_api_key

    @property
    def GEMINI_API_KEY(self) -> str:
        return self.gemini_api_key


def get_settings() -> Settings:
    """Return an instance of application settings."""
    return Settings()
