"""Unit tests for Indian language support."""
import pytest
from app.agents.planner import PlannerAgent
from app.agents.orchestrator import AgentOrchestrator
from app.schemas.chat import ChatRequest

def test_language_detection():
    planner = PlannerAgent()
    assert planner.detect_language("Where is the nearest PFZ?") == "en"
    # Hindi: "???? ?? ???? ???? ???????? ???"
    hindi_text = "\u0915\u094d\u092f\u093e \u0915\u0932 \u0938\u0941\u092c\u0939 \u092e\u094c\u0938\u092e \u0938\u0941\u0930\u0915\u094d\u0937\u093f\u0924 \u0939\u0948?"
    assert planner.detect_language(hindi_text) == "hi"
    # Tamil: "????????"
    tamil_text = "\u0bae\u0bc0\u0ba9\u0bcd\u0baa\u0bbf\u0b9f\u0bbf"
    assert planner.detect_language(tamil_text) == "ta"
    # Telugu: "????"
    telugu_text = "\u0c1a\u0c47\u0c2a\u0c32"
    assert planner.detect_language(telugu_text) == "te"
    # Malayalam: "????????????"
    malayalam_text = "\u0d2e\u0d24\u0d4d\u0d38\u0d4d\u0d2f\u0d2c\u0d47\u0d28\u0d4d\u0d27\u0d28\u0d02"
    assert planner.detect_language(malayalam_text) == "ml"
    # Bengali: "???"
    bengali_text = "\u09ae\u09be\u099b"
    assert planner.detect_language(bengali_text) == "bn"

@pytest.mark.asyncio
async def test_hindi_query_execution():
    orchestrator = AgentOrchestrator()
    hindi_text = "\u0915\u094d\u092f\u093e \u0915\u0932 \u0938\u0941\u092c\u0939 \u092e\u094c\u0938\u092e \u0938\u0941\u0930\u0915\u094d\u0937\u093f\u0924 \u0939\u0948?"
    req = ChatRequest(query=hindi_text, latitude=9.9312, longitude=76.2673)
    resp = await orchestrator.execute_query(req)
    assert resp.direct_answer is not None
    assert "km/h" in resp.direct_answer or "?C" in resp.direct_answer
