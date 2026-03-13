from app.core.celery_app import celery_app
from app.core.database import SessionLocal
from app.services.ai_pipeline import ai_pipeline
from app.services.fraud_detection import FraudDetectionService
from app.models.core import WorkSubmission
from decimal import Decimal

from app.services.scoring import ScoringService

@celery_app.task(name="process_submission")
def process_submission_task(submission_id: str):
    db = SessionLocal()
    try:
        submission = db.query(WorkSubmission).filter(WorkSubmission.id == submission_id).first()
        if not submission:
            return

        # 1. Run AI Verification
        ai_result = ai_pipeline.verify_work_proof(
            submission.before_image_url, 
            submission.after_image_url, 
            submission.task_type
        )
        
        submission.ai_confidence = Decimal(str(ai_result.get("confidence", 0.0)))
        submission.ai_quality_score = ai_result.get("quality_score", 0)
        submission.status = ai_result.get("status", "review")
        
        # 2. Run Fraud Detection
        FraudDetectionService.run_all_checks(db, submission_id)
        
        # 3. Trigger Scoring
        ScoringService.calculate_daily_score(db, submission.employee_id, submission.created_at.date())
        
        db.commit()
    finally:
        db.close()
