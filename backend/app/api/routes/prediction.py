from fastapi import APIRouter, Depends, HTTPException
from app.schemas.prediction import PredictionRequest, PredictionResponse, HealthResponse
from app.services.inference import get_model_service, ModelService
from app.services.preprocessing import load_allowed_locations
from app.core.config import settings

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """Health check endpoint."""
    return HealthResponse(status="ok")


@router.post("/predict", response_model=PredictionResponse)
async def predict(
    request: PredictionRequest,
    model_service: ModelService = Depends(get_model_service),
) -> PredictionResponse:
    """
    Predict house price based on property features.
    """
    try:
        return model_service.predict(request)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@router.get("/locations")
async def get_locations() -> list[str]:
    """Get list of allowed locations for the frontend dropdown."""
    return load_allowed_locations(settings.LOCATIONS_PATH)