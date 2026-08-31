from fastapi import HTTPException

from ..schemas import FertilizerRequest
from .soil_data import SOIL_CROPS, SOIL_RANGES


def _nutrient_status(current: float, lower_bound: float, upper_bound: float) -> dict:
    if current < lower_bound:
        delta = round(lower_bound - current, 2)
        return {
            "status": "LOW",
            "delta": delta,
            "action": f"Increase by at least {delta} to reach the minimum recommended range.",
        }

    if current > upper_bound:
        delta = round(current - upper_bound, 2)
        return {
            "status": "HIGH",
            "delta": -delta,
            "action": f"Reduce by at least {delta} to reach the maximum recommended range.",
        }

    return {
        "status": "GOOD",
        "delta": 0,
        "action": "Within the recommended range. No change needed.",
    }


def recommend_fertilizer_for_request(req: FertilizerRequest) -> dict:
    crop = req.crop.strip()
    if crop not in SOIL_RANGES:
        raise HTTPException(
            status_code=404,
            detail=f"Crop '{crop}' not found. Available: {', '.join(SOIL_CROPS)}",
        )

    ranges = SOIL_RANGES[crop]
    n_info = _nutrient_status(req.N, ranges["N_min"], ranges["N_max"])
    p_info = _nutrient_status(req.P, ranges["P_min"], ranges["P_max"])
    k_info = _nutrient_status(req.K, ranges["K_min"], ranges["K_max"])

    return {
        "crop": crop,
        "N": {
            "current": round(req.N, 2),
            "range_min": round(ranges["N_min"], 2),
            "range_max": round(ranges["N_max"], 2),
            **n_info,
        },
        "P": {
            "current": round(req.P, 2),
            "range_min": round(ranges["P_min"], 2),
            "range_max": round(ranges["P_max"], 2),
            **p_info,
        },
        "K": {
            "current": round(req.K, 2),
            "range_min": round(ranges["K_min"], 2),
            "range_max": round(ranges["K_max"], 2),
            **k_info,
        },
    }
