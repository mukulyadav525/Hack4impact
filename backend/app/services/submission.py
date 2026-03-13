from app.models.core import WorkSubmission
from app.services.attendance import AttendanceService
from app.core.celery_app import celery_app
from fastapi import HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from decimal import Decimal

class SubmissionService:
    @staticmethod
    def submit_work(
        db: Session, 
        employee_id: str, 
        task_type: str, 
        before_image_base64: str, 
        after_image_base64: str, 
        lat: float, 
        lon: float,
        details: dict = None
    ):
        # 1. Geo-fencing verification
        if not AttendanceService.is_within_zone(db, employee_id, lat, lon):
            raise HTTPException(
                status_code=400,
                detail="Location verification failed: Work proof must be submitted from within your assigned zone."
            )

        # 2. Create initial submission record (Mocking S3 upload)
        before_url = f"https://mock-s3.bucket/before_{employee_id}_{int(datetime.now().timestamp())}.jpg"
        after_url = f"https://mock-s3.bucket/after_{employee_id}_{int(datetime.now().timestamp())}.jpg"

        submission = WorkSubmission(
            employee_id=employee_id,
            task_type=task_type,
            before_image_url=before_url,
            after_image_url=after_url,
            latitude=Decimal(str(lat)),
            longitude=Decimal(str(lon)),
            status="processing",
            ai_confidence=0.0,
            ai_quality_score=0,
            details=details
        )
        db.add(submission)
        db.commit()
        db.refresh(submission)
        # 3. Handle Role-Specific Extensions
        if details:
            from app.models.core import PTMLog, Prescription, WardRound, PCRLog, Assessment
            
            if task_type == "PTM Log":
                db.add(PTMLog(employee_id=employee_id, parent_name=details.get("parent_name"), discussion_summary=details.get("summary")))
            elif task_type == "Prescription":
                db.add(Prescription(employee_id=employee_id, patient_id=details.get("patient_id"), medications=details.get("medications")))
            elif task_type == "Ward Round":
                db.add(WardRound(employee_id=employee_id, ward_name=details.get("ward"), patient_count=details.get("count", 0)))
            elif task_type == "PCR response":
                db.add(PCRLog(employee_id=employee_id, incident_id=details.get("incident_id"), response_time_minutes=details.get("minutes")))
            elif task_type == "Assessment":
                db.add(Assessment(employee_id=employee_id, class_id=details.get("class_id"), average_score=details.get("avg_score", 0)))

        db.commit()

        # 4. Enqueue AI verification and Fraud checks
        try:
            from app.services.fraud import FraudService
            FraudService.run_fraud_checks(db, str(submission.id))
        except Exception as e:
            print(f"Post-processing error: {e}. Defaulting to manual review.")
            submission.status = "review"
            db.commit()
            
        return submission
        
    @staticmethod
    def review_submission(db: Session, submission_id: str, approved: bool):
        from app.services.scoring import ScoringService
        
        submission = db.query(WorkSubmission).filter(WorkSubmission.id == submission_id).first()
        if not submission:
            raise HTTPException(status_code=404, detail="Submission not found")
            
        submission.status = "approved" if approved else "rejected"
        db.commit()
        
        if approved:
            # Trigger score recalculation for the day
            ScoringService.calculate_daily_score(db, str(submission.employee_id), submission.created_at.date())
            
        return submission
