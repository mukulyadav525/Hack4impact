from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AttendanceBase(BaseModel):
    checkin_lat: float
    checkin_lon: float
    status: str = "present"

class AttendanceCreate(BaseModel):
    lat: float
    lon: float
    status: str = "present"

from uuid import UUID

class Attendance(AttendanceBase):
    id: UUID
    employee_id: UUID
    checkin_time: datetime
    
    class Config:
        from_attributes = True
