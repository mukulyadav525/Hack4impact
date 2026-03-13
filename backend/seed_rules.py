from app.core.database import SessionLocal
from app.models.core import ScoringRule
import json

def seed():
    db = SessionLocal()
    rules = [
        {
            "dept_code": "POL-HR",
            "attendance_weight": 0.3,
            "quality_weight": 0.4,
            "count_weight": 0.3,
            "context_bonus_formula": [
                {"task_type": "Beat Patrol Check", "points": 5, "max": 20}
            ]
        },
        {
            "dept_code": "HFW-HR",
            "attendance_weight": 0.3,
            "quality_weight": 0.4,
            "count_weight": 0.3,
            "context_bonus_formula": [
                {"task_type": "Immunization Drive", "points": 7, "max": 21},
                {"task_type": "Patient Consultation", "points": 3, "max": 15}
            ]
        },
        {
            "dept_code": "EDU-HR",
            "attendance_weight": 0.4,
            "quality_weight": 0.4,
            "count_weight": 0.2,
            "context_bonus_formula": [
                {"task_type": "Class Observation", "points": 5, "max": 20}
            ]
        },
        {
            "dept_code": "PUBLIC",
            "attendance_weight": 0.0,
            "quality_weight": 0.5,
            "count_weight": 0.5,
            "context_bonus_formula": [
                {"task_type": "Community Feedback", "points": 5, "max": 25}
            ]
        },
        {
            "dept_code": "PWD-HR",
            "attendance_weight": 0.3,
            "quality_weight": 0.4,
            "count_weight": 0.3,
            "context_bonus_formula": [
                {"task_type": "Road Maintenance", "points": 10, "max": 30}
            ]
        }
    ]

    for rule_data in rules:
        existing = db.query(ScoringRule).filter(ScoringRule.dept_code == rule_data["dept_code"]).first()
        if existing:
            for key, value in rule_data.items():
                setattr(existing, key, value)
        else:
            db.add(ScoringRule(**rule_data))
    
    db.commit()
    db.close()
    print("Seed completed successfully!")

if __name__ == "__main__":
    seed()
