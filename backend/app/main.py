from fastapi import FastAPI
from app.api.v1.api import api_router
from app.core.config import settings

app = FastAPI(
    title="GovTrack AI API",
    description="Backend API for GovTrack AI - Government Employee Credit & Performance System",
    version="1.0.0",
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {"message": "Welcome to GovTrack AI API"}
