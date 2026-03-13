import math
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.core import WorkSubmission, Attendance, FraudFlag
from decimal import Decimal

class FraudDetectionService:
    @staticmethod
    def calculate_haversine_distance(lat1, lon1, lat2, lon2):
        # Haversine formula to calculate distance between two GPS points
        R = 6371  # Earth radius in km
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = (math.sin(dlat / 2)**2 + 
             math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * 
             math.sin(dlon / 2)**2)
        c = 2 * math.asin(math.sqrt(a))
        return R * c

    @staticmethod
    def check_gps_velocity(db: Session, employee_id: str, current_lat: float, current_lon: float, current_time: datetime):
        """
        Flags if the employee moved too fast (impossible travel).
        Threshold: 120 km/h.
        """
        # Get the last attendance or submission
        last_attendance = db.query(Attendance).filter(
            Attendance.employee_id == employee_id
        ).order_by(Attendance.created_at.desc()).first()
        
        if not last_attendance or not last_attendance.checkin_lat:
            return 0.0, None

        dist = FraudDetectionService.calculate_haversine_distance(
            float(last_attendance.checkin_lat), float(last_attendance.checkin_lon),
            current_lat, current_lon
        )
        
        time_diff = (current_time - last_attendance.created_at.replace(tzinfo=current_time.tzinfo)).total_seconds() / 3600
        
        if time_diff > 0:
            speed = dist / time_diff
            if speed > 120:
                return 1.0, f"Impossible speed detected: {speed:.2f} km/h"
        
        return 0.0, None

    @staticmethod
    def check_duplicate_image(db: Session, employee_id: str, image_hash: str):
        """
        Checks if the image has been submitted before (by this or another employee).
        """
        # In a real app, we'd use ImageHash (pHash/dHash) and store in Redis.
        # For now, we'll check against existing image URLs or hashes in the DB if we had them.
        # Stubbing for now.
        return 0.0, None

    @staticmethod
    def run_all_checks(db: Session, submission_id: str):
        submission = db.query(WorkSubmission).filter(WorkSubmission.id == submission_id).first()
        if not submission:
            return
            
        risk_score = 0.0
        flags = []
        
        # 1. GPS Velocity Check
        vel_risk, vel_msg = FraudDetectionService.check_gps_velocity(
            db, submission.employee_id, float(submission.latitude), float(submission.longitude), submission.created_at
        )
        if vel_risk > 0:
            risk_score += vel_risk * 0.5
            flags.append({"type": "gps_velocity", "score": vel_risk, "detail": vel_msg})
            
        # Update submission
        submission.fraud_risk_score = Decimal(str(min(risk_score, 1.0)))
        
        # Create FraudFlag records
        for flag in flags:
            ff = FraudFlag(
                submission_id=submission.id,
                flag_type=flag["type"],
                risk_score=Decimal(str(flag["score"])),
                evidence={"detail": flag["detail"]},
                status="open"
            )
            db.add(ff)
            
        db.commit()
