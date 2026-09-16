"""Geospatial Reasoning Agent."""
from typing import Dict, Any, List
from app.schemas.marine import Coordinates
from app.geo.boundaries import COASTAL_PRESETS, IMBL_BOUNDARIES, MARINE_PROTECTED_AREAS, RESTRICTED_ZONES
from app.geo.calculations import haversine_distance
from app.geo.geofence import is_point_in_polygon, distance_to_polygon

class GeospatialReasoningAgent:
    def __init__(self, provider):
        self.provider = provider

    async def analyze_location(self, coords: Coordinates) -> Dict[str, Any]:
        return await self.provider.get_boundary_contexts(coords)

    def get_all_geofences(self) -> Dict[str, Any]:
        return {
            "imbl": IMBL_BOUNDARIES,
            "mpas": MARINE_PROTECTED_AREAS,
            "restricted_zones": RESTRICTED_ZONES,
            "coastal_presets": COASTAL_PRESETS
        }
