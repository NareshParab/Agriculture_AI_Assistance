from fastapi import APIRouter, HTTPException

from ...core.model_registry import registry


router = APIRouter(prefix="/api", tags=["metadata"])


@router.get("/metadata")
def get_metadata():
    if registry.le_item is None or registry.le_area is None:
        raise HTTPException(status_code=503, detail="Models not loaded yet.")

    return {
        "crops": list(registry.le_item.classes_),
        "areas": list(registry.le_area.classes_),
    }
