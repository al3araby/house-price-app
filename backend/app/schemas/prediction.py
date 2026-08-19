from pydantic import BaseModel, Field
from typing import Literal


class PredictionRequest(BaseModel):
    location: str = Field(..., description="Location of the property")
    carpet_area_sqft: float = Field(..., gt=0, description="Carpet area in square feet")
    floor_num: int = Field(..., ge=0, description="Floor number (0 for ground floor)")
    bathroom: int = Field(..., ge=1, description="Number of bathrooms")
    balcony: int = Field(..., ge=0, description="Number of balconies")
    furnishing: Literal["Furnished", "Semi-Furnished", "Unfurnished"]
    transaction: Literal["New Property", "Resale", "Other", "Rent/Lease"]
    ownership: Literal["Freehold", "Co-operative Society", "Power Of Attorney", "Leasehold"]
    facing: Literal["East", "West", "North", "South", "North - East", "North - West", "South - East", "South -West"]


class PredictionResponse(BaseModel):
    predicted_price: float = Field(..., description="Predicted price in Indian Rupees (INR)")


class HealthResponse(BaseModel):
    status: str = "ok"