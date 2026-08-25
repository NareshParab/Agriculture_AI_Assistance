import sys
import os
import io
import base64
import pickle
import urllib.request
from contextlib import asynccontextmanager

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import pandas as pd
import tensorflow as tf
from PIL import Image

# ── Paths ─────────────────────────────────────────────────────
BASE_DIR   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")
SOIL_CSV   = os.path.join(BASE_DIR, "data", "processed", "cleaned_soil.csv")

# ── Model globals (None until loaded at startup) ───────────────
yield_model = scaler = feat_cols = le_area = le_item = None
cnn_model   = None
class_names = []

# ── Hugging Face model source ──────────────────────────────────
HF_REPO_ID = os.getenv("HF_REPO_ID", "naresh3/smart-agri-models")
HF_BASE    = f"https://huggingface.co/{HF_REPO_ID}/resolve/main"

MODEL_FILES = [
    "best_model.pkl",
    "cnn_disease_model.h5",
    "class_names.pkl",
    "scaler.pkl",
    "le_area.pkl",
    "le_item.pkl",
    "feature_cols.pkl",
]

def ensure_models_downloaded():
    """Download any missing model files from Hugging Face."""
    os.makedirs(MODELS_DIR, exist_ok=True)
    for filename in MODEL_FILES:
        dest = os.path.join(MODELS_DIR, filename)
        if os.path.exists(dest):
            size_mb = os.path.getsize(dest) / (1024 * 1024)
            print(f"✅ {filename} already present ({size_mb:.1f} MB).")
            continue
        url = f"{HF_BASE}/{filename}"
        print(f"⬇️  Downloading {filename} from HuggingFace...")
        try:
            urllib.request.urlretrieve(url, dest)
            size_mb = os.path.getsize(dest) / (1024 * 1024)
            print(f"✅ {filename} saved ({size_mb:.1f} MB)")
        except Exception as e:
            print(f"❌ Failed to download {filename}: {e}")

def load_models():
    """Load all ML models into global variables."""
    global yield_model, scaler, feat_cols, le_area, le_item, cnn_model, class_names
    try:
        yield_model = pickle.load(open(os.path.join(MODELS_DIR, "best_model.pkl"), "rb"))
        scaler      = pickle.load(open(os.path.join(MODELS_DIR, "scaler.pkl"),     "rb"))
        feat_cols   = pickle.load(open(os.path.join(MODELS_DIR, "feature_cols.pkl"), "rb"))
        le_area     = pickle.load(open(os.path.join(MODELS_DIR, "le_area.pkl"),    "rb"))
        le_item     = pickle.load(open(os.path.join(MODELS_DIR, "le_item.pkl"),    "rb"))
        cnn_model   = tf.keras.models.load_model(
                          os.path.join(MODELS_DIR, "cnn_disease_model.h5"))
        with open(os.path.join(MODELS_DIR, "class_names.pkl"), "rb") as f:
            class_names = pickle.load(f)
        print("🎉 All models loaded successfully.")
    except Exception as e:
        print(f"⚠️  Error loading models: {e}")

@asynccontextmanager
async def lifespan(app):
    """Download + load models on startup."""
    ensure_models_downloaded()
    load_models()
    yield  # server runs here


# ── App ────────────────────────────────────────────────────────
app = FastAPI(title="Smart Agri API", lifespan=lifespan)

# Allow all Vercel deployments (production + preview) and localhost.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Load soil reference data ───────────────────────────────────
try:
    _soil_df = pd.read_csv(SOIL_CSV)
    _soil_ranges = (
        _soil_df.groupby("Item")
        .agg(N_min=("N", "min"), N_max=("N", "max"),
             P_min=("P", "min"), P_max=("P", "max"),
             K_min=("K", "min"), K_max=("K", "max"))
        .to_dict(orient="index")
    )
    SOIL_CROPS = sorted(_soil_df["Item"].unique().tolist())
except Exception as e:
    print(f"Error loading soil data: {e}")
    _soil_ranges = {}
    SOIL_CROPS   = []


# ── Request / response models ──────────────────────────────────

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


# ── Helpers ────────────────────────────────────────────────────

def _nutrient_status(current: float, lo: float, hi: float) -> dict:
    """Return status, delta, and an action sentence for one nutrient."""
    if current < lo:
        delta = round(lo - current, 2)
        return {
            "status": "LOW",
            "delta" : delta,
            "action": f"Increase by at least {delta} to reach the minimum recommended range.",
        }
    elif current > hi:
        delta = round(current - hi, 2)
        return {
            "status": "HIGH",
            "delta" : -delta,
            "action": f"Reduce by at least {delta} to reach the maximum recommended range.",
        }
    else:
        return {
            "status": "GOOD",
            "delta" : 0,
            "action": "Within the recommended range. No change needed.",
        }


# ── Endpoints ──────────────────────────────────────────────────

@app.get("/health")
def health_check():
    return {
        "status"     : "healthy",
        "cnn_loaded" : cnn_model is not None,
        "yield_loaded": yield_model is not None,
    }


