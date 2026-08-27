import os
from pathlib import Path
from dotenv import load_dotenv

# Base Directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Load .env
load_dotenv(BASE_DIR / ".env")

class Settings:
    PROJECT_NAME: str = "AgriSense AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # AI Engine
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # Database
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    
    # Remote Sensing & Satellite
    AGROMONITORING_API_KEY: str = os.getenv("AGROMONITORING_API_KEY", "")
    
    # Storage directories for cached real raster captures
    STORAGE_DIR: Path = BASE_DIR / "storage"
    SATELLITE_DIR: Path = STORAGE_DIR / "satellite"
    VOICE_DIR: Path = STORAGE_DIR / "voice_notes"
    
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

settings = Settings()

# Ensure local storage folders exist
settings.SATELLITE_DIR.mkdir(parents=True, exist_ok=True)
settings.VOICE_DIR.mkdir(parents=True, exist_ok=True)
