from pydantic import BaseModel
from uuid import UUID
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: Optional[str] = None

class Login(BaseModel):
    govt_id: str
    pin: str

class BiometricLogin(BaseModel):
    govt_id: str
    selfie_base64: str
    latitude: float
    longitude: float

class DepartmentBasic(BaseModel):
    id: int
    name: str
    dept_code: str

    class Config:
        from_attributes = True

class ZoneBasic(BaseModel):
    id: int
    name: str
    city: Optional[str] = None
    district: Optional[str] = None

    class Config:
        from_attributes = True

class Employee(BaseModel):
    id: UUID
    govt_id: str
    name: str
    employee_type: str
    job_role: Optional[str] = None
    is_active: bool
    department: Optional[DepartmentBasic] = None
    zone: Optional[ZoneBasic] = None

    class Config:
        from_attributes = True
