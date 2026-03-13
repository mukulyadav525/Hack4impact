from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError
from sqlalchemy.orm import Session
from app.models import core as models
from app.schemas.auth import TokenPayload
from app.core import security
from app.core.config import settings
from app.core.database import get_db
from typing import List

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)

def get_current_active_employee(
    db: Session = Depends(get_db), token: str = Depends(reusable_oauth2)
) -> models.Employee:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    user = db.query(models.Employee).filter(models.Employee.id == token_data.sub).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Aliases
get_current_user = get_current_active_employee

class RoleChecker:
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, user: models.Employee = Depends(get_current_active_employee)):
        if user.employee_type not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role {user.employee_type} is not authorized to access this resource"
            )
        return user

# Role-specific dependency shortcuts
check_supervisor = RoleChecker(["supervisor", "admin"])
check_admin = RoleChecker(["admin"])
check_citizen = RoleChecker(["public", "field_worker", "supervisor", "admin"]) 

