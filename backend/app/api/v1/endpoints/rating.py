from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.core import WorkSubmission, Employee, PatientKarma, PatientReview
from pydantic import BaseModel

import uuid

router = APIRouter()

class RatingSubmit(BaseModel):
    rating: int # 1-5
    complaint_filed: bool
    comment: str = None

@router.post("/rate-doctor/{submission_id}")
def submit_patient_rating(
    submission_id: str,
    rating_in: RatingSubmit,
    db: Session = Depends(get_db)
):
    try:
        valid_id = uuid.UUID(submission_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid submission ID")

    submission = db.query(WorkSubmission).filter(WorkSubmission.id == valid_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
        
    if not submission.patient_phone:
        raise HTTPException(status_code=400, detail="No patient phone associated with this consultation")
        
    # Check if already reviewed
    existing_review = db.query(PatientReview).filter(PatientReview.submission_id == valid_id).first()
    if existing_review:
        raise HTTPException(status_code=400, detail="Rating already submitted")
        
    # Ensure PatientKarma exists
    patient_karma = db.query(PatientKarma).filter(PatientKarma.phone_number == submission.patient_phone).first()
    if not patient_karma:
        patient_karma = PatientKarma(phone_number=submission.patient_phone)
        db.add(patient_karma)
        db.flush()
        
    # Create Review
    review = PatientReview(
        submission_id=submission.id,
        patient_phone=patient_karma.phone_number,
        rating=rating_in.rating,
        complaint_filed=rating_in.complaint_filed,
        comment=rating_in.comment
    )
    db.add(review)
    
    # Process Complaint
    if rating_in.complaint_filed:
        # Increment doctor complaint
        doctor = db.query(Employee).filter(Employee.id == submission.employee_id).first()
        if doctor:
            doctor.complaint_count = (doctor.complaint_count or 0) + 1
            
        # Increment Patient Karma complaint count
        patient_karma.complaint_count += 1
        
    db.commit()
    
    return {"status": "success", "message": "Rating submitted successfully"}
    
@router.get("/rate-doctor/{submission_id}")
def get_submission_info(
    submission_id: str,
    db: Session = Depends(get_db)
):
    try:
        valid_id = uuid.UUID(submission_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid submission ID")

    submission = db.query(WorkSubmission).filter(WorkSubmission.id == valid_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
        
    doctor = db.query(Employee).filter(Employee.id == submission.employee_id).first()
    return {
        "doctor_name": doctor.name if doctor else "Unknown Doctor",
        "date": submission.created_at,
        "reviewed": db.query(PatientReview).filter(PatientReview.submission_id == valid_id).first() is not None
    }
