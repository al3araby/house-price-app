import pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c


def test_health(client):
    """Test health endpoint returns ok."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_predict_happy_path(client):
    """Test prediction with valid input."""
    payload = {
        "location": "bangalore",
        "carpet_area_sqft": 1000,
        "floor_num": 5,
        "bathroom": 2,
        "balcony": 1,
        "furnishing": "Semi-Furnished",
        "transaction": "Resale",
        "ownership": "Freehold",
        "facing": "East"
    }
    response = client.post("/api/v1/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "predicted_price" in data
    assert isinstance(data["predicted_price"], (int, float))
    assert data["predicted_price"] > 0


def test_predict_invalid_input(client):
    """Test prediction with invalid input returns 422."""
    payload = {
        "location": "bangalore",
        "carpet_area_sqft": -100,  # Invalid: must be > 0
        "floor_num": 5,
        "bathroom": 2,
        "balcony": 1,
        "furnishing": "Semi-Furnished",
        "transaction": "Resale",
        "ownership": "Freehold",
        "facing": "East"
    }
    response = client.post("/api/v1/predict", json=payload)
    assert response.status_code == 422


def test_predict_missing_field(client):
    """Test prediction with missing required field returns 422."""
    payload = {
        "location": "bangalore",
        "carpet_area_sqft": 1000,
        # Missing floor_num, bathroom, balcony, furnishing, transaction, ownership, facing
    }
    response = client.post("/api/v1/predict", json=payload)
    assert response.status_code == 422


def test_get_locations(client):
    """Test locations endpoint returns list."""
    response = client.get("/api/v1/locations")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "bangalore" in data