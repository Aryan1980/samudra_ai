"""Planner Agent: Intent understanding, subtask decomposition, and execution plan formulation."""
from typing import Dict, Any, List, Optional
import re
from app.schemas.marine import Coordinates

class ExecutionPlan:
    def __init__(self, intent: str, subtasks: List[str], required_agents: List[str], target_time: str, language: str):
        self.intent = intent
        self.subtasks = subtasks
        self.required_agents = required_agents
        self.target_time = target_time
        self.language = language

class PlannerAgent:
    """Analyzes user queries, determines intent, and plans multi-agent workflows."""

    def __init__(self):
        try:
            from app.agents.llm_client import GeminiLLMClient
            self.llm_client = GeminiLLMClient()
        except Exception:
            self.llm_client = None

    def detect_language(self, text: str) -> str:
        # Detect Indian scripts based on Unicode block ranges
        for char in text:
            code = ord(char)
            if 0x0900 <= code <= 0x097F:  # Devanagari (Hindi / Marathi)
                return "hi"
            elif 0x0B80 <= code <= 0x0BFF:  # Tamil
                return "ta"
            elif 0x0C00 <= code <= 0x0C7F:  # Telugu
                return "te"
            elif 0x0D00 <= code <= 0x0D7F:  # Malayalam
                return "ml"
            elif 0x0C80 <= code <= 0x0CFF:  # Kannada
                return "kn"
            elif 0x0980 <= code <= 0x09FF:  # Bengali
                return "bn"
            elif 0x0A80 <= code <= 0x0AFF:  # Gujarati
                return "gu"
            elif 0x0B00 <= code <= 0x0B7F:  # Odia
                return "or"
        return "en"

    async def plan_query_agentic(self, query: str, active_coords: Coordinates, lang_override: Optional[str] = None) -> ExecutionPlan:
        """Asynchronously plans using Gemini LLM if available, falling back to rule-based logic."""
        detected_lang = lang_override or self.detect_language(query)

        if self.llm_client:
            llm_plan = await self.llm_client.plan_intent(query, active_coords, detected_lang)
            if llm_plan:
                return ExecutionPlan(
                    intent=llm_plan.get("intent", "general_marine"),
                    subtasks=llm_plan.get("subtasks", ["Analyze satellite marine observations"]),
                    required_agents=llm_plan.get("required_agents", ["weather", "ocean", "risk", "visualization", "explanation"]),
                    target_time=llm_plan.get("target_time", "current"),
                    language=detected_lang
                )

        # Fallback to deterministic regex-based plan
        return self.plan_query(query, active_coords, lang_override)

    def plan_query(self, query: str, active_coords: Coordinates, lang_override: Optional[str] = None) -> ExecutionPlan:
        q = query.lower()
        detected_lang = lang_override or self.detect_language(query)

        # 1. Intent Matching with Multilingual Keywords
        # Greeting / Conversational small talk
        clean_words = set(re.findall(r'\b[a-zA-Z\u0900-\u0D7F]+\b', q))
        greeting_tokens = {"hi", "hello", "hey", "hola", "namaste", "namaskar", "vanakkam", "pranam", "sup", "yo", "greeting", "greetings", "नमस्ते", "வணக்கம்", "നമസ്കാരം", "హలో"}
        is_greeting = (
            any(w in greeting_tokens for w in clean_words) or
            any(phrase in q for phrase in ["good morning", "good evening", "good afternoon", "how are you", "who are you", "what can you do", "help me"])
        ) and not any(w in q for w in ["fish", "pfz", "wave", "wind", "route", "spot", "sst", "cyclone", "storm", "safe", "border", "hazard"])

        if is_greeting:
            intent = "greeting"
            subtasks = ["Acknowledge greeting", "State capabilities and active vessel port"]
            agents = ["explanation"]

        elif any(w in q for w in ["route", "safest route", "navigate", "navigation", "direction", "way", "how to reach", "रास्ता", "मार्ग", "பாதை", "வழி", "మార్గం", "വഴി"]):
            intent = "safe_route"
            subtasks = [
                "Locate origin vessel coordinates",
                "Discover nearest target PFZ destination coordinates",
                "Scan geospatial hazard geofences (MPAs, IMBL, Restricted Zones, Shallow Shoals)",
                "Identify danger zones and safe seaward bearing",
                "Synthesize navigational coordinates and danger avoidance advisory"
            ]
            agents = ["gis", "pfz", "risk", "visualization", "explanation"]

        elif any(w in q for w in ["safest pfz", "which pfz is safest", "safe fishing zone", "best pfz", "सुरक्षित मछली", "பாதுகாப்பான மீன்பிடி"]):
            intent = "safest_pfz"
            subtasks = [
                "Retrieve current PFZs within search radius",
                "Evaluate wave and wind hazards along transit vectors",
                "Sort and filter PFZ zones by deterministic safety index",
                "Generate ranked PFZ advisory cards and map pins"
            ]
            agents = ["pfz", "weather", "ocean", "risk", "visualization", "explanation"]

        elif any(w in q for w in ["nearest pfz", "pfz", "potential fishing zone", "fish zone", "मछली", "மீன்பிடி", "చేపల", "മത്സ്യ"]):
            intent = "pfz_query"
            subtasks = [
                "Retrieve spaceborne thermal and ocean color products from Oceansat-3",
                "Extract PFZ clusters around vessel location",
                "Calculate Haversine distance and compass bearing to each zone",
                "Evaluate environmental suitability index",
                "Render PFZ overlays on interactive map"
            ]
            agents = ["discovery", "ocean", "pfz", "gis", "visualization", "explanation"]

        elif any(w in q for w in ["safe", "safety", "tomorrow morning", "tomorrow", "weather tomorrow", "सुरक्षित", "பாதுகாப்ப", "సురక్షిత", "കാലാവസ്ഥ"]):
            intent = "safety_check"
            subtasks = [
                "Determine temporal target (tomorrow morning / 24h horizon)",
                "Fetch 24-hr wave height and swell forecast",
                "Fetch coastal wind speed and gust forecasts",
                "Check active cyclone watches and squall warnings",
                "Execute deterministic risk engine across 6 physical factors",
                "Produce official safety recommendation and evidence trail"
            ]
            agents = ["weather", "ocean", "gis", "risk", "alert", "visualization", "explanation"]

        elif any(w in q for w in ["wave", "wind", "swell", "sea state", "हवा", "लहर", "காற்று", "அலை", "గాలి", "అలలు", "കാറ്റ്", "തിരമാല"]):
            intent = "wave_wind"
            subtasks = [
                "Retrieve high-resolution wave height, swell direction, and period",
                "Retrieve surface wind vectors and gust factors",
                "Calculate Douglas sea scale state",
                "Display marine cards and directional vectors"
            ]
            agents = ["weather", "ocean", "risk", "visualization", "explanation"]

        elif any(w in q for w in ["chlorophyll", "sst", "temperature", "plankton", "thermal", "क्लोरोफिल", "तापमान"]):
            intent = "chlorophyll_sst"
            subtasks = [
                "Retrieve satellite sea surface temperature (SST) field",
                "Retrieve satellite ocean chlorophyll-a concentration",
                "Identify thermal-chlorophyll frontal confluence lines",
                "Generate raster/contour visualization layers"
            ]
            agents = ["discovery", "ocean", "visualization", "explanation"]

        elif any(w in q for w in ["cyclone", "lightning", "storm", "alert", "warning", "तूफान", "चक्रवात", "புயல்", "ఎచ్చరిక", "മുന്നറിയിപ്പ്"]):
            intent = "alerts_query"
            subtasks = [
                "Query active severe weather alerts from IMD",
                "Scan convective lightning discharge sensors",
                "Check tropical cyclone track advisories",
                "Filter and rank alerts by severity and radius"
            ]
            agents = ["weather", "alert", "visualization", "explanation"]

        elif any(w in q for w in ["restricted", "boundary", "imbl", "sanctuary", "protected", "सीमा", "எல்லை", "సరిహద్దు", "അതിർത്തി"]):
            intent = "boundary_check"
            subtasks = [
                "Calculate distance to sovereign International Maritime Boundary Line (IMBL)",
                "Check point-in-polygon containment against Marine Protected Areas (MPAs)",
                "Check proximity to defense and offshore energy exclusion zones",
                "Evaluate regulatory violation risks"
            ]
            agents = ["gis", "risk", "alert", "visualization", "explanation"]

        else:
            intent = "general_marine"
            subtasks = [
                "Retrieve comprehensive marine state around coordinates",
                "Check atmospheric and hydrodynamic observations",
                "Perform unified deterministic risk assessment",
                "Format conversational answer and map visualization"
            ]
            agents = ["discovery", "weather", "ocean", "gis", "risk", "visualization", "explanation"]

        target_time = "tomorrow_morning" if any(w in q for w in ["tomorrow", "कल", "நாளை", "రేపు", "നാളെ"]) else "current"

        return ExecutionPlan(
            intent=intent,
            subtasks=subtasks,
            required_agents=agents,
            target_time=target_time,
            language=detected_lang
        )
