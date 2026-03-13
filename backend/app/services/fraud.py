from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.core import WorkSubmission, FraudFlag, Employee
from datetime import datetime, timedelta
from decimal import Decimal
import json

class FraudService:
    @staticmethod
    def run_fraud_checks(db: Session, submission_id: str):
        """
        Runs multiple AI-powered fraud detection checks on a submission.
        """
        submission = db.query(WorkSubmission).filter(WorkSubmission.id == submission_id).first()
        if not submission:
            return

        flags = []
        
        # 1. Duplicate Image Check (Mocked Logic)
        # In a real app, we would use image hashing/embeddings
        duplicate = db.query(WorkSubmission).filter(
            WorkSubmission.id != submission_id,
            WorkSubmission.employee_id == submission.employee_id,
            WorkSubmission.after_image_url == submission.after_image_url,
            WorkSubmission.after_image_url != None
        ).first()
        
        if duplicate:
            flags.append({
                "type": "duplicate_image",
                "risk": 0.95,
                "evidence": {"duplicate_of": str(duplicate.id)}
            })

        # 2. GPS Velocity Check
        # Check if the time taken between this and the previous submission is physically possible
        prev_submission = db.query(WorkSubmission).filter(
            WorkSubmission.employee_id == submission.employee_id,
            WorkSubmission.id != submission_id,
            WorkSubmission.submitted_at < submission.submitted_at
        ).order_by(WorkSubmission.submitted_at.desc()).first()

        if prev_submission and prev_submission.latitude and submission.latitude:
            # Haversine or simple distance (mocked for demo)
            # If distance > 10km and time < 5 mins -> flag
            time_diff = (submission.submitted_at - prev_submission.submitted_at).total_seconds() / 60
            dist_approx = abs(float(submission.latitude) - float(prev_submission.latitude)) + \
                          abs(float(submission.longitude) - float(prev_submission.longitude))
            
            if dist_approx > 0.1 and time_diff < 5: # Thresholds for demo
                flags.append({
                    "type": "gps_velocity",
                    "risk": 0.85,
                    "evidence": {"prev_id": str(prev_submission.id), "time_diff_min": time_diff, "dist_delta": dist_approx}
                })

        # 3. Spoofing Check (Mocked)
        if submission.ai_confidence and submission.ai_confidence < 0.2:
             flags.append({
                "type": "low_confidence_spoof",
                "risk": 0.7,
                "evidence": {"confidence": float(submission.ai_confidence)}
            })

        # Save flags to DB
        max_risk = 0.0
        for flag in flags:
            new_flag = FraudFlag(
                submission_id=submission_id,
                flag_type=flag["type"],
                risk_score=Decimal(str(flag["risk"])),
                evidence=json.loads(json.dumps(flag["evidence"])), # Ensure JSON serializable
                status="open"
            )
            db.add(new_flag)
            if float(flag["risk"]) > max_risk:
                max_risk = float(flag["risk"])

        # Update submission fraud risk
        submission.fraud_risk_score = Decimal(str(max_risk))
        if max_risk > 0.8:
            submission.status = "review" # Re-queue for manual supervisor review

        db.commit()
        return flags
