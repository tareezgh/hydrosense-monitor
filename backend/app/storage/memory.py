from collections import defaultdict
from typing import Dict, List

from app.models.sensor_model import SensorRequest, AlertResponse, Classification

# In-memory store: unitId -> list of alerts
_alerts: Dict[str, List[AlertResponse]] = defaultdict(list)


def store_reading(
    unit_id: str, payload: SensorRequest, classification: Classification
):
    alert = AlertResponse(
        timestamp=payload.timestamp,
        readings=payload.readings,
        classification=classification,
    )
    _alerts[unit_id].insert(0, alert)


def get_alerts(unit_id: str, limit: int = 20) -> List[AlertResponse]:
    alerts = _alerts.get(unit_id, [])
    return alerts[:limit]

