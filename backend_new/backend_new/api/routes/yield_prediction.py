from fastapi import APIRouter

from ...schemas import YieldPredictionRequest
from ...services.yield_prediction import predict_yield_for_request


router = APIRouter(prefix="/api/yield", tags=["yield"])


@router.post("/predict")
def predict_yield(req: YieldPredictionRequest):
    return predict_yield_for_request(req)
