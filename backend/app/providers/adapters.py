"""External Live Data Adapters for INCOIS, MOSDAC, and IMD."""
from typing import Optional, List, Dict, Any
from app.schemas.marine import Coordinates, MarineObservation, PFZZone, WeatherReport
from app.providers.demo_provider import DemoDataProvider
from app.config import settings

class IncoisAdapter:
    """Adapter for INCOIS REST/WFS web services."""
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.OCEAN_API_KEY
        self.fallback = DemoDataProvider()

    async def get_ocean_conditions(self, coords: Coordinates) -> MarineObservation:
        # If API key configured, make live HTTP request to INCOIS THREDDS / GeoServer WFS endpoint
        if self.api_key:
            # When live credentials available, parse INCOIS NetCDF / JSON endpoint
            pass
        # Graceful fallback to demo data with explicit status flag
        return await self.fallback.get_ocean_conditions(coords)

    async def get_pfz(self, coords: Coordinates) -> List[PFZZone]:
        return await self.fallback.get_pfz_advisories(coords)

class MosdacAdapter:
    """Adapter for ISRO MOSDAC Earth Observation portal (Oceansat-3 / INSAT-3D)."""
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.SATELLITE_API_KEY
        self.fallback = DemoDataProvider()

    async def get_sst_chlorophyll(self, coords: Coordinates) -> Dict[str, Any]:
        return {"source": "MOSDAC_STUB", "status": "fallback"}

class ImdAdapter:
    """Adapter for India Meteorological Department Coastal Weather API."""
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.WEATHER_API_KEY
        self.fallback = DemoDataProvider()

    async def get_coastal_forecast(self, coords: Coordinates) -> WeatherReport:
        return await self.fallback.get_weather(coords)
