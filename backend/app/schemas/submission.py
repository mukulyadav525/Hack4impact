from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class WorkSubmissionBase(BaseModel):
    task_type: str
    before_image_url: str
    after_image_url: str
    latitude: float
    longitude: float

class WorkSubmissionCreate(WorkSubmissionBase):
    pass

class WorkSubmission(WorkSubmissionBase):
    id: str
    employee_id: str
    submitted_at: datetime
    status: str
    
    class Config:
        from_attributes = True
