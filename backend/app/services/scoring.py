from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.core import Attendance, WorkSubmission, DailyScore, Employee, MonthlyScore
from datetime import date, datetime, timedelta
from decimal import Decimal

class ScoringService:
    @staticmethod
    def calculate_daily_score(db: Session, employee_id: str, target_date: date):
        """
        Calculates the score for a specific day.
        Score = (Attendance * 30%) + (Work Quality * 40%) + (Count * 30%) - Fraud Penalty
        """
        # 1. Attendance Score (100 if present, 0 if absent)
        attendance = db.query(Attendance).filter(
            Attendance.employee_id == employee_id,
            func.date(Attendance.created_at) == target_date
        ).first()
        
        attendance_score = 100 if attendance else 0
        
        # 2. Work Quality & Count
        submissions = db.query(WorkSubmission).filter(
            WorkSubmission.employee_id == employee_id,
            func.date(WorkSubmission.created_at) == target_date,
            WorkSubmission.status == "approved"
        ).all()
        
        if not submissions:
            work_score = 0
            quality_score = 0
        else:
            # Count score: Min 1 submission for full sub-score in MVP? 
            # Or proportional to avg daily count? Let's say 1 usage = 100 for MVP.
            work_score = 100 
            
            # Quality score: Avg of AI quality scores (0-10 scale -> 0-100)
            avg_quality = sum(s.ai_quality_score for s in submissions) / len(submissions)
            quality_score = avg_quality * 10
            
        # 3. Fraud Penalty
        # Any fraud flag reduces the score significantly
        fraud_penalty = 0
        fraud_count = db.query(WorkSubmission).filter(
            WorkSubmission.employee_id == employee_id,
            func.date(WorkSubmission.created_at) == target_date,
            WorkSubmission.fraud_risk_score > 0.5
        ).count()
        
        if fraud_count > 0:
            fraud_penalty = 50 * fraud_count
            
        # Final weighted score
        total_score = (attendance_score * 0.3) + (quality_score * 0.4) + (work_score * 0.3) - fraud_penalty
        total_score = max(0, min(100, total_score))
        
        # Determine tier
        tier = "Bronze"
        if total_score >= 90: tier = "Platinum"
        elif total_score >= 80: tier = "Gold"
        elif total_score >= 60: tier = "Silver"
        
        daily_score = DailyScore(
            employee_id=employee_id,
            date=datetime.combine(target_date, datetime.min.time()),
            attendance_score=float(attendance_score),
            work_score=float(work_score),
            quality_score=float(quality_score),
            fraud_penalty=float(fraud_penalty),
            total_score=total_score,
            tier=tier,
            scoring_version="1.0"
        )
        
        db.add(daily_score)
        
        # Update streak
        ScoringService.update_streak(db, employee_id, attendance is not None)
        
        db.commit()
        return daily_score

    @staticmethod
    def update_streak(db: Session, employee_id: str, present: bool):
        employee = db.query(Employee).filter(Employee.id == employee_id).first()
        if not employee:
            return
            
        if present:
            employee.streak_count += 1
        else:
            employee.streak_count = 0
            
        db.commit()

    @staticmethod
    def aggregate_monthly_score(db: Session, employee_id: str, month: int, year: int):
        daily_scores = db.query(DailyScore).filter(
            DailyScore.employee_id == employee_id,
            func.extract('month', DailyScore.date) == month,
            func.extract('year', DailyScore.date) == year
        ).all()
        
        if not daily_scores:
            return None
            
        total_score = sum(ds.total_score for ds in daily_scores)
        avg_quality = sum(ds.quality_score for ds in daily_scores) / len(daily_scores)
        fraud_flags = sum(1 for ds in daily_scores if ds.fraud_penalty > 0)
        
        monthly = MonthlyScore(
            employee_id=employee_id,
            month=month,
            year=year,
            total_score=total_score,
            avg_quality_score=avg_quality,
            fraud_flag_count=fraud_flags,
            reward_eligible=(total_score > 500 and fraud_flags == 0) # Example logic
        )
        db.add(monthly)
        db.commit()
        return monthly

    @staticmethod
    def process_rewards(db: Session, monthly_score_id: str):
        monthly = db.query(MonthlyScore).filter(MonthlyScore.id == monthly_score_id).first()
        if not monthly or not monthly.reward_eligible:
            return
            
        from app.models.core import Reward
        
        reward = Reward(
            employee_id=monthly.employee_id,
            type="Cash Bonus",
            amount=Decimal("1000.00"), # Example MVP amount
            trigger=f"Monthly score achievement: {monthly.total_score}",
            ai_justification="Automated reward for high performance and zero fraud.",
            status="pending"
        )
        db.add(reward)
        db.commit()
        return reward
