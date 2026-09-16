"""FastAPI route handlers for SamudraAI marine intelligence services."""
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel

from app.schemas.marine import Coordinates, MarineObservation, PFZZone, WeatherReport
from app.schemas.risk import RiskAssessment
from app.schemas.route import RouteComparison
from app.schemas.alert import MarineAlert
from app.schemas.chat import ChatRequest, ChatResponse
from app.schemas.data_sources import DataSourceInfo

from app.providers.demo_provider import DemoDataProvider
from app.agents.orchestrator import AgentOrchestrator
from app.agents.gis import GeospatialReasoningAgent
from app.agents.pfz import PFZIntelligenceAgent
from app.agents.risk import RiskAssessmentAgent
from app.agents.route import RouteOptimizationAgent
from app.database import save_message, get_conversation_history
router = APIRouter()

provider = DemoDataProvider()
orchestrator = AgentOrchestrator()
gis_agent = GeospatialReasoningAgent(provider)
pfz_agent = PFZIntelligenceAgent(provider)
risk_agent = RiskAssessmentAgent()
route_agent = RouteOptimizationAgent()

class CoordinatesPayload(BaseModel):
    latitude: float
    longitude: float

class RouteRequestPayload(BaseModel):
    origin: Coordinates
    destination: Coordinates

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    """Process natural language or voice query through Agentic Multi-Agent Pipeline."""
    resp = await orchestrator.execute_query(req)
    if req.conversation_id:
        save_message(req.conversation_id, "user", req.query)
        save_message(req.conversation_id, "assistant", resp.direct_answer, {
            "risk_level": resp.risk_level,
            "safety_verdict": resp.safety_verdict
        })
    return resp

@router.get("/weather", response_model=WeatherReport)
async def get_weather(lat: float = Query(..., ge=-90, le=90), lon: float = Query(..., ge=-180, le=180)):
    """Retrieve atmospheric & meteorological observations for sea coordinates."""
    coords = Coordinates(latitude=lat, longitude=lon)
    return await provider.get_weather(coords)

@router.get("/ocean", response_model=MarineObservation)
async def get_ocean(lat: float = Query(..., ge=-90, le=90), lon: float = Query(..., ge=-180, le=180)):
    """Retrieve hydrodynamic & biogeochemical ocean parameters (SST, Chlorophyll, Waves, Tide)."""
    coords = Coordinates(latitude=lat, longitude=lon)
    return await provider.get_ocean_conditions(coords)

@router.get("/pfz", response_model=List[PFZZone])
async def get_pfz(
    lat: float = Query(..., ge=-90, le=90),
    lon: float = Query(..., ge=-180, le=180),
    sort_by: str = Query("distance", pattern="^(distance|suitability|safety|combined)$"),
    radius_km: float = Query(120.0, ge=10, le=500)
):
    """Retrieve ranked Potential Fishing Zones surrounding coordinates."""
    coords = Coordinates(latitude=lat, longitude=lon)
    return await pfz_agent.get_ranked_pfzs(coords, sort_by=sort_by, radius_km=radius_km)

@router.get("/alerts", response_model=List[MarineAlert])
async def get_alerts(
    lat: float = Query(..., ge=-90, le=90),
    lon: float = Query(..., ge=-180, le=180)
):
    """Retrieve active marine, severe weather, and maritime boundary alerts."""
    coords = Coordinates(latitude=lat, longitude=lon)
    return await provider.get_active_alerts(coords)

@router.get("/geofences")
async def get_geofences():
    """Retrieve all official maritime boundaries, MPAs, restricted zones, and coastal hubs."""
    return gis_agent.get_all_geofences()

@router.post("/risk", response_model=RiskAssessment)
async def assess_risk(payload: CoordinatesPayload):
    """Perform deterministic multi-factor marine risk evaluation."""
    coords = Coordinates(latitude=payload.latitude, longitude=payload.longitude)
    weather = await provider.get_weather(coords)
    ocean = await provider.get_ocean_conditions(coords)
    boundary_ctx = await provider.get_boundary_contexts(coords)
    return risk_agent.assess_risk(weather, ocean, boundary_ctx)

@router.post("/route", response_model=RouteComparison)
async def calculate_route(payload: RouteRequestPayload):
    """Compute and compare direct navigation track against hazard-avoiding safe route."""
    return route_agent.plan_route(payload.origin, payload.destination)

@router.get("/marine-conditions")
async def get_marine_conditions(
    lat: float = Query(..., ge=-90, le=90),
    lon: float = Query(..., ge=-180, le=180)
):
    """Get unified dashboard snapshot for coordinates."""
    coords = Coordinates(latitude=lat, longitude=lon)
    weather = await provider.get_weather(coords)
    ocean = await provider.get_ocean_conditions(coords)
    boundary_ctx = await provider.get_boundary_contexts(coords)
    risk = risk_agent.assess_risk(weather, ocean, boundary_ctx)
    alerts = await provider.get_active_alerts(coords)
    pfzs = await pfz_agent.get_ranked_pfzs(coords, sort_by="distance")

    return {
        "coordinates": coords,
        "weather": weather,
        "ocean": ocean,
        "boundary_context": boundary_ctx,
        "risk": risk,
        "active_alerts": alerts,
        "nearest_pfz": pfzs[0] if pfzs else None
    }

@router.get("/data-sources", response_model=List[DataSourceInfo])
async def get_data_sources():
    """Return official data provenance, update status, and live connection instructions."""
    return provider.get_source_metadata()

@router.get("/conversations/{conv_id}/history")
async def get_history(conv_id: str):
    """Retrieve conversation history from database."""
    return get_conversation_history(conv_id)

@router.get("/health")
async def health_check():
    """System health and readiness check."""
    return {
        "status": "healthy",
        "service": "SamudraAI Marine Intelligence Platform",
        "version": "1.0.0",
        "mode": "DEMO_READY",
        "agents": [
            "Planner Agent", "Data Discovery Agent", "Weather Intelligence Agent",
            "Ocean Analytics Agent", "PFZ Agent", "Geospatial Reasoning Agent",
            "Risk Assessment Agent", "Route Optimization Agent", "Marine Alert Agent",
            "Visualization Agent", "Explanation & Evidence Agent"
        ]
    }
