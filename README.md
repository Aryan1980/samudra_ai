# SamudraAI ? Agentic Marine Intelligence Platform

[![ISRO Problem Statement Prototype](https://img.shields.io/badge/ISRO-Marine%20Intelligence-008080?style=for-the-badge&logo=satellite)](https://mosdac.gov.in)
[![Multi-Agent Architecture](https://img.shields.io/badge/Architecture-Agentic%20AI%20Pipeline-0284c7?style=for-the-badge)](./ARCHITECTURE.md)
[![Deterministic Safety Matrix](https://img.shields.io/badge/Safety-Deterministic%20Zero--Hallucination-10b981?style=for-the-badge)](./ARCHITECTURE.md#deterministic-risk-engine)
[![Offline Ready](https://img.shields.io/badge/Demo%20Mode-100%25%20Offline%20Ready-f59e0b?style=for-the-badge)](./DEMO.md)

**SamudraAI** is a production-style Agentic AI Marine Intelligence Platform developed in response to the ISRO problem statement. Built for traditional fishermen, maritime researchers, port authorities, and coastal security agencies, SamudraAI provides natural-language conversation and voice interaction in **10 Indian languages** (English, Hindi, Tamil, Telugu, Malayalam, Kannada, Bengali, Marathi, Gujarati, and Odia).

Departing fundamentally from naive chatbots or static dashboards, SamudraAI demonstrates **genuine Agentic AI behaviors**: intent understanding, autonomous subtask decomposition, multi-agent dispatch, heterogeneous satellite & oceanographic data fusion, spatial-temporal reasoning, deterministic physical risk scoring, and explainable evidence generation.

---

## ?? Key Features

1. **Autonomous Multi-Agent Architecture**:
   - **Planner Agent**: Interprets complex user queries, extracts spatio-temporal parameters, and formulates subtask plans.
   - **Marine Data Discovery Agent**: Identifies required satellite and oceanographic datasets and normalizes schemas.
   - **Weather Intelligence Agent**: Ingests wind speed/direction, gusts, swell period, thunderstorm cells, and IMD cyclone watches.
   - **Ocean Analytics Agent**: Evaluates spaceborne Sea Surface Temperature (SST) gradients, Chlorophyll-a plumes, and tidal cycles.
   - **PFZ Intelligence Agent**: Discovers, evaluates, and ranks Potential Fishing Zones based on environmental suitability and transit safety.
   - **Geospatial Reasoning Agent**: Performs pure-python Haversine distance, bearing calculations, Ray-Casting point-in-polygon containment, and cross-track IMBL proximity.
   - **Deterministic Risk Assessment Engine**: Computes transparent mathematical safety scores (0?100) using configurable physical threshold penalties. **Zero LLM hallucination of safety scores.**
   - **Route Optimization Agent**: Compares direct shortest lines against risk-mitigated safe detour nautical corridors avoiding marine protected areas (MPAs) and hazard cells.
   - **Marine Alert Agent**: Dispatches multi-tier navigational and severe weather advisories (Extreme, High, Moderate, Informational).
   - **Visualization Agent**: Dynamically activates relevant map layers, markers, and vector charts.
   - **Explanation & Evidence Agent**: Produces localized recommendations with an expandable "Why am I seeing this?" audit trail.

2. **Interactive Marine Command Center**:
   - Leaflet interactive map with custom dark oceanographic basemap tiles.
   - Toggleable layers: PFZs, SST Isotherms, Chlorophyll-a blooms, Wave swell vectors, Surface wind, IMBL borders, Marine Protected Areas (MPAs), Naval restricted zones, and Safe Detour routes.
   - Click anywhere on the sea to relocate analysis instantly.
   - One-click coastal hub jump (Kochi, Mumbai, Porbandar, Chennai, Vizag, Paradip, Digha, Port Blair, Goa, Kanyakumari).

3. **Multilingual & Voice Interaction**:
   - Automatic script detection and language selector for 10 Indian languages.
   - Web Speech API integration for microphone Speech-to-Text and browser SpeechSynthesis voice readback.
   - Preserves strict scientific SI units (`km/h`, `m`, `?C`, `mg/m?`) across translations.

4. **100% Offline Hackathon Demo Mode Guarantee**:
   - Out of the box, SamudraAI operates seamlessly without external API keys or paid accounts.
   - Realistic synthetic data generated for the Indian coastline (Arabian Sea, Bay of Bengal, Andaman Sea).
   - Real APIs (ISRO MOSDAC, INCOIS, IMD, Gemini) connect effortlessly through modular provider adapters via `.env`.

---

## ??? Technology Stack

- **Backend**:
  - Python 3.11+
  - FastAPI (Asynchronous high-performance REST API)
  - Pydantic v2 (Strict typing and schema validation)
  - SQLite (Persistent conversation memory & session history)
  - Pure Python Geospatial Engine (Zero fragile C++ GIS dependencies on Windows)
  - Uvicorn (ASGI production server)
  - Pytest & Pytest-Asyncio (Comprehensive automated test suite)

- **Frontend**:
  - React 19 + TypeScript
  - Vite v8 (Lightning-fast HMR and bundling)
  - Tailwind CSS v4 (Modern responsive slate-cyan theme)
  - Leaflet (Interactive marine cartography)
  - Lucide React (Marine & navigational iconography)
  - Web Speech API (Browser Speech-to-Text & Text-to-Speech)

---

## ?? Quick Start (Works Locally Out of the Box)

### 1. Prerequisites
- Python 3.10+ installed
- Node.js v18+ and npm installed

### 2. Backend Setup
```bash
# Navigate to project root
cd samudra-ai

# Install backend dependencies
pip install -r backend/requirements.txt

# Run automated tests to verify everything
python -m pytest backend/tests/ -v

# Start FastAPI backend server
python -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000
```
*API Swagger Documentation is available at: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)*

### 3. Frontend Setup (Optional if using backend single-port serving)
The backend automatically serves the built frontend SPA at `http://127.0.0.1:8000/`!

To run the Vite development server with Hot Module Replacement:
```bash
cd frontend
npm install
npm run dev
```
*Open [http://127.0.0.1:5173](http://127.0.0.1:5173) in your browser.*

---

## ?? Try Hackathon Demo Scenarios (1-Click in UI)

Click any of the demo scenario chips in the UI or ask via text/voice:
1. **"Where is the nearest PFZ?"** ? Discovers thermal-chlorophyll fronts, computes distance and bearing, and displays ranked PFZ cards.
2. **"Is it safe to go fishing tomorrow morning?"** ? Decomposes 24-hr wave, wind, squall, and cyclone forecasts, running the deterministic 6-factor risk matrix.
3. **"What are the wave and wind conditions?"** ? Returns swell direction, wave height, Beaufort/Douglas scale, and wind vectors.
4. **"Show areas with high chlorophyll and favourable SST."** ? Activates ocean color and thermal anomaly layers with upwelling insights.
5. **"Which PFZ is safest?"** ? Ranks fishing zones by transit risk rather than raw distance.
6. **"Find a safe route to the nearest PFZ."** ? Calculates direct shortest track, detects hazard intersections (MPAs/geofences), and generates a risk-mitigated safe detour corridor.
7. **"Are there any cyclone or lightning alerts?"** ? Scans IMD bulletins and convective radar cells.
8. **"Am I approaching a restricted area?"** ? Performs cross-track distance calculations against the International Maritime Boundary Line (IMBL) and Marine Protected Areas (e.g. Gahirmatha, Gulf of Mannar).

---

## ?? Repository Structure

```
samudra-ai/
??? backend/
?   ??? app/
?   ?   ??? config.py              # Risk weights, thresholds & environment configuration
?   ?   ??? database.py            # SQLite conversation persistence
?   ?   ??? main.py                # FastAPI app setup, CORS, static SPA mount
?   ?   ??? schemas/               # Typed Pydantic schemas (marine, risk, route, alert, chat)
?   ?   ??? providers/             # Base provider interfaces, Demo provider, API adapters
?   ?   ??? geo/                   # Pure-python Haversine, Ray-Casting & A* Safe Router
?   ?   ??? agents/                # 11 specialized agents & Central Orchestrator
?   ?   ??? routes/                # FastAPI REST endpoints
?   ??? tests/                     # 25 automated unit & integration tests
?   ??? requirements.txt
??? frontend/
?   ??? src/
?   ?   ??? types/                 # TypeScript interfaces mirroring backend schemas
?   ?   ??? services/              # Axios API client & Web Speech voice service
?   ?   ??? context/               # Global AppContext
?   ?   ??? components/
?   ?   ?   ??? Header/            # Branding, coastal presets & language selector
?   ?   ?   ??? Map/               # Leaflet map, layer controls & route polylines
?   ?   ?   ??? Chat/              # Conversational panel, voice mic, demo queries, evidence drawer
?   ?   ?   ??? Dashboard/         # Risk badge, condition cards, PFZ list & alert center
?   ?   ?   ??? Observability/     # Real-time multi-agent execution telemetry
?   ?   ?   ??? Charts/            # 24-hour environmental trend graphs
?   ?   ?   ??? Pages/             # Architecture ("How It Works") & Data Sources pages
?   ?   ??? App.tsx
?   ?   ??? main.tsx
?   ??? package.json
?   ??? vite.config.ts
??? .env.example
??? README.md
??? ARCHITECTURE.md
??? DATA_SOURCES.md
??? API.md
??? DEMO.md
```

---

## ?? Security & Statutory Notice
- All secrets and API credentials are kept strictly on the backend. No secret tokens are ever exposed to the client.
- **Statutory Notice**: SamudraAI is an operational decision-support tool. It does not replace official statutory advisories issued by INCOIS, IMD, the Indian Coast Guard, or Ministry of Fisheries.
