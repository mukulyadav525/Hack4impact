from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.attendance import AttendanceService
from pydantic import BaseModel
from typing import List

router = APIRouter()

class AttendanceCreate(BaseModel):
    lat: float
    lon: float
    status: str = "present"

@router.post("/check-in")
def check_in(data: AttendanceCreate, db: Session = Depends(get_db)):
    # In a real scenario, we'd get employee_id from the JWT token
    # Mocking employee_id for now
    employee_id = "00000000-0000-0000-0000-000000000000"
    return AttendanceService.mark_attendance(db, employee_id, data.lat, data.lon, data.status)
