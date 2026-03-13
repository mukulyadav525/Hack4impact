from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models import core as models
from app.schemas import teacher as schemas
from app.services.scoring import ScoringService
from datetime import date

router = APIRouter()

@router.post("/lesson-plan", response_model=schemas.LessonPlan)
def create_lesson_plan(
    *,
    db: Session = Depends(deps.get_db),
    plan_in: schemas.LessonPlanCreate,
    current_user: models.Employee = Depends(deps.get_current_active_employee),
):
    if current_user.job_role not in ["Teacher", "Principal", "PGT", "TGT"]:
        raise HTTPException(status_code=403, detail="Not authorized for teacher actions")
    
    plan = models.LessonPlan(
        employee_id=current_user.id,
        **plan_in.model_dump()
    )
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan

@router.post("/class-proof", response_model=schemas.ClassProof)
def create_class_proof(
    *,
    db: Session = Depends(deps.get_db),
    proof_in: schemas.ClassProofCreate,
    current_user: models.Employee = Depends(deps.get_current_active_employee),
):
    if current_user.job_role not in ["Teacher", "Principal", "PGT", "TGT"]:
        raise HTTPException(status_code=403, detail="Not authorized for teacher actions")
    
    proof = models.ClassProof(
        employee_id=current_user.id,
        **proof_in.model_dump()
    )
    db.add(proof)
    db.commit()
    db.refresh(proof)
    return proof

@router.get("/dashboard", response_model=schemas.TeacherDashboardData)
def get_teacher_dashboard(
    db: Session = Depends(deps.get_db),
    current_user: models.Employee = Depends(deps.get_current_active_employee),
):
    # This is a summary endpoint for the dashboard
    daily_score = db.query(models.DailyScore).filter(
        models.DailyScore.employee_id == current_user.id,
        models.DailyScore.date == date.today()
    ).first()
    
    return {
        "daily_score": daily_score.total_score if daily_score else 0,
        "monthly_score": 85.0, # Placeholder until monthly aggregation is triggered
        "recent_submissions": [],
        "attendance_rate": 95.0,
        "student_count_avg": 35.0
    }
