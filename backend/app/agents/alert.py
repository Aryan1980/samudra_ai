"""Marine Alert Agent."""
from typing import List
from app.schemas.marine import Coordinates
from app.schemas.alert import MarineAlert

class MarineAlertAgent:
    def __init__(self, provider):
        self.provider = provider

    async def get_alerts(self, coords: Coordinates) -> List[MarineAlert]:
        return await self.provider.get_active_alerts(coords)