# ── Disease detection ──────────────────────────────────────────
@app.post("/api/disease/predict")
async def predict_disease(file: UploadFile = File(...)):
    if cnn_model is None:
        raise HTTPException(status_code=503,
            detail="Disease model not loaded yet. Please wait and retry.")
    if file.content_type not in ["image/jpeg", "image/png", "image/jpg"]:
        raise HTTPException(status_code=400, detail="Invalid file type")

    contents  = await file.read()
    image     = Image.open(io.BytesIO(contents)).convert("RGB")
    img       = image.resize((224, 224))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    preds    = cnn_model.predict(img_array)
    top3_idx = np.argsort(preds[0])[::-1][:3]

    top_class = class_names[top3_idx[0]]
    top_conf  = float(preds[0][top3_idx[0]] * 100)

    parts   = top_class.split("___")
    plant   = parts[0].replace("_", " ")
    disease = parts[1].replace("_", " ") if len(parts) > 1 else "Unknown"

    top3_predictions = []
    for idx in top3_idx:
        name = class_names[idx].replace("___", " -> ").replace("_", " ")
        conf = float(preds[0][idx] * 100)
        top3_predictions.append({"name": name, "confidence": conf})

    return {
        "plant"     : plant,
        "disease"   : disease,
        "is_healthy": "healthy" in disease.lower(),
        "confidence": top_conf,
        "top3"      : top3_predictions,
    }


# ── Yield prediction ───────────────────────────────────────────
@app.post("/api/yield/predict")
def predict_yield(req: YieldPredictionRequest):
    if yield_model is None:
        raise HTTPException(status_code=503,
            detail="Yield model not loaded yet. Please wait and retry.")

    npk_ratio      = req.N / (req.P + req.K + 1)
    soil_fertility = 0.4 * req.N + 0.3 * req.P + 0.3 * req.K
    climate_index  = req.rainfall * 0.5 + (30 - abs(req.temp - 25)) * 0.3 + req.humidity * 0.2
    ph_dev         = abs(req.ph - 7.0)
    decade         = (req.year // 10) * 10

    try:
        area_enc = le_area.transform([req.area])[0]
        item_enc = le_item.transform([req.crop])[0]
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid crop or area")

    row = [[req.year, req.rainfall, req.pesticides, req.temp,
            req.N, req.P, req.K, req.ph, req.humidity,
            npk_ratio, soil_fertility,
            climate_index, ph_dev, decade,
            area_enc, item_enc]]

    row_scaled = scaler.transform(row)
    prediction = yield_model.predict(row_scaled)[0]

    return {
        "predicted_yield_hg_ha"    : float(prediction),
        "predicted_yield_tonnes_ha": float(prediction / 10000),
    }


# ── Fertilizer recommendation ──────────────────────────────────
@app.get("/api/fertilizer/crops")
def get_fertilizer_crops():
    return {"crops": SOIL_CROPS}


@app.post("/api/fertilizer/recommend")
def recommend_fertilizer(req: FertilizerRequest):
    crop = req.crop.strip()
    if crop not in _soil_ranges:
        raise HTTPException(
            status_code=404,
            detail=f"Crop '{crop}' not found. Available: {', '.join(SOIL_CROPS)}",
        )

    ranges = _soil_ranges[crop]
    n_info = _nutrient_status(req.N, ranges["N_min"], ranges["N_max"])
    p_info = _nutrient_status(req.P, ranges["P_min"], ranges["P_max"])
    k_info = _nutrient_status(req.K, ranges["K_min"], ranges["K_max"])

    return {
        "crop": crop,
        "N": {"current": round(req.N, 2), "range_min": round(ranges["N_min"], 2),
              "range_max": round(ranges["N_max"], 2), **n_info},
        "P": {"current": round(req.P, 2), "range_min": round(ranges["P_min"], 2),
              "range_max": round(ranges["P_max"], 2), **p_info},
        "K": {"current": round(req.K, 2), "range_min": round(ranges["K_min"], 2),
              "range_max": round(ranges["K_max"], 2), **k_info},
    }


# ── SHAP insights ──────────────────────────────────────────────
@app.get("/api/shap/insights")
def get_shap_insights():
    bar_path      = os.path.join(BASE_DIR, "plots", "shap_bar.png")
    beeswarm_path = os.path.join(BASE_DIR, "plots", "shap_beeswarm.png")

    response = {}
    for key, path in [("bar_plot", bar_path), ("beeswarm_plot", beeswarm_path)]:
        if os.path.exists(path):
            with open(path, "rb") as f:
                response[key] = f"data:image/png;base64,{base64.b64encode(f.read()).decode()}"
    return response


# ── Metadata ───────────────────────────────────────────────────
@app.get("/api/metadata")
def get_metadata():
    if le_item is None or le_area is None:
        raise HTTPException(status_code=503, detail="Models not loaded yet.")
    return {
        "crops": list(le_item.classes_),
        "areas": list(le_area.classes_),
    }
