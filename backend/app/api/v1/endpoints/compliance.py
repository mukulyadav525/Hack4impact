from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Any
from app import models, schemas
from app.api import deps
from app.core.database import get_db

router = APIRouter()

@router.get("/bias-audits", response_model=List[schemas.compliance.BiasAudit])
def get_bias_audits(
    db: Session = Depends(get_db),
    current_user: models.core.Employee = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve algorithmic bias audit results. Admin only for now.
    """
    if current_user.employee_type != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
        
    audits = (
        db.query(models.core.BiasAudit)
        .order_by(models.core.BiasAudit.audit_date.desc())
        .all()
    )
    return audits

@router.post("/run-audit", response_model=schemas.compliance.BiasAudit)
def run_bias_audit(
    db: Session = Depends(get_db),
    current_user: models.core.Employee = Depends(deps.get_current_user),
) -> Any:
    """
    Manually trigger a bias audit (Simulated for Demo).
    """
    if current_user.employee_type != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # In a real app, this would query scores per category (SC/ST/OBC/General)
    # For demo, we create a simulated audit result
    new_audit = models.core.BiasAudit(
        metric_name="Demographic Parity",
        group_a="General",
        group_b="SC/ST/OBC",
        value=0.92,
        status="PASS",
        details={
            "general_avg_score": 88.5,
            "quota_avg_score": 86.2,
            "variance": 2.3,
            "note": "Scores normalized across categories show no significant bias."
        }
    )
    db.add(new_audit)
    db.commit()
    db.refresh(new_audit)
    return new_audit
