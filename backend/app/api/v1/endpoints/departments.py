from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api import deps
from app.models import core as models
from app.schemas import department as schemas

router = APIRouter()

@router.get("", response_model=List[schemas.Department])
def read_departments(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100
):
    departments = db.query(models.Department).offset(skip).limit(limit).all()
    return departments
