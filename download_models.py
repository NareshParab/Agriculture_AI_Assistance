"""
download_models.py  –  run during Render build to fetch model files from HF Hub.

Render Build Command:
    pip install -r backend/requirements.txt && python download_models.py

Render Environment Variable (set in dashboard):
    HF_REPO_ID  =  NareshParab/smart-agri-models
"""

import os
import sys
import urllib.request

HF_REPO_ID  = os.getenv("HF_REPO_ID", "naresh3/smart-agri-models")
BASE_URL    = f"https://huggingface.co/{HF_REPO_ID}/resolve/main"
MODELS_DIR  = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")

MODEL_FILES = [
    "cnn_disease_model.h5",
    "best_model.pkl",
    "class_names.pkl",
    "scaler.pkl",
    "le_area.pkl",
    "le_item.pkl",
    "feature_cols.pkl",
]


def download_models():
    os.makedirs(MODELS_DIR, exist_ok=True)

    for filename in MODEL_FILES:
        dest = os.path.join(MODELS_DIR, filename)
        if os.path.exists(dest):
            size_mb = os.path.getsize(dest) / (1024 * 1024)
            print(f"✅  {filename} already present ({size_mb:.1f} MB) — skipping.")
            continue

        url = f"{BASE_URL}/{filename}"
        print(f"⬇️   Downloading {filename} from HuggingFace...")
        try:
            urllib.request.urlretrieve(url, dest)
            size_mb = os.path.getsize(dest) / (1024 * 1024)
            print(f"✅  {filename} saved ({size_mb:.1f} MB)")
        except Exception as e:
            print(f"❌  Failed to download {filename}: {e}")
            sys.exit(1)

    print("\n🎉  All model files ready.\n")


if __name__ == "__main__":
    download_models()
