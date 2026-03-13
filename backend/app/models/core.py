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
    grade_band = Column(String) # For rank-normalization (e.g., Level 1, Grade A)
    pin_hash = Column(String)
    face_embedding_hash = Column(BYTEA)
    streak_count = Column(Integer, default=0)
    failed_login_attempts = Column(Integer, default=0)
    complaint_count = Column(Integer, default=0)
    lockout_until = Column(DateTime(timezone=True), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    department = relationship("Department", back_populates="employees")
    zone = relationship("Zone", back_populates="employees")
    attendance = relationship("Attendance", back_populates="employee")
    submissions = relationship("WorkSubmission", back_populates="employee")
    daily_scores = relationship("DailyScore", back_populates="employee")
    grievances = relationship("Grievance", back_populates="employee", foreign_keys="[Grievance.employee_id]")

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
    details = Column(JSONB, nullable=True) # Role-specific details
    patient_phone = Column(String, nullable=True) # For healthcare rating SMS
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

class ScoringRule(Base):
    __tablename__ = "scoring_rules"

    id = Column(Integer, primary_key=True, index=True)
    dept_code = Column(String, unique=True, index=True)
    attendance_weight = Column(Float, default=0.3)
    quality_weight = Column(Float, default=0.4)
    count_weight = Column(Float, default=0.3)
    context_bonus_formula = Column(JSONB, nullable=True) # [{"task_type": "...", "points": 5, "max": 20}]
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

# --- New Tables to reach 34 ---

class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True)
    permissions = Column(JSONB)

class GradeBand(Base):
    __tablename__ = "grade_bands"
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True) # Grade A, B, C
    min_score = Column(Float)
    multiplier = Column(Float, default=1.0)

class Prescription(Base):
    __tablename__ = "prescriptions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"))
    patient_id = Column(String)
    medications = Column(JSONB)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class WardRound(Base):
    __tablename__ = "ward_rounds"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"))
    ward_name = Column(String)
    patient_count = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class PTMLog(Base):
    __tablename__ = "ptm_logs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"))
    parent_name = Column(String)
    discussion_summary = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Assessment(Base):
    __tablename__ = "assessments"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"))
    class_id = Column(String)
    average_score = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class PCRLog(Base):
    __tablename__ = "pcr_logs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"))
    incident_id = Column(String)
    arrival_time = Column(DateTime(timezone=True))
    response_time_minutes = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Penalty(Base):
    __tablename__ = "penalties"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"))
    reason = Column(String)
    amount = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Review(Base):
    __tablename__ = "reviews"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    submission_id = Column(UUID(as_uuid=True), ForeignKey("work_submissions.id"))
    supervisor_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"))
    comment = Column(String)
    rating = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class RewardTier(Base):
    __tablename__ = "reward_tiers"
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True) # Bronze, Silver, Gold, Platinum, Diamond
    min_monthly_score = Column(Float)
    benefits = Column(JSONB)

class SupervisorAssignment(Base):
    __tablename__ = "supervisor_assignments"
    id = Column(Integer, primary_key=True)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"))
    supervisor_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class AdminAction(Base):
    __tablename__ = "admin_actions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    admin_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"))
    action_type = Column(String)
    target_entity = Column(String)
    target_id = Column(String)
    reason = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ScoreBreakdown(Base):
    __tablename__ = "score_breakdowns"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    daily_score_id = Column(UUID(as_uuid=True), ForeignKey("daily_scores.id"))
    component = Column(String) # attendance, quality, task_bonus, etc.
    points = Column(Float)
    explanation = Column(String)

# --- Role Specific Extension Tables ---

class LessonPlan(Base):
    __tablename__ = "lesson_plans"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"))
    date = Column(DateTime(timezone=False))
    subject = Column(String)
    content_url = Column(String) # PDF/Doc proof
    is_early_submission = Column(Boolean, default=False) # Before 8 AM check
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ClassProof(Base):
    __tablename__ = "class_proofs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"))
    video_url = Column(String)
    student_count_detected = Column(Integer)
    session_type = Column(String) # Regular, Lab, Extra
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class OPDLog(Base):
    __tablename__ = "opd_logs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"))
    patient_count = Column(Integer)
    start_time = Column(DateTime(timezone=True))
    end_time = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class PatrolLog(Base):
    __tablename__ = "patrol_logs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"))
    route_points = Column(JSONB) # List of [lat, lon, timestamp]
    coverage_percentage = Column(Float)
    incident_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class IncidentReport(Base):
    __tablename__ = "incident_reports"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"))
    type = Column(String) # FIR, NCR, General
    description = Column(String)
    response_time_minutes = Column(Integer, nullable=True)
    status = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Feedback(Base):
    __tablename__ = "feedback"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"))
    source = Column(String) # citizen, parent, patient
    rating = Column(Integer) # 1-5
    comment = Column(String)
    submission_id = Column(UUID(as_uuid=True), ForeignKey("work_submissions.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Grievance(Base):
    __tablename__ = "grievances"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"))
    disputed_score_id = Column(UUID(as_uuid=True), ForeignKey("daily_scores.id"), nullable=True)
    category = Column(String) # scoring, rejection, disciplinary
    description = Column(String)
    status = Column(String) # open, under_review, resolved, rejected
    reviewer_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"), nullable=True)
    resolution = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    employee = relationship("Employee", foreign_keys=[employee_id], back_populates="grievances")

class ClimateAdjustment(Base):
    __tablename__ = "climate_adjustments"
    id = Column(Integer, primary_key=True, index=True)
    alert_type = Column(String) # Heatwave, Heavy Rainfall, Red Alert
    region_id = Column(Integer, ForeignKey("zones.id"))
    start_date = Column(DateTime(timezone=True))
    end_date = Column(DateTime(timezone=True))
    weight_multiplier = Column(Float, default=1.0)
    allow_threshold_relaxation = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"))
    type = Column(String) # fraud_flag, score_computed, grievance_update, reward_unlocked
    message = Column(String)
    read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class BiasAudit(Base):
    __tablename__ = "bias_audits"
    id = Column(Integer, primary_key=True, index=True)
    metric_name = Column(String) # Demographic Parity, Disparate Impact
    group_a = Column(String) # e.g., General
    group_b = Column(String) # e.g., SC/ST
    value = Column(Float)
    status = Column(String) # PASS, FAIL, WARNING
    audit_date = Column(DateTime(timezone=True), server_default=func.now())
    details = Column(JSONB)

class PatientKarma(Base):
    __tablename__ = "patient_karma"

    id = Column(Integer, primary_key=True, index=True)
    phone_number = Column(String, unique=True, index=True)
    complaint_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class PatientReview(Base):
    __tablename__ = "patient_reviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    submission_id = Column(UUID(as_uuid=True), ForeignKey("work_submissions.id"))
    patient_phone = Column(String, ForeignKey("patient_karma.phone_number"))
    rating = Column(Integer) # 1-5
    complaint_filed = Column(Boolean, default=False)
    comment = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
