"""Route Optimization Agent."""
from typing import Optional, Tuple
from app.schemas.marine import Coordinates
from app.schemas.route import RouteComparison
from app.geo.router import plan_navigation_route

class RouteOptimizationAgent:
    def plan_route(
        self,
        origin: Coordinates,
        destination: Coordinates,
        hazard_center: Optional[Tuple[float, float]] = None
    ) -> RouteComparison:
        return plan_navigation_route(origin, destination, hazard_center)
