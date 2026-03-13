from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import Any
from app import models, schemas
from app.core import security
from app.core.config import settings
from app.core.database import get_db

from app.api import deps

router = APIRouter()

@router.get("/me", response_model=schemas.auth.Employee)
def read_users_me(
    current_user: models.core.Employee = Depends(deps.get_current_user),
) -> Any:
    """
    Get current user.
    """
    return current_user

@router.post("/login", response_model=schemas.auth.Token)
def login_access_token(
    db: Session = Depends(get_db),
    login_data: schemas.auth.Login = None
):
    """
    OAuth2 compatible token login, retrieve an access token for future requests.
    Using govt_id and PIN as per requirements.
    """
    user = db.query(models.core.Employee).filter(models.core.Employee.govt_id == login_data.govt_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect Govt ID or PIN",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user",
        )

    # Check lockout
    now = security.get_now()
    if user.lockout_until and user.lockout_until > now:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Account locked. Try again after {user.lockout_until}",
        )

    if not security.verify_password(login_data.pin, user.pin_hash):
        user.failed_login_attempts += 1
        if user.failed_login_attempts >= 5:
            user.lockout_until = now + timedelta(minutes=30)
            db.commit()
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Too many failed attempts. Account locked for 30 minutes.",
            )
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect Govt ID or PIN",
        )
    
    # Success: Reset attempts
    user.failed_login_attempts = 0
    user.lockout_until = None
    db.commit()
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }
from app.services.face_verification import FaceVerificationService

@router.post("/biometric-checkin", response_model=schemas.auth.Token)
def biometric_checkin(
    db: Session = Depends(get_db),
    login_data: schemas.auth.BiometricLogin = None
):
    """
    Biometric check-in: verifies face match and location, then issues a token.
    """
    user, attendance = FaceVerificationService.verify_and_checkin(
        db,
        govt_id=login_data.govt_id,
        selfie_base64=login_data.selfie_base64,
        lat=login_data.latitude,
        lon=login_data.longitude
    )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }
