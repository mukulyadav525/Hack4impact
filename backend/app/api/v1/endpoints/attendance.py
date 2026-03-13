from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any, List
from app import models, schemas
from app.api import deps
from app.core.database import get_db
from app.services.attendance import AttendanceService

router = APIRouter()

@router.post("/check-in", response_model=schemas.attendance.Attendance)
def check_in(
    *,
    db: Session = Depends(get_db),
    attendance_in: schemas.attendance.AttendanceCreate,
    current_user: models.core.Employee = Depends(deps.get_current_user)
) -> Any:
    """
    Mark attendance for the current employee.
    """
    return AttendanceService.mark_attendance(
        db, 
        employee_id=current_user.id, 
        lat=attendance_in.lat, 
        lon=attendance_in.lon, 
        status=attendance_in.status
    )

@router.get("/history", response_model=List[schemas.attendance.Attendance])
def read_attendance_history(
    db: Session = Depends(get_db),
    current_user: models.core.Employee = Depends(deps.get_current_user)
) -> Any:
    """
    Retrieve attendance history for the current employee.
    """
    return AttendanceService.get_attendance_history(db, employee_id=current_user.id)
