from datetime import datetime
from uuid import UUID
from pydantic import BaseModel
from typing import Optional

class NotificationBase(BaseModel):
    type: str
    message: str

class NotificationCreate(NotificationBase):
    employee_id: UUID

class NotificationUpdate(BaseModel):
    read: bool

class Notification(NotificationBase):
    id: UUID
    employee_id: UUID
    read: bool
    created_at: datetime

    class Config:
        from_attributes = True
