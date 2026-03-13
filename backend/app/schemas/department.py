from pydantic import BaseModel
from typing import Optional

class DepartmentBase(BaseModel):
    name: str
    dept_code: str
    ministry: Optional[str] = None
    state: Optional[str] = None

class DepartmentCreate(DepartmentBase):
    pass

class Department(DepartmentBase):
    id: int

    class Config:
        from_attributes = True
