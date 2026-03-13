from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models import core as models
from app.schemas import police as schemas
from datetime import date

router = APIRouter()

@router.post("/patrol-log", response_model=schemas.PatrolLog)
def create_patrol_log(
    *,
    db: Session = Depends(deps.get_db),
    log_in: schemas.PatrolLogCreate,
    current_user: models.Employee = Depends(deps.get_current_active_employee),
):
    log = models.PatrolLog(
        employee_id=current_user.id,
        **log_in.model_dump()
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log

@router.post("/incident-report", response_model=schemas.IncidentReport)
def create_incident_report(
    *,
    db: Session = Depends(deps.get_db),
    report_in: schemas.IncidentReportCreate,
    current_user: models.Employee = Depends(deps.get_current_active_employee),
):
    report = models.IncidentReport(
        employee_id=current_user.id,
        **report_in.model_dump()
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report

@router.get("/dashboard", response_model=schemas.PoliceDashboardData)
def get_police_dashboard(
    db: Session = Depends(deps.get_db),
    current_user: models.Employee = Depends(deps.get_current_active_employee),
):
    daily_score = db.query(models.DailyScore).filter(
        models.DailyScore.employee_id == current_user.id,
        models.DailyScore.date == date.today()
    ).first()
    
    return {
        "daily_score": daily_score.total_score if daily_score else 0,
        "monthly_score": 88.0,
        "patrol_coverage": 94.0,
        "avg_response_time": 6.2,
        "incidents_handled": 12
    }
