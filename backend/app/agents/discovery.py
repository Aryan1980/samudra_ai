"""Marine Data Discovery Agent."""
from typing import List, Dict, Any
from app.schemas.data_sources import DataSourceInfo

class MarineDataDiscoveryAgent:
    def __init__(self, provider):
        self.provider = provider

    def discover_data_sources(self) -> List[DataSourceInfo]:
        return self.provider.get_source_metadata()
