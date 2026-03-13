from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models import core as models
from app.schemas import grievance as schemas
from uuid import UUID

router = APIRouter()

@router.get("/", response_model=List[schemas.Grievance])
def read_grievances(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.Employee = Depends(deps.get_current_active_employee),
):
    if current_user.employee_type == "admin":
        return db.query(models.Grievance).offset(skip).limit(limit).all()
    return db.query(models.Grievance).filter(models.Grievance.employee_id == current_user.id).offset(skip).limit(limit).all()

@router.post("/", response_model=schemas.Grievance)
def create_grievance(
    *,
    db: Session = Depends(deps.get_db),
    grievance_in: schemas.GrievanceCreate,
    current_user: models.Employee = Depends(deps.get_current_active_employee),
):
    grievance = models.Grievance(
        employee_id=current_user.id,
        status="open",
        **grievance_in.model_dump()
    )
    db.add(grievance)
    db.commit()
    db.refresh(grievance)
    return grievance

@router.patch("/{grievance_id}", response_model=schemas.Grievance)
def update_grievance(
    *,
    db: Session = Depends(deps.get_db),
    grievance_id: UUID,
    grievance_in: schemas.GrievanceUpdate,
    current_user: models.Employee = Depends(deps.get_current_active_employee),
):
    if current_user.employee_type not in ["admin", "supervisor"]:
        raise HTTPException(status_code=403, detail="Not authorized to update grievances")
    
    grievance = db.query(models.Grievance).filter(models.Grievance.id == grievance_id).first()
    if not grievance:
        raise HTTPException(status_code=404, detail="Grievance not found")
    
    update_data = grievance_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(grievance, field, value)
    
    db.add(grievance)
    db.commit()
    db.refresh(grievance)
    return grievance
