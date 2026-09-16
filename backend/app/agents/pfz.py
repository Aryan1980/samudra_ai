"""Potential Fishing Zone (PFZ) Intelligence Agent."""
from typing import List
from app.schemas.marine import Coordinates, PFZZone

class PFZIntelligenceAgent:
    def __init__(self, provider):
        self.provider = provider

    async def get_ranked_pfzs(
        self,
        coords: Coordinates,
        sort_by: str = "distance", # 'distance' | 'suitability' | 'safety' | 'combined'
        radius_km: float = 120.0
    ) -> List[PFZZone]:
        pfzs = await self.provider.get_pfz_advisories(coords, radius_km)

        if sort_by == "distance":
            pfzs.sort(key=lambda x: x.distance_km)
        elif sort_by == "suitability":
            pfzs.sort(key=lambda x: x.suitability_score, reverse=True)
        elif sort_by == "safety":
            safety_rank = {"SAFE": 1, "CAUTION": 2, "AVOID": 3}
            pfzs.sort(key=lambda x: safety_rank.get(x.safety_rating, 9))
        elif sort_by == "combined":
            # Combined score = 0.5 * suitability + 0.5 * (100 - distance/2)
            pfzs.sort(key=lambda x: (0.6 * x.suitability_score + 0.4 * max(0, 100 - x.distance_km)), reverse=True)

        return pfzs
