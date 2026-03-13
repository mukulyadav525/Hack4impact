from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.core import Attendance, WorkSubmission, DailyScore, Employee, MonthlyScore, ScoringRule, ClimateAdjustment
from app.services.fraud import FraudService
from datetime import date, datetime, timedelta
from decimal import Decimal

class ScoringService:
    @staticmethod
    def calculate_daily_score(db: Session, employee_id: str, target_date: date):
        """
        Calculates the score for a specific day using dynamic rules,
        incorporating fraud penalties and climate adjustments.
        """
        # Fetch Employee and Department
        employee = db.query(Employee).filter(Employee.id == employee_id).first()
        if not employee:
            return None
        
        dept_code = employee.department.dept_code if employee.department else "DEFAULT"

        # Fetch dynamic scoring rule
        rule = db.query(ScoringRule).filter(ScoringRule.dept_code == dept_code).first()
        if not rule:
            # Default fallback weights if no rule exists
            rule = ScoringRule(
                attendance_weight=0.3,
                quality_weight=0.4,
                count_weight=0.3,
                context_bonus_formula=[]
            )
        
        # Fetch Climate Adjustments for this zone/date
        climate = db.query(ClimateAdjustment).filter(
            ClimateAdjustment.region_id == employee.zone_id,
            ClimateAdjustment.start_date <= target_date,
            ClimateAdjustment.end_date >= target_date
        ).first()
        climate_multiplier = float(climate.weight_multiplier) if climate else 1.0

        # 1. Attendance Score
        attendance = db.query(Attendance).filter(
            Attendance.employee_id == employee_id,
            func.date(Attendance.created_at) == target_date
        ).first()
        
        attendance_score = 100.0 if attendance else 0.0
        if dept_code == "PUBLIC":
            attendance_score = 100.0
        
        # 2. Work Quality & Count
        submissions = db.query(WorkSubmission).filter(
            WorkSubmission.employee_id == employee_id,
            func.date(WorkSubmission.created_at) == target_date,
            WorkSubmission.status == "approved"
        ).all()
        
        context_bonus = 0.0
        work_score = 0.0
        quality_score = 0.0
        
        if submissions:
            work_score = 100.0
            
            # Quality score: Avg of AI quality scores (0-10 scale -> 0-100)
            avg_quality = sum((s.ai_quality_score or 0) for s in submissions) / len(submissions)
            quality_score = float(avg_quality) * 10.0

            # --- Dynamic Context-Aware Bonuses ---
            if rule.context_bonus_formula:
                for formula in rule.context_bonus_formula:
                    task_type = formula.get("task_type")
                    points = float(formula.get("points", 0))
                    max_bonus = float(formula.get("max", 20))
                    
                    task_count = sum(1 for s in submissions if s.task_type == task_type)
                    bonus = min(max_bonus, task_count * points)
                    context_bonus += bonus
            
        # 3. Fraud Penalty
        fraud_penalty = 0.0
        fraud_count = db.query(WorkSubmission).filter(
            WorkSubmission.employee_id == employee_id,
            func.date(WorkSubmission.created_at) == target_date,
            WorkSubmission.fraud_risk_score > 0.5
        ).count()
        
        if fraud_count > 0:
            fraud_penalty = float(50 * fraud_count)
            
        # Final weighted score with climate multiplier
        raw_score = (
            (attendance_score * rule.attendance_weight) + 
            (quality_score * rule.quality_weight) + 
            (work_score * rule.count_weight) + 
            context_bonus - 
            fraud_penalty
        ) * climate_multiplier
        total_score = float(max(0.0, min(100.0, raw_score)))
        
        # Determine tier
        tier = "Bronze"
        if total_score >= 90: tier = "Platinum"
        elif total_score >= 80: tier = "Gold"
        elif total_score >= 60: tier = "Silver"
        
        # Check for existing score for this day
        existing_score = db.query(DailyScore).filter(
            DailyScore.employee_id == employee_id,
            func.date(DailyScore.date) == target_date
        ).first()

        if existing_score:
            existing_score.attendance_score = attendance_score
            existing_score.work_score = work_score
            existing_score.quality_score = quality_score
            existing_score.fraud_penalty = fraud_penalty
            existing_score.total_score = total_score
            existing_score.tier = tier
            daily_score = existing_score
        else:
            daily_score = DailyScore(
                employee_id=employee_id,
                date=datetime.combine(target_date, datetime.min.time()),
                attendance_score=attendance_score,
                work_score=work_score,
                quality_score=quality_score,
                fraud_penalty=fraud_penalty,
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
