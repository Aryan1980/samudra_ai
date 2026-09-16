"""Unit tests for deterministic risk scoring and classification."""
from app.agents.risk import RiskAssessmentAgent
from app.schemas.marine import WeatherReport, MarineObservation, Coordinates

def make_weather(wind: float, wave: float, cyclone: str = "none", lightning: bool = False, light_dist: float = None):
    return WeatherReport(
        location=Coordinates(latitude=9.9, longitude=76.2),
        timestamp="2026-09-13T12:00:00Z",
        temperature_c=29.0,
        wind_speed_kmh=wind,
        wind_direction_deg=240.0,
        wind_gust_kmh=wind * 1.3,
        wave_height_m=wave,
        wave_direction_deg=230.0,
        rainfall_mm=0.0,
        humidity_pct=75.0,
        visibility_km=10.0,
        lightning_detected=lightning,
        lightning_distance_km=light_dist,
        cyclone_status=cyclone,
        is_demo=True
    )

def make_ocean(wave: float):
    return MarineObservation(
        location=Coordinates(latitude=9.9, longitude=76.2),
        timestamp="2026-09-13T12:00:00Z",
        sst=28.5,
        chlorophyll=2.1,
        wave_height=wave,
        tide="High Tide",
        tide_height_m=1.2,
        is_demo=True
    )

def test_calm_conditions():
    agent = RiskAssessmentAgent()
    w = make_weather(wind=12.0, wave=0.8)
    o = make_ocean(wave=0.8)
    boundary = {"imbl": {"distance_km": 80.0, "is_critical": False, "is_approaching": False}, "mpa": {"inside": False}, "restricted_zone": {"inside": False}}
    risk = agent.assess_risk(w, o, boundary)
    assert risk.overall_score <= 25.0
    assert risk.risk_level == "LOW"
    assert risk.safety_verdict == "SAFE"

def test_high_wave_conditions():
    agent = RiskAssessmentAgent()
    w = make_weather(wind=35.0, wave=3.2)
    o = make_ocean(wave=3.2)
    boundary = {"imbl": {"distance_km": 80.0, "is_critical": False, "is_approaching": False}, "mpa": {"inside": False}, "restricted_zone": {"inside": False}}
    risk = agent.assess_risk(w, o, boundary)
    assert risk.overall_score >= 25.0
    assert risk.risk_level in ["MODERATE", "HIGH"]

def test_cyclone_warning_conditions():
    agent = RiskAssessmentAgent()
    w = make_weather(wind=65.0, wave=4.5, cyclone="warning")
    o = make_ocean(wave=4.5)
    boundary = {"imbl": {"distance_km": 80.0, "is_critical": False, "is_approaching": False}, "mpa": {"inside": False}, "restricted_zone": {"inside": False}}
    risk = agent.assess_risk(w, o, boundary)
    assert risk.overall_score >= 76.0
    assert risk.risk_level == "EXTREME"
    assert risk.safety_verdict == "HAZARDOUS"
