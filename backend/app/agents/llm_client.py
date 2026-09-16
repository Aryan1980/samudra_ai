"""Gemini LLM Client for SamudraAI Agentic Reasoning.
Provides resilient agentic planning and natural-language synthesis in 10 Indian languages.
Features automatic rate-limit detection and zero-latency fallback to deterministic local logic.
"""
import os
import json
import asyncio
from typing import Optional, Dict, Any, List
from app.config import settings

class GeminiLLMClient:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.client = None
        self.is_available = bool(self.api_key and len(self.api_key) > 10)
        self.model_name = "gemini-3.6-flash"
        
        if self.is_available:
            try:
                from google import genai
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                print(f"[GeminiLLMClient] Initialization notice: {e}")
                self.client = None

    async def plan_intent(self, query: str, coords: Any, language: str) -> Optional[Dict[str, Any]]:
        """Autonomously analyzes user query using Gemini to decompose into subtasks."""
        if not self.client:
            return None

        prompt = f"""You are the Planner Agent of SamudraAI, an Agentic Marine Intelligence Platform for ISRO.
Analyze the user's maritime query and return a valid JSON object ONLY.

User Query: "{query}"
Coordinates: Lat {coords.latitude}, Lon {coords.longitude}
Language: {language}

Possible Intents:
- "greeting": conversational greeting, pleasantry, identity, or casual query (e.g. "hi", "hello", "good morning", "who are you", "what can you do", "help me")
- "safe_route": finding safe navigation or detour avoiding hazards/MPAs
- "safest_pfz": finding the safest fishing zone considering transit risk
- "pfz_query": finding nearest Potential Fishing Zone
- "safety_check": assessing if it is safe to venture into sea tomorrow/today
- "wave_wind": inquiring about waves, swell, wind, sea state
- "chlorophyll_sst": inquiring about satellite ocean color and sea surface temperature
- "alerts_query": asking about cyclones, storms, lightning alerts
- "boundary_check": asking about maritime boundary (IMBL), protected areas, sanctuaries
- "general_marine": general coastal or sea conditions

Return JSON format:
{{
  "intent": "<intent_key>",
  "subtasks": ["<subtask 1>", "<subtask 2>"],
  "required_agents": ["explanation"] if greeting else ["weather", "ocean", "gis", "risk", "visualization", "explanation"],
  "target_time": "tomorrow_morning" or "current",
  "language": "en" | "hi" | "ta" | "te" | "ml" | "kn" | "bn" | "mr" | "gu" | "or"
}}
Do NOT wrap in markdown backticks or explanation. Just valid JSON."""

        def _call_gemini():
            return self.client.models.generate_content(
                model=self.model_name,
                contents=prompt
            )

        try:
            # 2.5 second timeout to maintain snappy UI response
            resp = await asyncio.wait_for(asyncio.to_thread(_call_gemini), timeout=2.5)
            text = resp.text.strip()
            if text.startswith("```"):
                text = text.strip("`").replace("json\n", "", 1).strip()
            data = json.loads(text)
            if "intent" in data and "subtasks" in data:
                return data
        except Exception:
            # Gracefully handle rate limits (429) or timeouts
            pass

        return None

    async def generate_explanation(
        self,
        intent: str,
        lang: str,
        risk_score: int,
        safety_verdict: str,
        recommendation: str,
        weather_summary: str,
        ocean_summary: str,
        pfz_summary: Optional[str] = None
    ) -> Optional[str]:
        """Synthesizes human-like, multilingual maritime advisories using Gemini."""
        if not self.client:
            return None

        prompt = f"""You are the Explanation & Evidence Agent of SamudraAI for ISRO.
Generate a concise, authoritative operational advisory for coastal fishermen and maritime operators.

Context:
- Intent: {intent}
- Language code: {lang} (en=English, hi=Hindi, ta=Tamil, te=Telugu, ml=Malayalam, kn=Kannada, bn=Bengali, mr=Marathi, gu=Gujarati, or=Odia)
- Safety Verdict: {safety_verdict} (Risk Score: {risk_score}/100)
- Official Recommendation: {recommendation}
- Weather: {weather_summary}
- Ocean State: {ocean_summary}
- PFZ Information: {pfz_summary or 'N/A'}

Rules:
1. Respond in the native script of language '{lang}' (e.g. Tamil script for 'ta', Devanagari for 'hi', etc.) or English if 'en'.
2. Always keep exact scientific units: km/h, m, °C, mg/m³.
3. Be direct, clear, and reassuring or urgent as indicated by the safety verdict.
4. Keep the response under 3-4 sentences. Provide practical navigational advice."""

        def _call_gemini():
            return self.client.models.generate_content(
                model=self.model_name,
                contents=prompt
            )

        try:
            resp = await asyncio.wait_for(asyncio.to_thread(_call_gemini), timeout=3.0)
            text = resp.text.strip()
            if text:
                return text
        except Exception:
            pass

        return None
