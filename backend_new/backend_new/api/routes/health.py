from fastapi import APIRouter

from ...core.model_registry import registry


router = APIRouter()


@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "cnn_loaded": registry.cnn_model is not None,
        "yield_loaded": registry.yield_model is not None,
    }
