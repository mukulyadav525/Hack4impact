from pydantic import BaseModel, EmailStr
from typing import Optional

class EmployeeCreate(BaseModel):
    govt_id: str
    name: str
    pin: str
    employee_type: str
    job_role: Optional[str] = None
    dept_id: Optional[int] = None
    zone_id: Optional[int] = None

class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    pin: Optional[str] = None
    is_active: Optional[bool] = None

