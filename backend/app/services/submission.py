from app.core.celery_app import celery_app

class SubmissionService:
    @staticmethod
    def submit_work(
        db: Session, 
        employee_id: str, 
        task_type: str, 
        before_url: str, 
        after_url: str, 
        lat: float, 
        lon: float
    ):
        # 1. Geo-fencing verification
        if not AttendanceService.is_within_zone(db, employee_id, lat, lon):
            raise HTTPException(
                status_code=400,
                detail="Location verification failed: Work proof must be submitted from within your assigned zone."
            )

        # 2. Create initial submission record
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
        celery_app.send_task("process_submission", args=[str(submission.id)])
        
        return submission
