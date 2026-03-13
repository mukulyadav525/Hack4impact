#!/usr/bin/env python3
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.core import Employee, Department, Zone
from app.core.security import get_password_hash

def seed_custom():
    db = SessionLocal()
    try:
        # Get Health Department
        dept = db.query(Department).filter(Department.dept_code == "HFW").first()
        if not dept:
            print("HFW department not found. Creating it...")
            dept = Department(name="Health & Family Welfare", dept_code="HFW")
            db.add(dept)
            db.flush()
        
        # Get First Zone
        zone = db.query(Zone).filter(Zone.dept_id == dept.id).first()
        if not zone:
            print("HFW Zone not found. Creating it...")
            zone = Zone(name="HFW — North Zone", dept_id=dept.id)
            db.add(zone)
            db.flush()

        # Create/Update Employee
        emp = db.query(Employee).filter(Employee.govt_id == "HEALTH-001").first()
        if emp:
            print("Employee HEALTH-001 already exists. Updating PIN...")
            emp.pin_hash = get_password_hash("1234")
        else:
            print("Creating Employee HEALTH-001...")
            emp = Employee(
                name="Health Professional",
                govt_id="HEALTH-001",
                pin_hash=get_password_hash("1234"),
                employee_type="healthcare",
                job_role="Senior Doctor",
                dept_id=dept.id,
                zone_id=zone.id,
                is_active=True
            )
            db.add(emp)
        
        db.commit()
        print("Successfully seeded HEALTH-001 with PIN 1234")
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_custom()
