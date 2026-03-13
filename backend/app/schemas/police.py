from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class PatrolLogBase(BaseModel):
    route_points: List[dict]
    coverage_percentage: float
    incident_count: int = 0

class PatrolLogCreate(PatrolLogBase):
    pass

class PatrolLog(PatrolLogBase):
    id: UUID
    employee_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class IncidentReportBase(BaseModel):
    type: str
    description: str
    response_time_minutes: Optional[int] = None
    status: str

class IncidentReportCreate(IncidentReportBase):
    pass

class IncidentReport(IncidentReportBase):
    id: UUID
    employee_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class PoliceDashboardData(BaseModel):
    daily_score: float
    monthly_score: float
    patrol_coverage: float
    avg_response_time: float
    incidents_handled: int
