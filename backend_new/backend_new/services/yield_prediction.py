from fastapi import HTTPException

from ..core.model_registry import registry
from ..schemas import YieldPredictionRequest


def predict_yield_for_request(req: YieldPredictionRequest) -> dict:
    if registry.yield_model is None:
        raise HTTPException(
            status_code=503,
            detail="Yield model not loaded yet. Please wait and retry.",
        )

    npk_ratio = req.N / (req.P + req.K + 1)
    soil_fertility = 0.4 * req.N + 0.3 * req.P + 0.3 * req.K
    climate_index = req.rainfall * 0.5 + (30 - abs(req.temp - 25)) * 0.3 + req.humidity * 0.2
    ph_dev = abs(req.ph - 7.0)
    decade = (req.year // 10) * 10

    try:
        area_enc = registry.le_area.transform([req.area])[0]
        item_enc = registry.le_item.transform([req.crop])[0]
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid crop or area")

    row = [
        [
            req.year,
            req.rainfall,
            req.pesticides,
            req.temp,
            req.N,
            req.P,
            req.K,
            req.ph,
            req.humidity,
            npk_ratio,
            soil_fertility,
            climate_index,
            ph_dev,
            decade,
            area_enc,
            item_enc,
        ]
    ]

    row_scaled = registry.scaler.transform(row)
    prediction = registry.yield_model.predict(row_scaled)[0]

    return {
        "predicted_yield_hg_ha": float(prediction),
        "predicted_yield_tonnes_ha": float(prediction / 10000),
    }
