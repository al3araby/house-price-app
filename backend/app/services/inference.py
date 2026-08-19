import joblib
import pandas as pd
from typing import Optional
from app.services.preprocessing import request_to_dataframe
from app.schemas.prediction import PredictionRequest, PredictionResponse


class ModelService:
    def __init__(self, model_path: str):
        self.model_path = model_path
        self._model: Optional[object] = None
        self._is_loaded = False

    def load(self) -> None:
        """Load the model pipeline from disk."""
        self._model = joblib.load(self.model_path)
        self._is_loaded = True

    def is_loaded(self) -> bool:
        return self._is_loaded

    def predict(self, request: PredictionRequest) -> PredictionResponse:
        """Make a prediction using the loaded pipeline."""
        if not self._is_loaded:
            raise RuntimeError("Model not loaded. Call load() first.")

        # Convert request to DataFrame
        df = request_to_dataframe(request)

        # Predict (pipeline handles preprocessing)
        prediction = self._model.predict(df)[0]

        return PredictionResponse(predicted_price=float(prediction))


# Global instance
_model_service: Optional[ModelService] = None


def get_model_service() -> ModelService:
    global _model_service
    if _model_service is None:
        from app.core.config import settings
        _model_service = ModelService(settings.MODEL_PATH)
    return _model_service