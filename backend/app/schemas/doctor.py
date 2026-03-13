from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class OPDLogBase(BaseModel):
    patient_count: int
    start_time: datetime
    end_time: datetime

class OPDLogCreate(OPDLogBase):
    pass

class OPDLog(OPDLogBase):
    id: UUID
    employee_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class DoctorDashboardData(BaseModel):
    daily_score: float
    monthly_score: float
    patients_seen_today: int
    avg_response_time: float
    feedback_score: float
