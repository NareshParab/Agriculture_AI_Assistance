from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.routes import disease, fertilizer, health, metadata, shap, yield_prediction
from .services.model_loader import ensure_models_downloaded, load_models


@asynccontextmanager
async def lifespan(app: FastAPI):
    ensure_models_downloaded()
    load_models()
    yield


def create_app() -> FastAPI:
    app = FastAPI(title="Smart Agri API", lifespan=lifespan)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173", "http://localhost:3000"],
        allow_origin_regex=r"https://.*\.vercel\.app",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health.router)
    app.include_router(disease.router)
    app.include_router(yield_prediction.router)
    app.include_router(fertilizer.router)
    app.include_router(shap.router)
    app.include_router(metadata.router)

    return app


app = create_app()
