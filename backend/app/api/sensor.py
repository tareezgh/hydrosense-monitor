from fastapi import APIRouter, Query
from app.models.sensor_model import (
    SensorRequest,
    SensorResponse,
    AlertResponse,
    Classification,
)
from app.storage.memory import store_reading, get_alerts

router = APIRouter()

@router.post("/api/sensor", response_model=SensorResponse)
def receive_sensor_data(payload: SensorRequest):
    # Rule-based classification
    pH = payload.readings.pH
    classification: Classification = (
        "Needs Attention" if pH < 5.5 or pH > 7.0 else "Healthy"
    )
    store_reading(payload.unitId, payload, classification)

    return {"status": "OK", "classification": classification}


@router.get("/api/alerts", response_model=list[AlertResponse])
def get_unit_alerts(unitId: str = Query(...)):
    return get_alerts(unitId)
