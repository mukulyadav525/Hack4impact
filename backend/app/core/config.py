from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "GovTrack AI"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "yoursecretkeyhere"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/govtrack"
    REDIS_HOST: str = "localhost"
    REDIS_URL: Optional[str] = None
    OPENAI_API_KEY: str = "your_openai_api_key"

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"

settings = Settings()
