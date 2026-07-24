import os

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "Vortex API"
    APP_VERSION: str = "1.0.0"
    DATABASE_URL: str = "sqlite:///./app.db"
    SECRET_KEY: str = "super-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    PORT: int = 8000
    CORS_ORIGINS: str = "https://projeto-vortex-seven.vercel.app"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()


def get_port() -> int:
    return int(os.getenv("PORT", settings.PORT))
