"""SamudraAI - Agentic Marine Intelligence Platform FastAPI Application."""
from contextlib import asynccontextmanager
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.config import settings
from app.database import init_db
from app.routes.api import router as api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite schema
    init_db()
    print("SamudraAI database initialized.")
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Agentic Marine Intelligence Platform for ISRO Problem Statement. Supports autonomous multi-agent planning, deterministic marine risk calculation, PFZ intelligence, geospatial geofencing, and multilingual voice interaction.",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router
app.include_router(api_router)

# Mount frontend production build if available
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))

if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

    @app.get("/marine_ocean_satellite.jpg")
    async def serve_marine_img():
        img_path = os.path.join(frontend_dist, "marine_ocean_satellite.jpg")
        if os.path.exists(img_path):
            return FileResponse(img_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))

    @app.get("/")
    async def serve_spa():
        return FileResponse(os.path.join(frontend_dist, "index.html"))
else:
    @app.get("/")
    def root():
        return {
            "platform": settings.PROJECT_NAME,
            "version": settings.VERSION,
            "status": "OPERATIONAL",
            "docs_url": "/docs",
            "api_prefix": settings.API_V1_STR,
            "mode": "DEMO DATA READY (Conforms to ISRO Problem Statement)"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
