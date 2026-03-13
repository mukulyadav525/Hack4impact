from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models import core as models
from app.schemas import scoring as schemas

router = APIRouter()
print("ROUTER LOADED: scoring rules endpoint is active")

@router.get("/rules", response_model=List[schemas.ScoringRule])
def read_scoring_rules(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100
):
    rules = db.query(models.ScoringRule).offset(skip).limit(limit).all()
    return rules

@router.post("/rules", response_model=schemas.ScoringRule)
def create_scoring_rule(
    *,
    db: Session = Depends(deps.get_db),
    rule_in: schemas.ScoringRuleCreate
):
    rule = db.query(models.ScoringRule).filter(models.ScoringRule.dept_code == rule_in.dept_code).first()
    if rule:
        raise HTTPException(
            status_code=400,
            detail="A scoring rule for this department already exists.",
        )
    
    rule = models.ScoringRule(
        dept_code=rule_in.dept_code,
        attendance_weight=rule_in.attendance_weight,
        quality_weight=rule_in.quality_weight,
        count_weight=rule_in.count_weight,
        context_bonus_formula=rule_in.context_bonus_formula
    )
    db.add(rule)
    db.commit()
    db.refresh(rule)
    return rule

@router.put("/rules/{rule_id}", response_model=schemas.ScoringRule)
def update_scoring_rule(
    *,
    db: Session = Depends(deps.get_db),
    rule_id: int,
    rule_in: schemas.ScoringRuleUpdate
):
    rule = db.query(models.ScoringRule).filter(models.ScoringRule.id == rule_id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Scoring rule not found")
    
    update_data = rule_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(rule, field, value)
    
    db.add(rule)
    db.commit()
    db.refresh(rule)
    return rule

@router.delete("/rules/{rule_id}", response_model=schemas.ScoringRule)
def delete_scoring_rule(
    *,
    db: Session = Depends(deps.get_db),
    rule_id: int
):
    rule = db.query(models.ScoringRule).filter(models.ScoringRule.id == rule_id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Scoring rule not found")
    
    db.delete(rule)
    db.commit()
    return rule
