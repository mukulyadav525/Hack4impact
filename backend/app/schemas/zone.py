from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ZoneBase(BaseModel):
    name: str
    dept_id: int
    city: Optional[str] = None
    district: Optional[str] = None

class ZoneCreate(ZoneBase):
    pass

class Zone(ZoneBase):
    id: int

    class Config:
        from_attributes = True
