from pydantic import BaseModel


class YieldPredictionRequest(BaseModel):
    crop: str
    area: str
    year: int
    rainfall: float
    temp: float
    N: float
    P: float
    K: float
    ph: float
    humidity: float
    pesticides: float


class FertilizerRequest(BaseModel):
    crop: str
    N: float
    P: float
    K: float
