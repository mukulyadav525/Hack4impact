from datetime import datetime
from pydantic import BaseModel
from typing import Optional, Any, Dict

class BiasAuditBase(BaseModel):
    metric_name: str
    group_a: str
    group_b: str
    value: float
    status: str # PASS, FAIL, WARNING
    details: Optional[Dict[str, Any]] = None

class BiasAudit(BiasAuditBase):
    id: int
    audit_date: datetime

    class Config:
        from_attributes = True
