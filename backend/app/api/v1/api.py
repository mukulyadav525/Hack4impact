from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth, attendance, submissions, employees, stats, zones, scoring,
    teachers, doctors, police, grievances, public, notifications, compliance, rating, departments
)

api_router = APIRouter(redirect_slashes=False)
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(attendance.router, prefix="/attendance", tags=["attendance"])
api_router.include_router(submissions.router, prefix="/submissions", tags=["submissions"])
api_router.include_router(employees.router, prefix="/employees", tags=["employees"])
api_router.include_router(stats.router, prefix="/stats", tags=["stats"])
api_router.include_router(zones.router, prefix="/zones", tags=["zones"])
api_router.include_router(scoring.router, prefix="/scoring", tags=["scoring"])
api_router.include_router(teachers.router, prefix="/teachers", tags=["teachers"])
api_router.include_router(doctors.router, prefix="/doctors", tags=["doctors"])
api_router.include_router(police.router, prefix="/police", tags=["police"])
api_router.include_router(grievances.router, prefix="/grievances", tags=["grievances"])
api_router.include_router(public.router, prefix="/stats", tags=["public"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
api_router.include_router(compliance.router, prefix="/compliance", tags=["compliance"])
api_router.include_router(rating.router, prefix="/public", tags=["public"])
api_router.include_router(departments.router, prefix="/departments", tags=["departments"])
