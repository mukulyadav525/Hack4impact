from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.models.core import Department, Zone, Employee
from app.core.security import get_password_hash
import uuid

def seed():
    db = SessionLocal()
    try:
        # 1. Create Department
        pwd = Department(
            name="Public Works Department",
            ministry="Urban Development",
            state="Haryana",
            dept_code="PWD-HR"
        )
        db.add(pwd)
        db.flush()

        # 2. Create Zone (Gurugram)
        # Using a simple square for MVP demo if PostGIS is not fullly setup,
        # but the schema expects a Polygon.
        # WKT: POLYGON((77.0 28.0, 77.1 28.0, 77.1 28.1, 77.0 28.1, 77.0 28.0))
        gurugram = Zone(
            dept_id=pwd.id,
            name="Gurugram North-II",
            city="Gurugram",
            district="Gurugram"
        )
        db.add(gurugram)
        db.flush()

        # 3. Create Employees
        mukul = Employee(
            govt_id="MUKUL-123",
            name="Mukul Kumar",
            dept_id=pwd.id,
            zone_id=gurugram.id,
            employee_type="field_worker",
            job_role="Senior Engineer",
            pin_hash=get_password_hash("1234"),
            is_active=True
        )
        db.add(mukul)

        supervisor = Employee(
            govt_id="SUPER-001",
            name="Supervisor John",
            dept_id=pwd.id,
            zone_id=gurugram.id,
            employee_type="supervisor",
            job_role="Dept Head",
            pin_hash=get_password_hash("1234"),
            is_active=True
        )
        db.add(supervisor)

        db.commit()
        print("Demo data seeded successfully!")
    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
