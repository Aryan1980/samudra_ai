"""Marine alert schemas."""
from typing import Optional, List
from pydantic import BaseModel, Field
from app.schemas.marine import Coordinates

class MarineAlert(BaseModel):
    id: str
    title: str
    severity: str = Field(..., description="EXTREME, HIGH, MODERATE, INFORMATIONAL")
    category: str = Field(..., description="WAVE, WIND, LIGHTNING, CYCLONE, IMBL, MPA, RESTRICTED")
    location: Coordinates
    affected_radius_km: float
    message: str
    issued_at: str
    expires_at: str
    source: str
    is_demo: bool = True
