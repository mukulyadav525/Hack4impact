from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AttendanceBase(BaseModel):
    lat: float
    lon: float
    status: str = "present"

class AttendanceCreate(AttendanceBase):
    pass

from uuid import UUID

class Attendance(AttendanceBase):
    id: UUID
    employee_id: UUID
    date: datetime
    
    class Config:
        from_attributes = True
