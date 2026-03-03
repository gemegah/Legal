from typing import List

from pydantic import field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    FRONTEND_URL: str = "http://localhost:3000"
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    DATABASE_URL: str
    DATABASE_POOL_SIZE: int = 20
    REDIS_URL: str = "redis://localhost:6379/0"
    JWT_SECRET: str
    JWT_ACCESS_EXPIRE_MINUTES: int = 60
    JWT_REFRESH_EXPIRE_DAYS: int = 30
    STORAGE_ENDPOINT: str
    STORAGE_ACCESS_KEY: str
    STORAGE_SECRET_KEY: str
    STORAGE_BUCKET: str = "legalos-docs"
    STORAGE_PUBLIC_URL: str
    TYPESENSE_HOST: str = "localhost"
    TYPESENSE_PORT: int = 8108
    TYPESENSE_API_KEY: str
    AI_SERVICE_URL: str = "http://localhost:8001"
    ANTHROPIC_API_KEY: str
    HUBTEL_CLIENT_ID: str = ""
    HUBTEL_CLIENT_SECRET: str = ""
    HUBTEL_CALLBACK_URL: str = ""
    PAYSTACK_SECRET_KEY: str = ""
    PAYSTACK_CALLBACK_URL: str = ""
    SENDGRID_API_KEY: str = ""
    SENDGRID_FROM: str = "noreply@legalos.gh"
    SMS_API_KEY: str = ""
    SMS_SENDER_ID: str = "LegalOS"
    WHATSAPP_TOKEN: str = ""
    WHATSAPP_PHONE_ID: str = ""

    model_config = {"env_file": ".env", "case_sensitive": True}

    @field_validator("DATABASE_URL", "JWT_SECRET", "STORAGE_ENDPOINT", "STORAGE_ACCESS_KEY", "STORAGE_SECRET_KEY", "STORAGE_PUBLIC_URL", "TYPESENSE_API_KEY", "ANTHROPIC_API_KEY")
    @classmethod
    def require_non_empty(cls, value: str) -> str:
        if not value or not value.strip():
            raise ValueError("must be provided")
        return value


settings = Settings()
