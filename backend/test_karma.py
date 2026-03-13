import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from app.core.database import SessionLocal
from app.models.core import Employee, WorkSubmission, PatientKarma, PatientReview

def test():
    db = SessionLocal()
    doctor = db.query(Employee).filter(Employee.govt_id == "HEALTH-001").first()
    print(f"Doctor complaints before: {doctor.complaint_count}")
    
    # 1. Create a submission directly
    from app.services.submission import SubmissionService
    try:
        submission = SubmissionService.submit_work(
            db=db,
            employee_id=doctor.id,
            task_type="patient_consultation",
            before_image_base64="mock_img",
            after_image_base64="mock_img",
            lat=28.6,
            lon=77.2,
            details={"location_ref": "Room 2"},
            patient_phone="9876543210"
        )
        print(f"Submission created: {submission.id}")
    except Exception as e:
        print(f"Failed to submit work: {e}")
        # Manual insert for test if location validation fails
        submission = WorkSubmission(
            employee_id=doctor.id,
            task_type="patient_consultation",
            latitude=28.6,
            longitude=77.2,
            status="processing",
            patient_phone="9876543210"
        )
        db.add(submission)
        db.commit()
        db.refresh(submission)
        print(f"Fallback. Submission created manually: {submission.id}")
    
    # 2. Add rating with complaint
    from app.api.v1.endpoints.rating import submit_patient_rating, RatingSubmit
    submit_patient_rating(
        submission_id=str(submission.id),
        rating_in=RatingSubmit(rating=2, complaint_filed=True, comment="Doctor was late!"),
        db=db
    )
    
    # Check updated stats
    # Force query to bypass session cache
    doctor = db.query(Employee).filter(Employee.govt_id == "HEALTH-001").first()
    patient = db.query(PatientKarma).filter(PatientKarma.phone_number == "9876543210").first()
    
    print(f"Doctor complaints after: {doctor.complaint_count}")
    print(f"Patient complaints: {patient.complaint_count}")

if __name__ == "__main__":
    test()
