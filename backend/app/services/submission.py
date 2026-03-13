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
        lon: float
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
            ai_quality_score=0
        )
        db.add(submission)
        db.commit()
        db.refresh(submission)
        
        # 3. Enqueue AI verification and Fraud checks
        try:
            celery_app.send_task("process_submission", args=[str(submission.id)])
        except Exception as e:
            # Fallback for demo: if Redis/Celery is down, mark as 'review' directly
            # so the admin can still approve it in the dashboard.
            print(f"Celery error: {e}. Defaulting to manual review.")
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
