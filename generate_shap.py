#!/usr/bin/env python3
"""
generate_shap.py — Standalone, read-only SHAP plot regeneration.

Reproduces the exact feature preparation needed for SHAP inline,
without importing or calling engineer_features() (which has file-writing
side effects). Loads models/best_model.pkl read-only, then calls the
existing run_shap_analysis().

Usage (run from project root):
    python generate_shap.py
    # or explicitly via the venv:
    .venv\\Scripts\\python generate_shap.py   (Windows)
    .venv/bin/python generate_shap.py        (Linux/macOS)

Files that MAY be created or modified:
    plots/shap_bar.png
    plots/shap_beeswarm.png
    plots/shap_dependence.png
    plots/shap_force_plot.png

Files that are NEVER modified:
    models/  (all files — loaded read-only only)
    src/     (all source files — run_shap_analysis imported, never modified)
    backend/ (untouched)
    data/    (untouched)
"""

import os
import sys
import logging
import pickle

# ── Logging ────────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  [%(levelname)-8s]  %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger(__name__)

# ── Anchor all paths to the project root ──────────────────────────────────────
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

# ── Paths ──────────────────────────────────────────────────────────────────────
MODEL_PATH = os.path.join(PROJECT_ROOT, "models", "best_model.pkl")
DATA_PATH  = os.path.join(PROJECT_ROOT, "data", "processed", "fused_dataset.csv")
PLOTS_DIR  = os.path.join(PROJECT_ROOT, "plots")

EXPECTED_PLOTS = [
    "shap_bar.png",
    "shap_beeswarm.png",
    "shap_dependence.png",
    "shap_force_plot.png",
]

# ── Feature column order — must match training exactly ────────────────────────
FEATURE_COLS = [
    "Year", "rainfall", "pesticides", "avg_temp",
    "N", "P", "K", "ph", "soil_humidity",
    "npk_ratio", "soil_fertility_score",
    "climate_index", "ph_deviation", "decade",
    "Area_enc", "Item_enc",
]


# ── Step helpers ───────────────────────────────────────────────────────────────

def _check_required_files() -> None:
    """Fail early with a clear message if any required file is missing."""
    missing = [p for p in (MODEL_PATH, DATA_PATH) if not os.path.exists(p)]
    if missing:
        log.error("Cannot continue — required files not found:")
        for p in missing:
            log.error("  ✗  %s", p)
        sys.exit(1)
    log.info("Required files found:")
    log.info("  ✔  %s  (%.1f MB)", MODEL_PATH,
             os.path.getsize(MODEL_PATH) / (1_024 * 1_024))
    log.info("  ✔  %s", DATA_PATH)


def _load_model():
    """Load best_model.pkl read-only. Never overwrites the file."""
    log.info("Loading frozen model (read-only): %s", MODEL_PATH)
    try:
        with open(MODEL_PATH, "rb") as fh:
            model = pickle.load(fh)
        log.info("Model loaded → %s", type(model).__name__)
        return model
    except Exception as exc:
        log.error("Failed to load model: %s", exc)
        sys.exit(1)


