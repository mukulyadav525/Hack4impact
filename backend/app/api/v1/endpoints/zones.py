from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Any
from app import models, schemas
from app.api import deps
from app.core.database import get_db

router = APIRouter()

@router.get("", response_model=List[schemas.zone.Zone])
def read_zones(
    db: Session = Depends(get_db),
    current_user: models.core.Employee = Depends(deps.get_current_user)
) -> Any:
    """
    Retrieve all zones.
    """
    return db.query(models.core.Zone).all()
@router.post("", response_model=schemas.zone.Zone)
def create_zone(
    *,
    db: Session = Depends(get_db),
    zone_in: schemas.zone.ZoneCreate,
    current_user: models.core.Employee = Depends(deps.check_admin)
) -> Any:
    """
    Create a new zone (Admin only).
    """
    zone = models.core.Zone(
        name=zone_in.name,
        dept_id=zone_in.dept_id,
        city=zone_in.city,
        district=zone_in.district
    )
    db.add(zone)
    db.commit()
    db.refresh(zone)
    return zone
