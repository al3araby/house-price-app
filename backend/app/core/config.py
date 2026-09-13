from pydantic_settings import BaseSettings, NoDecode
from pydantic import field_validator
from typing import Optional, Union, Annotated


class Settings(BaseSettings):
    # API settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "House Price Prediction API"

    # CORS
    # NoDecode stops pydantic-settings from trying to JSON-parse the raw env
    # string first, so our validator can accept plain comma-separated values
    # like the ones in .env.example (e.g. "http://a,http://b") as well as an
    # actual JSON list.
    BACKEND_CORS_ORIGINS: Annotated[list[str], NoDecode] = [
        "http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"
    ]

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def split_cors_origins(cls, v: Union[str, list[str]]) -> list[str]:
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    # Model
    MODEL_PATH: str = "models/house_price.pkl"
    LOCATIONS_PATH: str = "models/locations.json"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()