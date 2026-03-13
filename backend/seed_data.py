#!/usr/bin/env python3
"""
GovTrack AI - Demo Seed Data Script
Run: cd backend && python seed_data.py
Creates realistic 30-day data for all roles to power the hackathon demo.
"""

import sys, os, random
from datetime import date, timedelta, datetime
from decimal import Decimal

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.core import (
    Employee, Department, Zone, Attendance, WorkSubmission,
    DailyScore, MonthlyScore, Grievance
)
from app.core.security import get_password_hash

db = SessionLocal()

def seed_departments():
    existing = db.query(Department).count()
    if existing > 0:
        print(f"  Departments already exist ({existing}), skipping.")
        return
    depts = [
        Department(name="Education Department", dept_code="EDU"),
        Department(name="Health & Family Welfare", dept_code="HFW"),
        Department(name="Haryana Police", dept_code="POL"),
        Department(name="District Administration", dept_code="ADMIN"),
        Department(name="Public Services", dept_code="PUBLIC"),
    ]
    db.add_all(depts)
    db.commit()
    print(f"  Created {len(depts)} departments.")

def seed_zones(departments):
    existing = db.query(Zone).count()
    if existing > 0:
        print(f"  Zones already exist ({existing}), skipping.")
        return
    zones = []
    for dept in departments:
        for name in ["North Zone", "South Zone", "Central Zone"]:
            zones.append(Zone(name=f"{dept.dept_code} — {name}", dept_id=dept.id))
    db.add_all(zones)
    db.commit()
    print(f"  Created {len(zones)} zones.")

def seed_employees(departments):
    existing = db.query(Employee).count()
    if existing > 0:
        print(f"  Employees already exist ({existing}), skipping.")
        return
    role_map = {
        "EDU":    [("Priya Sharma","education","Primary Teacher"),("Ramesh Gupta","education","Senior Teacher"),("Anita Devi","education","Principal"),("Suresh Kumar","supervisor","School Inspector")],
        "HFW":    [("Dr. Sunita Rao","healthcare","PHC Doctor"),("Dr. Rajiv Nair","healthcare","Specialist"),("Dr. Meena Joshi","healthcare","Emergency Doctor"),("Nurse Kavita","supervisor","Head Nurse")],
        "POL":    [("Const. Vikram Singh","police","Constable"),("SI Deepak Yadav","police","Sub-Inspector"),("Insp. Amar Thakur","police","Inspector"),("DSP Rajendra","supervisor","DSP")],
        "ADMIN":  [("Mohan Lal","admin","Clerk"),("Seema Agarwal","admin","Section Officer"),("Rajesh Mehta","admin","District Officer"),("Pradeep Singh","admin","Admin")],
        "PUBLIC": [("Citizen One","citizen","Resident"),("Citizen Two","citizen","Resident"),("Citizen Three","citizen","Resident"),("Citizen Four","citizen","Resident")],
    }
    employees = []
    for dept in departments:
        emp_data = role_map.get(dept.dept_code, [])
        zone = db.query(Zone).filter(Zone.dept_id == dept.id).first()
        for i, (name, emp_type, job_role) in enumerate(emp_data):
            govt_id = f"{dept.dept_code}-2024-{(i+1):04d}"
            emp = Employee(
                name=name, govt_id=govt_id,
                pin_hash=get_password_hash("1234"),
                employee_type=emp_type, job_role=job_role,
                dept_id=dept.id, zone_id=zone.id if zone else None,
                grade_band=f"Grade-{random.choice(['A','B','C'])}",
                streak_count=random.randint(0, 15), is_active=True,
            )
            employees.append(emp)
    db.add_all(employees)
    db.commit()
    print(f"  Created {len(employees)} employees.")

def seed_scores(employees):
    existing = db.query(DailyScore).count()
    if existing > 0:
        print(f"  Scores already exist ({existing}), skipping.")
        return
    today = date.today()
    scores = []
    for emp in employees:
        for day_offset in range(30, 0, -1):
            target_date = today - timedelta(days=day_offset)
            att_score = 100.0 if random.random() > 0.12 else 0.0
            quality_score = random.uniform(60.0, 98.0)
            work_score = 100.0 if att_score > 0 else 0.0
            fraud_pen = 50.0 if random.random() < 0.04 else 0.0
            total = max(0.0, min(100.0, (att_score*0.3)+(quality_score*0.4)+(work_score*0.3)-fraud_pen))
            tier = "Bronze"
            if total >= 90: tier = "Platinum"
            elif total >= 80: tier = "Gold"
            elif total >= 60: tier = "Silver"
            scores.append(DailyScore(
                employee_id=emp.id,
                date=datetime.combine(target_date, datetime.min.time()),
                attendance_score=att_score, work_score=work_score,
                quality_score=quality_score, fraud_penalty=fraud_pen,
                total_score=total, tier=tier, scoring_version="1.0"
            ))
    db.bulk_save_objects(scores)
    db.commit()
    print(f"  Created {len(scores)} daily score records.")

def seed_grievances(employees):
    existing = db.query(Grievance).count()
    if existing > 0:
        print(f"  Grievances already exist ({existing}), skipping.")
        return
    field_emps = [e for e in employees if e.employee_type not in ("citizen","admin")]
    if not field_emps:
        return
    grievances = [
        Grievance(employee_id=field_emps[0].id, category="scoring",
            description="My attendance was marked absent on 5th March even though I checked in via the app. GPS was logged correctly. Requesting score review.",
            status="under_review"),
        Grievance(employee_id=field_emps[1].id if len(field_emps)>1 else field_emps[0].id,
            category="rejection",
            description="My lesson plan for 12th March was rejected by AI as low quality. It was a valid digitally prepared plan meeting all criteria.",
            status="open"),
        Grievance(employee_id=field_emps[2].id if len(field_emps)>2 else field_emps[0].id,
            category="other",
            description="Flagged as fraudulent for ward round log on 8th March. GPS anomaly was due to hospital WiFi interference.",
            status="resolved",
            resolution="GPS anomaly confirmed as network interference. Fraud flag dismissed and original score restored."),
    ]
    db.add_all(grievances)
    db.commit()
    print(f"  Created {len(grievances)} grievances.")

def main():
    print("GovTrack AI — Seeding Demo Data")
    print("="*50)
    try:
        print("\n[1/5] Departments:")
        seed_departments()
        departments = db.query(Department).all()
        print("\n[2/5] Zones:")
        seed_zones(departments)
        print("\n[3/5] Employees:")
        seed_employees(departments)
        employees = db.query(Employee).all()
        print("\n[4/5] Daily Scores (30 days):")
        seed_scores(employees)
        print("\n[5/5] Grievances:")
        seed_grievances(employees)
        print("\n" + "="*50)
        print("Seed data created successfully!")
        print("\nDemo Login Credentials (PIN: 1234 for all):")
        print("  Teacher:     EDU-2024-0001")
        print("  Doctor:      HFW-2024-0001")
        print("  Police:      POL-2024-0001")
        print("  Supervisor:  EDU-2024-0004")
        print("  Admin:       ADMIN-2024-0004")
        print("  Citizen:     PUBLIC-2024-0001")
    except Exception as e:
        db.rollback()
        print(f"\nError: {e}")
        import traceback; traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    main()
