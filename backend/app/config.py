"""Configuration module for SamudraAI."""
from typing import Dict, Any, List
import os
from dotenv import load_dotenv
from pydantic import BaseModel

# Load environment variables from .env
dotenv_path = os.path.join(os.path.dirname(__file__), "..", "..", ".env")
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)
else:
    load_dotenv()

class RiskThresholds(BaseModel):
    # Wind in km/h
    WIND_MODERATE: float = 25.0
    WIND_HIGH: float = 40.0
    WIND_EXTREME: float = 55.0

    # Wave height in meters
    WAVE_MODERATE: float = 1.8
    WAVE_HIGH: float = 2.5
    WAVE_EXTREME: float = 4.0

    # Lightning distance in km
    LIGHTNING_NEARBY_KM: float = 30.0
    LIGHTNING_ACTIVE_KM: float = 10.0

    # IMBL Proximity in km (~8 NM and ~3 NM)
    IMBL_WARNING_KM: float = 15.0
    IMBL_CRITICAL_KM: float = 5.0

    # MPA Proximity in km
    MPA_WARNING_KM: float = 5.0

    # Factor Weights (must sum to 1.0)
    WEIGHT_WIND: float = 0.20
    WEIGHT_WAVE: float = 0.25
    WEIGHT_LIGHTNING: float = 0.15
    WEIGHT_CYCLONE: float = 0.25
    WEIGHT_TIDE: float = 0.05
    WEIGHT_GEOFENCE: float = 0.10

class Settings(BaseModel):
    PROJECT_NAME: str = "SamudraAI ? Agentic Marine Intelligence Platform"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    IS_DEMO_MODE: bool = False
    
    # External API Keys (read from environment)
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", os.getenv("GEMINI_API_KEY", ""))
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", os.getenv("LLM_API_KEY", ""))
    WEATHER_API_KEY: str = os.getenv("WEATHER_API_KEY", "")
    MAP_API_KEY: str = os.getenv("MAP_API_KEY", "")
    OPENWEATHER_API_KEY: str = os.getenv("OPENWEATHER_API_KEY", os.getenv("MAP_API_KEY", ""))
    SATELLITE_API_KEY: str = os.getenv("SATELLITE_API_KEY", "")
    OCEAN_API_KEY: str = os.getenv("OCEAN_API_KEY", "")

    # Risk Engine Configuration
    RISK: RiskThresholds = RiskThresholds()

    # Default Reference Location: Kochi, Kerala
    DEFAULT_LATITUDE: float = 9.9312
    DEFAULT_LONGITUDE: float = 76.2673
    DEFAULT_LOCATION_NAME: str = "Kochi, Kerala (Arabian Sea)"

settings = Settings()
