from fastapi import FastAPI, Depends
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.utils.logging_config import setup_logging
from app.services.inference import ModelService, get_model_service
from app.services.preprocessing import load_allowed_locations, ALLOWED_LOCATIONS
from app.api.routes import prediction


@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logging()
    # Load model
    model_service = get_model_service()
    model_service.load()
    app.state.model_service = model_service

    # Load allowed locations
    global ALLOWED_LOCATIONS
    ALLOWED_LOCATIONS.extend(load_allowed_locations(settings.LOCATIONS_PATH))
    print(f"Model loaded from {settings.MODEL_PATH}")
    print(f"Loaded {len(ALLOWED_LOCATIONS)} locations")

    yield

    print("Shutting down...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prediction.router, prefix=settings.API_V1_STR)


@app.get("/")
async def root():
    return {"message": settings.PROJECT_NAME, "docs": "/docs"}