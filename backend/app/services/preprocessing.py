import pandas as pd
from typing import List
from app.schemas.prediction import PredictionRequest


# Allowed locations (loaded from locations.json at startup)
ALLOWED_LOCATIONS: List[str] = []


def load_allowed_locations(path: str) -> List[str]:
    """Load allowed locations from JSON file."""
    import json
    with open(path, 'r') as f:
        return json.load(f)


def request_to_dataframe(request: PredictionRequest) -> pd.DataFrame:
    """
    Convert a PredictionRequest to a one-row DataFrame with exact column names
    used during training.
    """
    # Map unknown locations to 'other'
    location = request.location if request.location in ALLOWED_LOCATIONS else "other"

    data = {
        "carpet_area_sqft": [request.carpet_area_sqft],
        "floor_num": [request.floor_num],
        "bathroom_num": [request.bathroom],
        "balcony_num": [request.balcony],
        "car_parking_num": [0],  # Not in request schema, default to 0
        "location_grouped": [location],
        "Furnishing": [request.furnishing],
        "Transaction": [request.transaction],
        "Ownership": [request.ownership],
        "society_grouped": ["other"],  # Not in request schema, default to 'other'
    }

    # Column order must match training
    columns = [
        "carpet_area_sqft", "floor_num", "bathroom_num", "balcony_num", "car_parking_num",
        "location_grouped", "Furnishing", "Transaction", "Ownership", "society_grouped"
    ]

    return pd.DataFrame(data, columns=columns)