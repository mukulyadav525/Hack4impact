from sqlalchemy.orm import Session
from app.models.core import Employee
from app.services.attendance import AttendanceService
from fastapi import HTTPException
import base64

class FaceVerificationService:
    @staticmethod
    def verify_and_checkin(
        db: Session, 
        govt_id: str, 
        selfie_base64: str, 
        lat: float, 
        lon: float
    ):
        # 1. Find employee
        employee = db.query(Employee).filter(Employee.govt_id == govt_id).first()
        if not employee:
            raise HTTPException(status_code=404, detail="Employee not found")
            
        # 2. Geo-fence validation (Reuse AttendanceService logic)
        if not AttendanceService.is_within_zone(db, employee.id, lat, lon):
            raise HTTPException(
                status_code=400, 
                detail="Location verification failed: You are outside your assigned zone."
            )
            
        # 3. AI Face Matching & Liveness (Stubbed for MVP setup)
        # In a real scenario, we'd send selfie_base64 to GPT-4o Vision or Rekognition
        # and compare it with employee.face_embedding_hash.
        
        # Mocking success
        is_face_match = True 
        is_live = True
        
        if not is_face_match or not is_live:
            raise HTTPException(status_code=401, detail="Biometric verification failed")
            
        # 4. Mark Attendance
        attendance = AttendanceService.mark_attendance(db, employee.id, lat, lon, "present")
        
        return employee, attendance
