import pandas as pd

from ..core.config import SOIL_CSV


def _load_soil_ranges() -> tuple[dict, list[str]]:
    try:
        soil_df = pd.read_csv(SOIL_CSV)
        soil_ranges = (
            soil_df.groupby("Item")
            .agg(
                N_min=("N", "min"),
                N_max=("N", "max"),
                P_min=("P", "min"),
                P_max=("P", "max"),
                K_min=("K", "min"),
                K_max=("K", "max"),
            )
            .to_dict(orient="index")
        )
        soil_crops = sorted(soil_df["Item"].unique().tolist())
        return soil_ranges, soil_crops
    except Exception as exc:
        print(f"Error loading soil data: {exc}")
        return {}, []


SOIL_RANGES, SOIL_CROPS = _load_soil_ranges()
