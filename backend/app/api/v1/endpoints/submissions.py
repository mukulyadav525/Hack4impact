from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any, List
from app import models, schemas
from app.api import deps
from app.core.database import get_db
from app.services.submission import SubmissionService

router = APIRouter()

@router.post("/submit", response_model=schemas.submission.WorkSubmission)
def submit_work(
    *,
    db: Session = Depends(get_db),
    submission_in: schemas.submission.WorkSubmissionCreate,
    current_user: models.core.Employee = Depends(deps.get_current_user)
) -> Any:
    """
    Submit work proof for the current employee.
    """
    return SubmissionService.submit_work(
        db, 
        employee_id=current_user.id, 
        task_type=submission_in.task_type, 
        before_image_base64=submission_in.before_image_base64, 
        after_image_base64=submission_in.after_image_base64, 
        lat=submission_in.latitude, 
        lon=submission_in.longitude
    )

@router.get("/history", response_model=List[schemas.submission.WorkSubmission])
def read_submission_history(
    db: Session = Depends(get_db),
    current_user: models.core.Employee = Depends(deps.get_current_user)
) -> Any:
    """
    Retrieve submission history for the current employee.
    """
    return db.query(models.core.WorkSubmission).filter(models.core.WorkSubmission.employee_id == current_user.id).all()
