from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.submission import SubmissionService
from pydantic import BaseModel

router = APIRouter()

class SubmissionCreate(BaseModel):
    task_type: str
    before_image_url: str
    after_image_url: str
    lat: float
    lon: float

@router.post("/submit")
def submit_work(data: SubmissionCreate, db: Session = Depends(get_db)):
    # Mocking employee_id for now
    employee_id = "00000000-0000-0000-0000-000000000000"
    return SubmissionService.submit_work(
        db, 
        employee_id, 
        data.task_type, 
        data.before_image_url, 
        data.after_image_url, 
        data.lat, 
        data.lon
    )
