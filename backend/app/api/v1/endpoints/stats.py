from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from typing import Any, Dict

from app.api import deps
from app.models.core import Employee, Department, Zone, WorkSubmission, DailyScore, MonthlyScore, LessonPlan, OPDLog, PatrolLog, Grievance, FraudFlag

router = APIRouter()

@router.get("/admin", response_model=Dict[str, Any])
def get_admin_stats(
    db: Session = Depends(deps.get_db),
    current_user: Employee = Depends(deps.check_admin)
) -> Any:
    """
    Get all dynamic stats for the admin dashboard.
    """
    total_employees = db.query(Employee).count()
    total_departments = db.query(Department).count()
    total_zones = db.query(Zone).count()
    
    # Submissions today
    today = date.today()
    submissions_today_query = db.query(WorkSubmission).filter(
        func.date(WorkSubmission.submitted_at) == today
    )
    submissions_today = submissions_today_query.count()
    pending_review = submissions_today_query.filter(WorkSubmission.status == "review").count()
    ai_verified = submissions_today_query.filter(WorkSubmission.status == "approved").count()
    
    # System Activity
    new_citizen_reports = submissions_today_query.filter(WorkSubmission.task_type.in_(["Garbage Dump Report", "Pothole Report", "Street Light Issue"])).count()
    flagged_for_review = submissions_today_query.filter(WorkSubmission.fraud_risk_score > 0.5).count()
    locked_accounts = db.query(Employee).filter(Employee.is_active == False).count()
    
    # Department Performance
    departments = db.query(Department).all()
    dept_performance = []
    
    colors = ["blue", "emerald", "violet", "orange", "amber", "red", "pink"]
    
    for idx, dept in enumerate(departments):
        # Calculate roughly an average score from daily_scores for this dept
        # We can join DailyScore with Employee
        avg_score = db.query(func.avg(DailyScore.total_score)).join(Employee).filter(Employee.dept_id == dept.id, DailyScore.date == today).scalar()
        
        emp_count = db.query(Employee).filter(Employee.dept_id == dept.id).count()
        
        # Get one zone name as an example (if exists)
        zone = db.query(Zone).filter(Zone.dept_id == dept.id).first()
        zone_name = zone.name if zone else "Multiple"
        
        dept_performance.append({
            "name": dept.name,
            "code": dept.dept_code,
            "color": colors[idx % len(colors)],
            "score": round(avg_score, 1) if avg_score else (70 + (idx * 5)), # Mock if no score today
            "employees": emp_count,
            "zone": zone_name
        })
            
    return {
        "overview": {
            "total_employees": total_employees,
            "departments": total_departments,
            "zones": total_zones,
            "submissions_today": submissions_today,
            "pending_review": pending_review,
            "total_lesson_plans": db.query(LessonPlan).count(),
            "total_opd_logs": db.query(OPDLog).count(),
            "total_patrol_logs": db.query(PatrolLog).count()
        },
        "system_activity": {
            "new_citizen_reports": new_citizen_reports,
            "ai_verified": ai_verified,
            "flagged_for_review": flagged_for_review,
            "locked_accounts": locked_accounts
        },
        "department_performance": dept_performance
    }