def _prepare_features():
    """
    Reproduce the exact feature preparation from feature_eng.py inline,
    without importing that module and without saving anything to disk.

    Applies:
      • Same engineered features (npk_ratio, soil_fertility_score, etc.)
      • Same LabelEncoder fitting on Area and Item (in-memory only)
      • Same feature column order (FEATURE_COLS)
      • Same 80/20 train_test_split with random_state=42
      • No StandardScaler — tree models don't need scaling for SHAP,
        and unscaled values make SHAP plots more interpretable.

    Returns:
        X_train (DataFrame), X_test (DataFrame), FEATURE_COLS (list[str])
    """
    import pandas as pd
    from sklearn.preprocessing import LabelEncoder
    from sklearn.model_selection import train_test_split

    log.info("Loading dataset: %s", DATA_PATH)
    try:
        df = pd.read_csv(DATA_PATH)
    except Exception as exc:
        log.error("Failed to read CSV: %s", exc)
        sys.exit(1)

    log.info("Dataset shape: %s", df.shape)

    # ── Engineered features (identical logic to feature_eng.py) ──────────────
    df["npk_ratio"]           = df["N"] / (df["P"] + df["K"] + 1)
    df["soil_fertility_score"] = 0.4 * df["N"] + 0.3 * df["P"] + 0.3 * df["K"]
    df["climate_index"]       = (
        df["rainfall"] * 0.5
        + (30 - abs(df["avg_temp"] - 25)) * 0.3
        + df["soil_humidity"] * 0.2
    )
    df["ph_deviation"]        = abs(df["ph"] - 7.0)
    df["decade"]              = (df["Year"] // 10) * 10

    # ── Encode categoricals in-memory (no pickle.dump anywhere) ──────────────
    le_area = LabelEncoder()
    le_item = LabelEncoder()
    df["Area_enc"] = le_area.fit_transform(df["Area"])
    df["Item_enc"] = le_item.fit_transform(df["Item"])
    log.info("Label encoders fitted in-memory (not saved to disk).")

    # ── Build feature matrix ──────────────────────────────────────────────────
    X = df[FEATURE_COLS].fillna(df[FEATURE_COLS].median())
    y = df["yield"]

    # ── Exact same split as training ──────────────────────────────────────────
    X_train, X_test, _, _ = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    log.info(
        "Feature data ready — train: %s, test: %s, features: %d",
        X_train.shape, X_test.shape, len(FEATURE_COLS),
    )
    return X_train, X_test, FEATURE_COLS


def _run_shap(model, X_train, X_test, feature_cols) -> None:
    """
    Call the existing run_shap_analysis() from src/explainability.py.
    That function saves to relative paths ('plots/...'), so we chdir to
    PROJECT_ROOT first to guarantee the output lands in the right place.
    The source file src/explainability.py is never modified.
    """
    log.info("Running SHAP analysis — this may take a minute ...")

    # run_shap_analysis writes to 'plots/' using a relative path
    os.chdir(PROJECT_ROOT)

    try:
        from src.explainability import run_shap_analysis   # imported, not modified
        run_shap_analysis(model, X_train, X_test, feature_cols)
        log.info("run_shap_analysis() completed.")
    except Exception as exc:
        log.error("run_shap_analysis() failed: %s", exc)
        import traceback
        traceback.print_exc()
        sys.exit(1)


def _report_outputs() -> None:
    """Log each expected output file with its on-disk size."""
    log.info("─" * 58)
    log.info("SHAP output files:")
    all_ok = True
    for fname in EXPECTED_PLOTS:
        fpath = os.path.join(PLOTS_DIR, fname)
        if os.path.exists(fpath):
            log.info("  ✅  %-36s  %.1f KB", fname,
                     os.path.getsize(fpath) / 1_024)
        else:
            log.warning("  ⚠️   %-36s  NOT generated", fname)
            all_ok = False
    log.info("─" * 58)
    if all_ok:
        log.info("All plots saved to: %s", PLOTS_DIR)
    else:
        log.warning("Some plots missing — check the logs above for errors.")


# ── Entry point ────────────────────────────────────────────────────────────────

def main() -> None:
    log.info("=" * 58)
    log.info("  generate_shap.py  —  read-only SHAP regeneration")
    log.info("=" * 58)

    _check_required_files()

    os.makedirs(PLOTS_DIR, exist_ok=True)
    log.info("Output directory ready: %s", PLOTS_DIR)

    model                       = _load_model()
    X_train, X_test, feat_cols  = _prepare_features()
    _run_shap(model, X_train, X_test, feat_cols)
    _report_outputs()

    log.info("Done. ✔")


if __name__ == "__main__":
    main()
