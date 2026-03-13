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
        before_url=submission_in.before_image_url, 
        after_url=submission_in.after_image_url, 
        lat=submission_in.latitude, 
        lon=submission_in.longitude
    )
