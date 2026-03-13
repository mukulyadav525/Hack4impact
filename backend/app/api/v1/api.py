from fastapi import APIRouter
from app.api.v1.endpoints import auth, attendance, submissions, employees, stats, zones

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(attendance.router, prefix="/attendance", tags=["attendance"])
api_router.include_router(submissions.router, prefix="/submissions", tags=["submissions"])
api_router.include_router(employees.router, prefix="/employees", tags=["employees"])
api_router.include_router(stats.router, prefix="/stats", tags=["stats"])
api_router.include_router(zones.router, prefix="/zones", tags=["zones"])
