from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class WorkSubmissionBase(BaseModel):
    task_type: str
    before_image_base64: str
    after_image_base64: str
    latitude: float
    longitude: float

class WorkSubmissionCreate(WorkSubmissionBase):
    pass

from uuid import UUID

class WorkSubmission(WorkSubmissionBase):
    id: UUID
    employee_id: UUID
    submitted_at: datetime
    status: str
    
    class Config:
        from_attributes = True
