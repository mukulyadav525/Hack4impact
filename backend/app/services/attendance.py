from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.core import Attendance, Zone, Employee
from datetime import datetime
from decimal import Decimal
from geoalchemy2.shape import from_shape
from shapely.geometry import Point
from fastapi import HTTPException

class AttendanceService:
    @staticmethod
    def is_within_zone(db: Session, employee_id: str, lat: float, lon: float) -> bool:
        # Get employee's assigned zone
        employee = db.query(Employee).filter(Employee.id == employee_id).first()
        if not employee or not employee.zone_id:
            return False
            
        zone = db.query(Zone).filter(Zone.id == employee.zone_id).first()
        if not zone:
            return False
            
        if not zone.boundary:
            return True # Fallback for demo if boundary not set
            
        # Create a point and check if it's within the zone boundary
        point = f'POINT({lon} {lat})' # Longitude first for PostGIS
        is_within = db.query(func.ST_Within(
            func.ST_GeomFromText(point, 4324),
            zone.boundary
        )).scalar()
        
        return is_within if is_within is not None else True


    @staticmethod
    def mark_attendance(db: Session, employee_id: str, lat: float, lon: float, status: str):
        # 1. Verification of location
        if not AttendanceService.is_within_zone(db, employee_id, lat, lon):
            raise HTTPException(
                status_code=400,
                detail="Location verification failed: You are outside your assigned zone."
            )
        
        attendance = Attendance(
            employee_id=employee_id,
            checkin_time=datetime.now(),
            checkin_lat=Decimal(str(lat)),
            checkin_lon=Decimal(str(lon)),
            status=status
        )
        db.add(attendance)
        db.commit()
        db.refresh(attendance)

        # Trigger score re-calculation for the day
        from app.services.scoring import ScoringService
        ScoringService.calculate_daily_score(db, employee_id, datetime.now().date())

        return attendance

    @staticmethod
    def get_attendance_history(db: Session, employee_id: str):
        return db.query(Attendance).filter(Attendance.employee_id == employee_id).all()
