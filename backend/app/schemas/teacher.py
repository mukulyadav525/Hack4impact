from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class LessonPlanBase(BaseModel):
    date: datetime
    subject: str
    content_url: str
    is_early_submission: bool = False

class LessonPlanCreate(LessonPlanBase):
    pass

class LessonPlan(LessonPlanBase):
    id: UUID
    employee_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class ClassProofBase(BaseModel):
    video_url: str
    student_count_detected: int
    session_type: str

class ClassProofCreate(ClassProofBase):
    pass

class ClassProof(ClassProofBase):
    id: UUID
    employee_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class TeacherDashboardData(BaseModel):
    daily_score: float
    monthly_score: float
    recent_submissions: List[dict]
    attendance_rate: float
    student_count_avg: float
