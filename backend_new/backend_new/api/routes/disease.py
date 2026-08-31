from fastapi import APIRouter, File, UploadFile

from ...services.disease import predict_disease_from_upload


router = APIRouter(prefix="/api/disease", tags=["disease"])


@router.post("/predict")
async def predict_disease(file: UploadFile = File(...)):
    return await predict_disease_from_upload(file)
