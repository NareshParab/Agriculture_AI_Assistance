"""
Quick smoke-test of the new _nutrient_status helper and soil range lookup
without starting FastAPI.  Run from project root.
"""
import pandas as pd
import os

SOIL_CSV = os.path.join("data", "processed", "cleaned_soil.csv")

_soil_df = pd.read_csv(SOIL_CSV)
_soil_ranges = (
    _soil_df.groupby("Item")
    .agg(N_min=("N","min"), N_max=("N","max"),
         P_min=("P","min"), P_max=("P","max"),
         K_min=("K","min"), K_max=("K","max"))
    .to_dict(orient="index")
)

def _nutrient_status(current, lo, hi):
    if current < lo:
        delta = round(lo - current, 2)
        return {"status":"LOW",  "delta": delta,
                "action": f"Increase by at least {delta} to reach the minimum recommended range."}
    elif current > hi:
        delta = round(current - hi, 2)
        return {"status":"HIGH", "delta": -delta,
                "action": f"Reduce by at least {delta} to reach the maximum recommended range."}
    else:
        return {"status":"GOOD", "delta": 0,
                "action": "Within the recommended range. No change needed."}

def recommend(crop, N, P, K):
    r = _soil_ranges[crop]
    print(f"\n{'='*55}")
    print(f"  Crop: {crop} | N={N}, P={P}, K={K}")
    print(f"  Dataset range:  N={r['N_min']}-{r['N_max']}, P={r['P_min']}-{r['P_max']}, K={r['K_min']}-{r['K_max']}")
    print(f"{'='*55}")
    for nutrient, val, lo, hi in [
        ("N", N, r["N_min"], r["N_max"]),
        ("P", P, r["P_min"], r["P_max"]),
        ("K", K, r["K_min"], r["K_max"]),
    ]:
        s = _nutrient_status(val, lo, hi)
        print(f"  {nutrient}: [{s['status']:4s}]  {s['action']}")

# ── TEST 1: All LOW ─────────────────────────────────
# Maize range from inspection: N=60-100, P=35-60, K=15-25
recommend("Maize", N=20, P=50, K=10)

# ── TEST 2: All GOOD ────────────────────────────────
recommend("Maize", N=80, P=50, K=20)

# ── TEST 3: All HIGH ────────────────────────────────
recommend("Maize", N=150, P=80, K=50)

# ── TEST 4: Mixed ───────────────────────────────────
# N=20 (LOW), P=50 (GOOD), K=10 (LOW)  — the example in the task spec
recommend("Maize", N=20, P=50, K=10)

# ── TEST 5: Another crop ────────────────────────────
recommend("Rice", N=50, P=40, K=30)
recommend("Cotton", N=120, P=50, K=10)
