from fastapi import APIRouter
from app.api import auth, attendance, submissions

router = APIRouter()

router.include_router(auth.router, prefix="/auth", tags=["auth"])
router.include_router(attendance.router, prefix="/attendance", tags=["attendance"])
router.include_router(submissions.router, prefix="/submissions", tags=["submissions"])

@router.get("/health")
async def health_check():
    return {"status": "healthy"}
