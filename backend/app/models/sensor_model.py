from pydantic import BaseModel, Field
from datetime import datetime
from .classification import Classification

class Reading(BaseModel):
    pH: float = Field(..., ge=0, le=14)
    temp: float
    ec: float

class SensorRequest(BaseModel):
    unitId: str
    timestamp: datetime
    readings: Reading

class SensorResponse(BaseModel):
    status: str
    classification: Classification

class AlertResponse(BaseModel):
    timestamp: datetime
    classification: Classification
    readings: Reading
