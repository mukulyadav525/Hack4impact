from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any, List
from app import models, schemas
from app.core.database import get_db
from app.api import deps

router = APIRouter()

@router.get("", response_model=List[schemas.auth.Employee])
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
@router.post("", response_model=schemas.auth.Employee, status_code=status.HTTP_201_CREATED)
def create_employee(
    *,
    db: Session = Depends(get_db),
    employee_in: schemas.employee.EmployeeCreate,
    current_user: models.core.Employee = Depends(deps.check_admin)
) -> Any:
    """
    Create new employee. Only allowed for admin users.
    """
    # Check if govt_id already exists
    employee = db.query(models.core.Employee).filter(
        models.core.Employee.govt_id == employee_in.govt_id
    ).first()
    if employee:
        raise HTTPException(
            status_code=400,
            detail="An employee with this Govt ID already exists in the system.",
        )
        
    hashed_pin = deps.security.get_password_hash(employee_in.pin)
    
    import uuid
    db_employee = models.core.Employee(
        id=uuid.uuid4(),
        govt_id=employee_in.govt_id,
        pin_hash=hashed_pin,
        name=employee_in.name,
        employee_type=employee_in.employee_type,
        job_role=employee_in.job_role,
        dept_id=employee_in.dept_id,
        zone_id=employee_in.zone_id,
        is_active=True
    )
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee


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
        if field == "pin" and value:
            employee.pin_hash = deps.security.get_password_hash(value)
        elif hasattr(employee, field):
            setattr(employee, field, value)
            
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee

@router.patch("/me", response_model=schemas.auth.Employee)
def update_current_user_profile(
    *,
    db: Session = Depends(get_db),
    employee_in: schemas.employee.EmployeeUpdate,
    current_user: models.core.Employee = Depends(deps.get_current_user)
) -> Any:
    """
    Update personal profile (Name or PIN).
    """
    if employee_in.name:
        current_user.name = employee_in.name
    if employee_in.pin:
        current_user.pin_hash = deps.security.get_password_hash(employee_in.pin)
        
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user
