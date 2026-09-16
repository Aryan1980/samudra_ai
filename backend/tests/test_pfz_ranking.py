"""Unit tests for PFZ intelligence ranking."""
import pytest
from app.agents.pfz import PFZIntelligenceAgent
from app.providers.demo_provider import DemoDataProvider
from app.schemas.marine import Coordinates

@pytest.mark.asyncio
async def test_pfz_ranking_distance():
    provider = DemoDataProvider()
    agent = PFZIntelligenceAgent(provider)
    coords = Coordinates(latitude=9.9312, longitude=76.2673)
    
    pfzs = await agent.get_ranked_pfzs(coords, sort_by="distance")
    assert len(pfzs) >= 3
    for i in range(len(pfzs) - 1):
        assert pfzs[i].distance_km <= pfzs[i+1].distance_km

@pytest.mark.asyncio
async def test_pfz_ranking_suitability():
    provider = DemoDataProvider()
    agent = PFZIntelligenceAgent(provider)
    coords = Coordinates(latitude=9.9312, longitude=76.2673)
    
    pfzs = await agent.get_ranked_pfzs(coords, sort_by="suitability")
    for i in range(len(pfzs) - 1):
        assert pfzs[i].suitability_score >= pfzs[i+1].suitability_score
