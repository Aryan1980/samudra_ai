"""Ocean Analytics Agent."""
from app.schemas.marine import Coordinates, MarineObservation

class OceanAnalyticsAgent:
    def __init__(self, provider):
        self.provider = provider

    async def get_ocean_analytics(self, coords: Coordinates) -> MarineObservation:
        return await self.provider.get_ocean_conditions(coords)
