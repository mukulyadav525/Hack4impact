from sqlalchemy import Column, String, Integer, DateTime, Boolean, ForeignKey, UUID, DECIMAL, Float
from sqlalchemy.dialects.postgresql import JSONB, BYTEA
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from geoalchemy2 import Geometry
import uuid
from app.core.database import Base

class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    ministry = Column(String)
    state = Column(String)
    dept_code = Column(String, unique=True)
    
    zones = relationship("Zone", back_populates="department")
    employees = relationship("Employee", back_populates="department")

class Zone(Base):
    __tablename__ = "zones"

    id = Column(Integer, primary_key=True, index=True)
    dept_id = Column(Integer, ForeignKey("departments.id"))
    name = Column(String, nullable=False)
    boundary = Column(Geometry("POLYGON"))
    city = Column(String)
    district = Column(String)

    department = relationship("Department", back_populates="zones")
    employees = relationship("Employee", back_populates="zone")

class Employee(Base):
    __tablename__ = "employees"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    govt_id = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    dept_id = Column(Integer, ForeignKey("departments.id"))
    zone_id = Column(Integer, ForeignKey("zones.id"))
    employee_type = Column(String) # field_worker, supervisor, etc.
    job_role = Column(String)
    category = Column(String) # SC, ST, OBC, General
    pin_hash = Column(String)
    face_embedding_hash = Column(BYTEA)
    streak_count = Column(Integer, default=0)
    failed_login_attempts = Column(Integer, default=0)
    lockout_until = Column(DateTime(timezone=True), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    department = relationship("Department", back_populates="employees")
    zone = relationship("Zone", back_populates="employees")
    attendance = relationship("Attendance", back_populates="employee")
    submissions = relationship("WorkSubmission", back_populates="employee")
    daily_scores = relationship("DailyScore", back_populates="employee")

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"))
    date = Column(DateTime(timezone=True), server_default=func.now())
    checkin_time = Column(DateTime(timezone=True))
    checkout_time = Column(DateTime(timezone=True))
    checkin_lat = Column(DECIMAL(9, 6))
    checkin_lon = Column(DECIMAL(9, 6))
    status = Column(String) # present, absent, half_day
    streak_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    employee = relationship("Employee", back_populates="attendance")

class WorkSubmission(Base):
    __tablename__ = "work_submissions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"))
    task_type = Column(String, nullable=False)
    before_image_url = Column(String)
    after_image_url = Column(String)
    latitude = Column(DECIMAL(9, 6))
    longitude = Column(DECIMAL(9, 6))
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    ai_confidence = Column(DECIMAL(4, 3))
    ai_quality_score = Column(Integer)
    status = Column(String) # approved, rejected, review
    fraud_risk_score = Column(DECIMAL(4, 3))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    employee = relationship("Employee", back_populates="submissions")

class DailyScore(Base):
    __tablename__ = "daily_scores"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"))
    date = Column(DateTime(timezone=False), server_default=func.now())
    attendance_score = Column(Float)
    work_score = Column(Float)
    quality_score = Column(Float)
    bonus_score = Column(Float)
    fraud_penalty = Column(Float)
    total_score = Column(Float)
    tier = Column(String)
    scoring_version = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    employee = relationship("Employee", back_populates="daily_scores")

class MonthlyScore(Base):
    __tablename__ = "monthly_scores"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"))
    month = Column(Integer)
    year = Column(Integer)
    total_score = Column(Float)
    avg_quality_score = Column(Float)
    reward_eligible = Column(Boolean, default=False)
    fraud_flag_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Reward(Base):
    __tablename__ = "rewards"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"))
    type = Column(String) # bonus, certificate, promotion
    amount = Column(DECIMAL(12, 2))
    trigger = Column(String)
    ai_justification = Column(String)
    status = Column(String) # pending, approved, disbursed, rejected
    payment_ref = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class FraudFlag(Base):
    __tablename__ = "fraud_flags"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    submission_id = Column(UUID(as_uuid=True), ForeignKey("work_submissions.id"))
    flag_type = Column(String) # duplicate_image, gps_velocity, spoofing
    risk_score = Column(DECIMAL(4, 3))
    evidence = Column(JSONB)
    status = Column(String) # open, under_investigation, confirmed, dismissed
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class AuditLog(Base):
    __tablename__ = "audit_log"

    id = Column(Integer, primary_key=True, index=True)
    entity_type = Column(String)
    entity_id = Column(String)
    action = Column(String)
    actor_id = Column(String) # govt_id of the person who performed action
    prev_state = Column(JSONB)
    new_state = Column(JSONB)
    checksum = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
