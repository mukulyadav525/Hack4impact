from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.models.core import Department, Zone, Employee
from app.core.security import get_password_hash
import uuid

def seed():
    db = SessionLocal()
    try:
        # 1. Create Department
        pwd = db.query(Department).filter(Department.dept_code == "PWD-HR").first()
        if not pwd:
            pwd = Department(
                name="Public Works Department",
                ministry="Urban Development",
                state="Haryana",
                dept_code="PWD-HR"
            )
            db.add(pwd)
            db.flush()

        # 2. Create Zone (Gurugram)
        gurugram = db.query(Zone).filter(Zone.name == "Gurugram North-II").first()
        if not gurugram:
            gurugram = Zone(
                dept_id=pwd.id,
                name="Gurugram North-II",
                city="Gurugram",
                district="Gurugram"
            )
            db.add(gurugram)
            db.flush()

        # Mukul - Senior Engineer (PWD)
        mukul = db.query(Employee).filter(Employee.govt_id == "MUKUL-123").first()
        if not mukul:
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

        # 4. Health Department (ASHA/Doctor)
        health = db.query(Department).filter(Department.dept_code == "HFW-HR").first()
        if not health:
            health = Department(
                name="Health & Family Welfare",
                ministry="Health",
                state="Haryana",
                dept_code="HFW-HR"
            )
            db.add(health)
            db.flush()

        h_zone = db.query(Zone).filter(Zone.name == "Civil Hospital Sector-10").first()
        if not h_zone:
            h_zone = Zone(dept_id=health.id, name="Civil Hospital Sector-10", city="Gurugram", district="Gurugram")
            db.add(h_zone)
            db.flush()

        dr_sharma = db.query(Employee).filter(Employee.govt_id == "DOC-999").first()
        if not dr_sharma:
            dr_sharma = Employee(
                govt_id="DOC-999",
                name="Dr. Anjali Sharma",
                dept_id=health.id,
                zone_id=h_zone.id,
                employee_type="field_worker",
                job_role="Senior Resident",
                pin_hash=get_password_hash("1234"),
                is_active=True
            )
            db.add(dr_sharma)

        # 5. Police Department
        police = db.query(Department).filter(Department.dept_code == "POL-HR").first()
        if not police:
            police = Department(
                name="Haryana Police",
                ministry="Home Affairs",
                state="Haryana",
                dept_code="POL-HR"
            )
            db.add(police)
            db.flush()

        p_zone = db.query(Zone).filter(Zone.name == "Police Station East").first()
        if not p_zone:
            p_zone = Zone(dept_id=police.id, name="Police Station East", city="Gurugram", district="Gurugram")
            db.add(p_zone)
            db.flush()

        officer_singh = db.query(Employee).filter(Employee.govt_id == "POLICE-007").first()
        if not officer_singh:
            officer_singh = Employee(
                govt_id="POLICE-007",
                name="Inspector Vikram Singh",
                dept_id=police.id,
                zone_id=p_zone.id,
                employee_type="field_worker",
                job_role="Inspector",
                pin_hash=get_password_hash("1234"),
                is_active=True
            )
            db.add(officer_singh)

        # 6. Education Department
        edu = db.query(Department).filter(Department.dept_code == "EDU-HR").first()
        if not edu:
            edu = Department(
                name="Higher Education",
                ministry="Education",
                state="Haryana",
                dept_code="EDU-HR"
            )
            db.add(edu)
            db.flush()

        e_zone = db.query(Zone).filter(Zone.name == "Govt Senior Secondary School").first()
        if not e_zone:
            e_zone = Zone(dept_id=edu.id, name="Govt Senior Secondary School", city="Gurugram", district="Gurugram")
            db.add(e_zone)
            db.flush()

        teacher_rai = db.query(Employee).filter(Employee.govt_id == "TEACH-456").first()
        if not teacher_rai:
            teacher_rai = Employee(
                govt_id="TEACH-456",
                name="Meera Rai",
                dept_id=edu.id,
                zone_id=e_zone.id,
                employee_type="field_worker",
                job_role="Post Graduate Teacher",
                pin_hash=get_password_hash("1234"),
                is_active=True
            )
            db.add(teacher_rai)

        supervisor = db.query(Employee).filter(Employee.govt_id == "SUPER-001").first()
        if not supervisor:
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

        admin = Employee(
            govt_id="ADMIN-001",
            name="Central Admin",
            dept_id=pwd.id,
            zone_id=gurugram.id,
            employee_type="admin",
            job_role="System Administrator",
            pin_hash=get_password_hash("1234"),
            is_active=True
        )
        db.add(admin)

        db.commit()
        print("Demo data seeded successfully!")
    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
