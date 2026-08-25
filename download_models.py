"""
download_models.py  –  run once before starting the server on Render.
Downloads model files from a remote source if they are missing locally.

Usage (Render build command):
    python download_models.py && uvicorn backend.main:app --host 0.0.0.0 --port $PORT

Set the following environment variable in the Render dashboard:
    MODEL_BASE_URL  –  base URL where the model files are hosted
                       e.g. https://drive.google.com/... or an S3 pre-signed URL
"""

import os
import sys
import urllib.request

# ──────────────────────────────────────────────────────────────────
# Configure: set MODEL_BASE_URL in the Render environment variables.
# Each file must be directly downloadable from:
#   {MODEL_BASE_URL}/{filename}
# ──────────────────────────────────────────────────────────────────
MODEL_BASE_URL = os.getenv("MODEL_BASE_URL", "").rstrip("/")

MODELS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")

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
    if not MODEL_BASE_URL:
        print("⚠️  MODEL_BASE_URL is not set. Skipping model download.")
        print("   Set it in the Render dashboard → Environment → Variables.")
        return

    os.makedirs(MODELS_DIR, exist_ok=True)

    for filename in MODEL_FILES:
        dest = os.path.join(MODELS_DIR, filename)
        if os.path.exists(dest):
            print(f"✅  {filename} already present — skipping download.")
            continue

        url = f"{MODEL_BASE_URL}/{filename}"
        print(f"⬇️   Downloading {filename} from {url} …")
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