@router.get("/me", response_model=Dict[str, Any])
def get_user_stats(
    db: Session = Depends(deps.get_db),
    current_user: Employee = Depends(deps.get_current_user)
) -> Any:
    """
    Get personalized stats and rewards for the logged-in user.
    """
    # Total points = sum of all daily scores
    total_points = db.query(func.sum(DailyScore.total_score)).filter(
        DailyScore.employee_id == current_user.id
    ).scalar() or 0
    
    # Latest tier
    latest_score = db.query(DailyScore).filter(
        DailyScore.employee_id == current_user.id
    ).order_by(DailyScore.date.desc()).first()
    
    current_tier = latest_score.tier if latest_score else "Bronze"
    
    # Tier thresholds
    thresholds = {
        "Bronze": 60,
        "Silver": 80,
        "Gold": 90,
        "Platinum": 100
    }
    
    # Progress to next tier logic (simplified for MVP)
    # Let's say we need a certain number of points total or a high daily average
    # For now, let's use total_points for a simplified level system
    # Level 1: 0-100 (Bronze)
    # Level 2: 100-500 (Silver)
    # Level 3: 500-2000 (Gold)
    # Level 4: 2000+ (Platinum)
    
    points_to_next = 0
    next_tier = "Maxed"
    progress = 100
    
    if total_points < 100:
        next_tier = "Silver"
        points_to_next = 100 - total_points
        progress = (total_points / 100) * 100
    elif total_points < 500:
        next_tier = "Gold"
        points_to_next = 500 - total_points
        progress = ((total_points - 100) / 400) * 100
    elif total_points < 2000:
        next_tier = "Platinum"
        points_to_next = 2000 - total_points
        progress = ((total_points - 500) / 1500) * 100
        
    # Role-specific rewards
    role_rewards = []
    dept_code = current_user.department.dept_code if current_user.department else "DEFAULT"
    
    if dept_code == "POL-HR":
        role_rewards = [
            {"title": "Commendation Certificate", "desc": "Awarded for 50+ Beat Patrol Checks in a month.", "trigger": "Patrol Master", "unlocked": total_points > 500},
            {"title": "Uniform Allowance", "desc": "Special allowance for maintaining high patrol frequency.", "trigger": "Active Duty", "unlocked": total_points > 1000}
        ]
    elif dept_code == "HFW-HR":
        role_rewards = [
            {"title": "Health Hero Badge", "desc": "Recognized for high patient consultation quality.", "trigger": "Patient Care", "unlocked": total_points > 400},
            {"title": "Training Scholarship", "desc": "Advanced medical training sponsorship.", "trigger": "Expert Excellence", "unlocked": total_points > 1200}
        ]
    elif dept_code == "PUBLIC":
        role_rewards = [
            {"title": "Civic Champion Trophy", "desc": "Awarded for consistent community reporting.", "trigger": "Active Citizen", "unlocked": total_points > 200},
            {"title": "Community Grant Link", "desc": "Priority access to local community project funding.", "trigger": "Impact Leader", "unlocked": total_points > 800}
        ]
    else:
        role_rewards = [
            {"title": "Employee of the Month", "desc": "Featured on the government portal for high performance.", "trigger": "Consistency", "unlocked": total_points > 600}
        ]
        
    return {
        "total_points": round(total_points),
        "current_tier": current_tier,
        "next_tier": next_tier,
        "points_to_next": round(points_to_next),
        "progress_percent": round(progress),
        "streak_count": current_user.streak_count or 0,
        "reports_submitted": db.query(WorkSubmission).filter(
            WorkSubmission.employee_id == current_user.id, WorkSubmission.status == "approved"
        ).count(),
        "rewards_claimed": db.query(DailyScore).filter(
            DailyScore.employee_id == current_user.id, DailyScore.total_score >= 90
        ).count(),
        "eligible_rewards": role_rewards,
        "daily_score_history": [
            {
                "date": ds.date.strftime("%Y-%m-%d") if ds.date else None,
                "total_score": round(float(ds.total_score or 0), 1),
                "attendance_score": round(float(ds.attendance_score or 0), 1),
                "work_score": round(float(ds.work_score or 0), 1),
                "quality_score": round(float(ds.quality_score or 0), 1),
                "fraud_penalty": round(float(ds.fraud_penalty or 0), 1),
                "tier": ds.tier or "Bronze"
            }
            for ds in db.query(DailyScore).filter(
                DailyScore.employee_id == current_user.id
            ).order_by(DailyScore.date.desc()).limit(30).all()
        ],
        "monthly_summary": [
            {
                "month": ms.month,
                "year": ms.year,
                "total_score": round(float(ms.total_score or 0), 1),
                "avg_quality": round(float(ms.avg_quality_score or 0), 1),
                "fraud_flags": ms.fraud_flag_count or 0,
                "reward_eligible": ms.reward_eligible
            }
            for ms in db.query(MonthlyScore).filter(
                MonthlyScore.employee_id == current_user.id
            ).order_by(MonthlyScore.year.desc(), MonthlyScore.month.desc()).limit(6).all()
        ]
    }

from app.services.stats import StatsService
from typing import List, Any

@router.get("/bias-audit", response_model=List[Any])
def get_bias_audit(
    db: Session = Depends(deps.get_db),
    admin: Employee = Depends(deps.check_admin)
) -> Any:
    """
    Run and retrieve fairness audits (Admin only).
    """
    return StatsService.run_bias_audit(db)

@router.get("/transparency", response_model=Dict[str, Any])
def get_transparency_stats(
    db: Session = Depends(deps.get_db)
) -> Any:
    """
    Get high-level aggregated stats for the public transparency page.
    """
    return StatsService.get_public_stats(db)
