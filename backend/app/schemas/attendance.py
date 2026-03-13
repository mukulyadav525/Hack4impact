from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AttendanceBase(BaseModel):
    lat: float
    lon: float
    status: str = "present"

class AttendanceCreate(AttendanceBase):
    pass

class Attendance(AttendanceBase):
    id: str
    employee_id: str
    date: datetime
    
    class Config:
        from_attributes = True
