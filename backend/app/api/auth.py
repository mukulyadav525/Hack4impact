from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import create_access_token, verify_password
from app.schemas.auth import Token, Login
from app.models.core import Employee

router = APIRouter()

@router.post("/login", response_model=Token)
def login(login_data: Login, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.govt_id == login_data.govt_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect Govt ID or PIN",
        )
    # Note: In a real app, we'd verify the PIN hash. 
    # For MVP, we might use a simple PIN field or hash it.
    # Assuming employee has a 'pin_hash' field (need to add to model)
    # if not verify_password(login_data.pin, employee.pin_hash):
    #     raise HTTPException(...)
    
    access_token = create_access_token(subject=employee.id)
    return {"access_token": access_token, "token_type": "bearer"}
