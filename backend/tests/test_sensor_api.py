from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# -------------------------------
# 1. Payload Validation Tests
# -------------------------------
def test_missing_readings():
    response = client.post("/api/sensor", json={
        "unitId": "unit-123",
        "timestamp": "2025-05-26T12:00:00Z"
    })
    assert response.status_code == 422

def test_missing_unit_id():
    response = client.post("/api/sensor", json={
        "timestamp": "2025-05-26T12:00:00Z",
        "readings": {
            "pH": 7.0,
            "temp": 22.0,
            "ec": 1.2
        }
    })
    assert response.status_code == 422


def test_invalid_timestamp_format():
    response = client.post("/api/sensor", json={
        "unitId": "unit-timestamp",
        "timestamp": "not-a-date",
        "readings": {
            "pH": 7.0,
            "temp": 20.0,
            "ec": 1.0
        }
    })
    assert response.status_code == 422
    
def test_invalid_ph_range():
    # pH is out of valid range (e.g., < 0 or > 14)
    response = client.post("/api/sensor", json={
        "unitId": "unit-123",
        "timestamp": "2025-05-26T12:00:00Z",
        "readings": {
            "pH": 15.0,
            "temp": 22.0,
            "ec": 1.2
        }
    })
    assert response.status_code == 422


# -------------------------------
# 2. Classification Logic
# -------------------------------
def test_classification_healthy():
    response = client.post("/api/sensor", json={
        "unitId": "unit-healthy",
        "timestamp": "2025-05-26T12:10:00Z",
        "readings": {
            "pH": 7.0,
            "temp": 22.0,
            "ec": 1.2
        }
    })
    assert response.status_code == 200
    assert response.json()["classification"] == "Healthy"

def test_classification_needs_attention():
    response = client.post("/api/sensor", json={
        "unitId": "unit-alert",
        "timestamp": "2025-05-26T12:11:00Z",
        "readings": {
            "pH": 2.0,
            "temp": 10.0,
            "ec": 0.1
        }
    })
    assert response.status_code == 200
    assert response.json()["classification"] == "Needs Attention"

# -------------------------------
# 3. Storage and Retrieval of Alerts
# -------------------------------
def test_get_alerts_empty_unit():
    response = client.get("/api/alerts?unitId=unit-does-not-exist")
    assert response.status_code == 200
    assert response.json() == []


def test_alert_storage_and_retrieval():
    unit_id = "unit-storage-test"

    # Send two readings pre check: one healthy, one needs attention
    client.post("/api/sensor", json={
        "unitId": unit_id,
        "timestamp": "2025-05-26T12:15:00Z",
        "readings": {
            "pH": 7.0,
            "temp": 22.0,
            "ec": 1.5
        }
    })

    client.post("/api/sensor", json={
        "unitId": unit_id,
        "timestamp": "2025-05-26T12:16:00Z",
        "readings": {
            "pH": 2.0,
            "temp": 10.0,
            "ec": 0.5
        }
    })

    response = client.get(f"/api/alerts?unitId={unit_id}")
    assert response.status_code == 200
    alerts = response.json()

    assert isinstance(alerts, list)
    assert len(alerts) >= 2
    assert alerts[0]["classification"] in ["Healthy", "Needs Attention"]
    assert "timestamp" in alerts[0]
    assert "readings" in alerts[0]

# -------------------------------
# 4. Beyond the Basics
# -------------------------------

def test_malformed_json_readings_field():
    # "readings"" is provided as a string instead of an object
    response = client.post("/api/sensor", json={
        "unitId": "unit-malformed",
        "timestamp": "2025-05-26T12:20:00Z",
        "readings": "not-a-dict"
    })
    assert response.status_code == 422
