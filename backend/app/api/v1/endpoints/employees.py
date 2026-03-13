from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any, List
from app import models, schemas
from app.core.database import get_db
from app.api import deps

router = APIRouter()

@router.get("/", response_model=List[schemas.auth.Employee])
def read_employees(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.core.Employee = Depends(deps.check_admin)
) -> Any:
    """
    Retrieve employees. Only allowed for admin users.
    """
    employees = db.query(models.core.Employee).offset(skip).limit(limit).all()
    return employees

@router.patch("/{employee_id}", response_model=schemas.auth.Employee)
def update_employee(
    *,
    db: Session = Depends(get_db),
    employee_id: str,
    employee_in: dict,
    current_user: models.core.Employee = Depends(deps.check_admin)
) -> Any:
    """
    Update an employee. Only allowed for admin users.
    """
    employee = db.query(models.core.Employee).filter(models.core.Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
        
    for field, value in employee_in.items():
        if hasattr(employee, field):
            setattr(employee, field, value)
            
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee
