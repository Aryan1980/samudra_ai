"""Data sources metadata schema."""
from typing import Optional
from pydantic import BaseModel

class DataSourceInfo(BaseModel):
    id: str
    name: str
    organization: str
    dataset_name: str
    parameters: str
    status: str = "ACTIVE_DEMO"  # 'LIVE' | 'ACTIVE_DEMO' | 'STANDBY'
    is_demo: bool = True
    last_update: str
    update_frequency: str
    description: str
    official_portal: str
    config_env_var: str
