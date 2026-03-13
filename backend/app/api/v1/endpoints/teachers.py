from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models import core as models
from app.schemas import teacher as schemas
from app.services.scoring import ScoringService
from datetime import date
from sqlalchemy.sql import func

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
    # Start with base attendance points
    attendance = db.query(models.Attendance).filter(
        models.Attendance.employee_id == current_user.id,
        models.Attendance.date >= func.current_date()
    ).first()
    
    base_score = 50 if attendance else 0
    
    # Add points for every submission today
    submissions = db.query(models.WorkSubmission).filter(
        models.WorkSubmission.employee_id == current_user.id,
        func.date(models.WorkSubmission.created_at) == date.today()
    ).all()
    
    submission_points = len(submissions) * 15
    student_counts = []
    
    for sub in submissions:
        if sub.details and 'student_count' in sub.details:
            try:
                student_counts.append(int(sub.details['student_count']))
            except (ValueError, TypeError):
                pass
                
    total_score = min(100, base_score + submission_points)
    avg_students = sum(student_counts) / len(student_counts) if student_counts else 35.0
    
    return {
        "daily_score": total_score,
        "monthly_score": 85.0 + (submission_points * 0.1), 
        "recent_submissions": [{"id": str(s.id), "type": s.task_type} for s in submissions[:5]],
        "attendance_rate": 100.0 if attendance else 94.0,
        "student_count_avg": round(avg_students, 1)
    }
