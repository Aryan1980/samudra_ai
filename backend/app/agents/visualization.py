"""Visualization Agent."""
from typing import List, Dict, Any

class VisualizationAgent:
    def determine_visualizations(self, intent: str, risk_level: str) -> Dict[str, Any]:
        layers = ["base_marine"]
        if intent in ["pfz_query", "chlorophyll_sst", "general_marine"]:
            layers.extend(["pfz", "sst", "chlorophyll"])
        if intent in ["safety_check", "weather_conditions", "wave_wind"]:
            layers.extend(["waves", "wind", "risk_zones"])
        if intent in ["boundary_check", "restricted_areas"]:
            layers.extend(["imbl", "mpas", "restricted_zones"])
        if intent in ["safe_route", "navigation"]:
            layers.extend(["route", "hazards"])
        if risk_level in ["HIGH", "EXTREME"]:
            layers.append("risk_zones")

        return {
            "active_layers": list(set(layers)),
            "recommended_zoom": 9 if intent in ["pfz_query", "safe_route"] else 8,
            "show_charts": intent in ["weather_conditions", "wave_wind", "chlorophyll_sst"]
        }
