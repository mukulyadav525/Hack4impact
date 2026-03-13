from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models import core as models
from app.schemas import doctor as schemas
from datetime import date

router = APIRouter()

@router.post("/opd-log", response_model=schemas.OPDLog)
def create_opd_log(
    *,
    db: Session = Depends(deps.get_db),
    log_in: schemas.OPDLogCreate,
    current_user: models.Employee = Depends(deps.get_current_active_employee),
):
    # In a real app, we'd check job_role properly
    log = models.OPDLog(
        employee_id=current_user.id,
        **log_in.model_dump()
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log

@router.get("/dashboard", response_model=schemas.DoctorDashboardData)
def get_doctor_dashboard(
    db: Session = Depends(deps.get_db),
    current_user: models.Employee = Depends(deps.get_current_active_employee),
):
    daily_score = db.query(models.DailyScore).filter(
        models.DailyScore.employee_id == current_user.id,
        models.DailyScore.date == date.today()
    ).first()
    
    return {
        "daily_score": daily_score.total_score if daily_score else 0,
        "monthly_score": 92.0,
        "patients_seen_today": 42,
        "avg_response_time": 4.5,
        "feedback_score": 4.8
    }
