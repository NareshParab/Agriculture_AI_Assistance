import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import numpy as np
import pandas as pd
import tensorflow as tf
from PIL import Image
import io
import base64

from src.optimizer import recommend_fertilizer

app = FastAPI(title="Precision Agriculture API")

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load global models
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, 'models')

try:
    yield_model = pickle.load(open(os.path.join(MODELS_DIR, 'best_model.pkl'), 'rb'))
    scaler = pickle.load(open(os.path.join(MODELS_DIR, 'scaler.pkl'), 'rb'))
    feat_cols = pickle.load(open(os.path.join(MODELS_DIR, 'feature_cols.pkl'), 'rb'))
    le_area = pickle.load(open(os.path.join(MODELS_DIR, 'le_area.pkl'), 'rb'))
    le_item = pickle.load(open(os.path.join(MODELS_DIR, 'le_item.pkl'), 'rb'))

    cnn_model = tf.keras.models.load_model(os.path.join(MODELS_DIR, "cnn_disease_model.h5"))
    with open(os.path.join(MODELS_DIR, "class_names.pkl"), "rb") as f:
        class_names = pickle.load(f)
except Exception as e:
    print(f"Error loading models: {e}")

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

class OptimizerRequest(BaseModel):
    crop: str
    area: str
    N: float
    P: float
    K: float
    rainfall: float = 1000.0
    temp: float = 25.0
    pesticides: float = 10.0
    ph: float = 6.5
    humidity: float = 70.0

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/api/disease/predict")
async def predict_disease(file: UploadFile = File(...)):
    if file.content_type not in ["image/jpeg", "image/png", "image/jpg"]:
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    
    # Preprocessing as per app.py
    img = image.resize((224, 224))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    preds = cnn_model.predict(img_array)
    top3_idx = np.argsort(preds[0])[::-1][:3]
    
    top_class = class_names[top3_idx[0]]
    top_conf = float(preds[0][top3_idx[0]] * 100)

    parts = top_class.split("___")
    plant = parts[0].replace("_", " ")
    disease = parts[1].replace("_", " ") if len(parts) > 1 else "Unknown"

    top3_predictions = []
    for idx in top3_idx:
        name = class_names[idx].replace("___", " -> ").replace("_", " ")
        conf = float(preds[0][idx] * 100)
        top3_predictions.append({"name": name, "confidence": conf})

    return {
        "plant": plant,
        "disease": disease,
        "is_healthy": "healthy" in disease.lower(),
        "confidence": top_conf,
        "top3": top3_predictions
    }

@app.post("/api/yield/predict")
def predict_yield(req: YieldPredictionRequest):
    # Same calculation as app.py
    npk_ratio = req.N / (req.P + req.K + 1)
    soil_fertility = 0.4*req.N + 0.3*req.P + 0.3*req.K
    climate_index = req.rainfall*0.5 + (30 - abs(req.temp-25))*0.3 + req.humidity*0.2
    ph_dev = abs(req.ph - 7.0)
    decade = (req.year // 10) * 10
    
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
            
    # Need dataframe to silence warnings? Let's just use array as in app.py
    row_scaled = scaler.transform(row)
    prediction = yield_model.predict(row_scaled)[0]
    
    return {
        "predicted_yield_hg_ha": float(prediction),
        "predicted_yield_tonnes_ha": float(prediction / 10000)
    }

@app.post("/api/fertilizer/optimize")
def optimize_fertilizer(req: OptimizerRequest):
    result = recommend_fertilizer(
        yield_model, scaler, feat_cols, req.crop, req.area,
        req.N, req.P, req.K, req.rainfall, req.temp, req.pesticides, req.ph, req.humidity
    )
    return result

@app.get("/api/shap/insights")
def get_shap_insights():
    bar_path = os.path.join(BASE_DIR, "plots", "shap_bar.png")
    beeswarm_path = os.path.join(BASE_DIR, "plots", "shap_beeswarm.png")
    
    response = {}
    
    if os.path.exists(bar_path):
        with open(bar_path, "rb") as f:
            encoded = base64.b64encode(f.read()).decode('utf-8')
            response["bar_plot"] = f"data:image/png;base64,{encoded}"
            
    if os.path.exists(beeswarm_path):
        with open(beeswarm_path, "rb") as f:
            encoded = base64.b64encode(f.read()).decode('utf-8')
            response["beeswarm_plot"] = f"data:image/png;base64,{encoded}"
            
    return response

@app.get("/api/metadata")
def get_metadata():
    return {
        "crops": list(le_item.classes_),
        "areas": list(le_area.classes_)
    }
