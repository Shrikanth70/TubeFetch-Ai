import os
from pathlib import Path
from typing import List, Union
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import BeforeValidator
from typing_extensions import Annotated

APP_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = APP_DIR.parent
DOWNLOADS_DIR = BACKEND_DIR / "downloads"

def parse_cors_origins(v: Union[str, List[str]]) -> List[str]:
    if isinstance(v, str) and not v.startswith("["):
        return [i.strip() for i in v.split(",")]
    elif isinstance(v, (list, str)):
        return v
    return []

class Settings(BaseSettings):
    PROJECT_NAME: str = "TubeFetch AI"
    API_V1_STR: str = "/api/v1"
    
    BACKEND_CORS_ORIGINS: Annotated[
        List[str], BeforeValidator(parse_cors_origins)
    ] = ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"]

    DOWNLOAD_DIR: Path = DOWNLOADS_DIR

    model_config = SettingsConfigDict(
        env_file=os.path.join(BACKEND_DIR, ".env"),
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()
