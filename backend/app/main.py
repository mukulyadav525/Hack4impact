import time
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router
from app.core.config import settings

# Configure logging to ensure stdout captured by Railway
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("govtrack-api")

app = FastAPI(
    title="GovTrack AI API",
    description="Backend API for GovTrack AI - Government Employee Credit & Performance System",
    version="1.0.0",
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    origin = request.headers.get("origin")
    response = await call_next(request)
    duration = time.time() - start_time
    logger.info(f"API_LOG: {request.method} {request.url.path} - Origin: {origin} - Status: {response.status_code} - {duration:.2f}s")
    return response

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://hack4impact-o1h2.vercel.app",
    "https://hack4impact.vercel.app",
    "https://hack4impact-web.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    logger.info("Health check hit at root /")
    return {
        "status": "online",
        "message": "Welcome to GovTrack AI API",
        "timestamp": time.time(),
        "environment": "production" if "railway.app" in settings.PROJECT_NAME.lower() else "development"
    }
