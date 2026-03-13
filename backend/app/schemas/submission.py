from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class WorkSubmissionBase(BaseModel):
    task_type: str
    latitude: float
    longitude: float
    details: Optional[dict] = None

class WorkSubmissionCreate(WorkSubmissionBase):
    before_image_base64: str
    after_image_base64: str

from uuid import UUID

class WorkSubmission(WorkSubmissionBase):
    id: UUID
    employee_id: UUID
    before_image_url: Optional[str] = None
    after_image_url: Optional[str] = None
    submitted_at: datetime
    status: str
    score: Optional[float] = None
    quality_score: Optional[float] = None
    
    class Config:
        from_attributes = True
