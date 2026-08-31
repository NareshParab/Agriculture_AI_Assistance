import os


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")
SOIL_CSV = os.path.join(BASE_DIR, "data", "processed", "cleaned_soil.csv")
PLOTS_DIR = os.path.join(BASE_DIR, "plots")

HF_REPO_ID = os.getenv("HF_REPO_ID", "naresh3/smart-agri-models")
HF_BASE = f"https://huggingface.co/{HF_REPO_ID}/resolve/main"

MODEL_FILES = [
    "best_model.pkl",
    "cnn_disease_model.h5",
    "class_names.pkl",
    "scaler.pkl",
    "le_area.pkl",
    "le_item.pkl",
    "feature_cols.pkl",
]
