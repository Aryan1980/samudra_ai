"""Route and waypoint schemas."""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from app.schemas.marine import Coordinates

class Waypoint(BaseModel):
    name: str
    latitude: float
    longitude: float
    hazard_distance_km: Optional[float] = None
    segment_risk: str = "LOW"

class RouteOption(BaseModel):
    route_type: str = Field(..., description="'shortest' or 'safe'")
    waypoints: List[Waypoint]
    distance_km: float
    estimated_duration_hours: float
    risk_level: str
    hazards_intersected: List[str] = Field(default_factory=list)
    description: str

class RouteComparison(BaseModel):
    origin: Coordinates
    destination: Coordinates
    shortest_route: RouteOption
    safe_route: RouteOption
    recommendation: str
    reasoning: str
