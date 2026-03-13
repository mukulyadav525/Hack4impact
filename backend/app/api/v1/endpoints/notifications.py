from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from typing import List, Any
from uuid import UUID

from app import models, schemas
from app.api import deps
from app.core.database import get_db

router = APIRouter()

@router.get("/me", response_model=List[schemas.notification.Notification])
def get_my_notifications(
    db: Session = Depends(get_db),
    current_user: models.core.Employee = Depends(deps.get_current_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve current user's notifications.
    """
    notifications = (
        db.query(models.core.Notification)
        .filter(models.core.Notification.employee_id == current_user.id)
        .order_by(models.core.Notification.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return notifications

@router.post("/{notification_id}/read", response_model=schemas.notification.Notification)
def mark_as_read(
    notification_id: UUID,
    db: Session = Depends(get_db),
    current_user: models.core.Employee = Depends(deps.get_current_user),
) -> Any:
    """
    Mark a notification as read.
    """
    notification = db.query(models.core.Notification).filter(
        models.core.Notification.id == notification_id,
        models.core.Notification.employee_id == current_user.id
    ).first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
        
    notification.read = True
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification

@router.post("/read-all")
def mark_all_as_read(
    db: Session = Depends(get_db),
    current_user: models.core.Employee = Depends(deps.get_current_user),
):
    """
    Mark all notifications as read for current user.
    """
    db.query(models.core.Notification).filter(
        models.core.Notification.employee_id == current_user.id,
        models.core.Notification.read == False
    ).update({"read": True}, synchronize_session=False)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
