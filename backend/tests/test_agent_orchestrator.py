"""Unit tests for all 8 hackathon demo scenarios."""
import pytest
from app.agents.orchestrator import AgentOrchestrator
from app.schemas.chat import ChatRequest

DEMO_QUERIES = [
    "Where is the nearest PFZ?",
    "Is it safe to go fishing tomorrow morning?",
    "What are the wave and wind conditions?",
    "Show areas with high chlorophyll and favourable SST.",
    "Which PFZ is safest?",
    "Find a safe route to the nearest PFZ.",
    "Are there any cyclone or lightning alerts?",
    "Am I approaching a restricted area?"
]

@pytest.mark.asyncio
async def test_all_demo_scenarios():
    orchestrator = AgentOrchestrator()
    for q in DEMO_QUERIES:
        req = ChatRequest(query=q, latitude=9.9312, longitude=76.2673, language="en")
        resp = await orchestrator.execute_query(req)
        assert resp.direct_answer is not None and len(resp.direct_answer) > 0
        assert resp.risk_level in ["LOW", "MODERATE", "HIGH", "EXTREME"]
        assert len(resp.agent_traces) >= 5
        assert resp.evidence.deterministic_score >= 0
