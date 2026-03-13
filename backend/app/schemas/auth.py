from pydantic import BaseModel, Field
from uuid import UUID
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: Optional[str] = None

class Login(BaseModel):
    govt_id: str
    pin: str

class BiometricLogin(BaseModel):
    govt_id: str
    selfie_base64: str
    latitude: float
    longitude: float
