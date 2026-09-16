"""Weather Intelligence Agent."""
from typing import Optional
from app.schemas.marine import Coordinates, WeatherReport

class WeatherIntelligenceAgent:
    def __init__(self, provider):
        self.provider = provider

    async def get_forecast(self, coords: Coordinates, target_time: Optional[str] = None) -> WeatherReport:
        return await self.provider.get_weather(coords, target_time)
