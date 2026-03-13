from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime

class ScoringRuleBase(BaseModel):
    dept_code: str
    attendance_weight: float = 0.3
    quality_weight: float = 0.4
    count_weight: float = 0.3
    custom_weights: Optional[List[dict]] = None
    context_bonus_formula: Optional[List[dict]] = None

class ScoringRuleCreate(ScoringRuleBase):
    pass

class ScoringRuleUpdate(BaseModel):
    attendance_weight: Optional[float] = None
    quality_weight: Optional[float] = None
    count_weight: Optional[float] = None
    custom_weights: Optional[List[dict]] = None
    context_bonus_formula: Optional[List[dict]] = None

class ScoringRule(ScoringRuleBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
