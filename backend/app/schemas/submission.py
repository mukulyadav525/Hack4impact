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

class WorkSubmission(WorkSubmissionBase):
    id: str
    employee_id: str
    submitted_at: datetime
    status: str
    
    class Config:
        from_attributes = True
