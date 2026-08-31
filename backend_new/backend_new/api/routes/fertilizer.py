from fastapi import APIRouter

from ...schemas import FertilizerRequest
from ...services.fertilizer import recommend_fertilizer_for_request
from ...services.soil_data import SOIL_CROPS


router = APIRouter(prefix="/api/fertilizer", tags=["fertilizer"])


@router.get("/crops")
def get_fertilizer_crops():
    return {"crops": SOIL_CROPS}


@router.post("/recommend")
def recommend_fertilizer(req: FertilizerRequest):
    return recommend_fertilizer_for_request(req)
