from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class GrievanceBase(BaseModel):
    disputed_score_id: Optional[UUID] = None
    category: str
    description: str

class GrievanceCreate(GrievanceBase):
    pass

class GrievanceUpdate(BaseModel):
    status: str
    resolution: Optional[str] = None
    reviewer_id: Optional[UUID] = None

class Grievance(GrievanceBase):
    id: UUID
    employee_id: UUID
    status: str
    resolution: Optional[str] = None
    reviewer_id: Optional[UUID] = None
    created_at: datetime

    class Config:
        from_attributes = True
