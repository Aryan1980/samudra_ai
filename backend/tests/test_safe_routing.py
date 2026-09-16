"""Unit tests for safe navigation routing."""
from app.geo.router import plan_navigation_route
from app.schemas.marine import Coordinates

def test_safe_routing_clear_track():
    # Route in open Arabian sea
    origin = Coordinates(latitude=9.9, longitude=75.8)
    dest = Coordinates(latitude=9.8, longitude=75.6)
    res = plan_navigation_route(origin, dest)
    assert res.shortest_route.distance_km > 0
    assert res.safe_route.distance_km > 0
    assert len(res.safe_route.waypoints) >= 2

def test_safe_routing_with_hazard():
    # Route through a mock weather hazard cell
    origin = Coordinates(latitude=10.0, longitude=75.0)
    dest = Coordinates(latitude=10.0, longitude=76.0)
    hazard_mid = (10.0, 75.5)
    res = plan_navigation_route(origin, dest, weather_hazard_center=hazard_mid)
    assert res.shortest_route.risk_level == "HIGH"
    assert len(res.shortest_route.hazards_intersected) > 0
    assert res.safe_route.risk_level == "LOW"
