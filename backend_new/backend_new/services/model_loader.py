import os
import pickle
import urllib.request

import tensorflow as tf

from ..core.config import HF_BASE, MODEL_FILES, MODELS_DIR
from ..core.model_registry import registry


def ensure_models_downloaded() -> None:
    os.makedirs(MODELS_DIR, exist_ok=True)

    for filename in MODEL_FILES:
        destination = os.path.join(MODELS_DIR, filename)
        if os.path.exists(destination):
            size_mb = os.path.getsize(destination) / (1024 * 1024)
            print(f"{filename} already present ({size_mb:.1f} MB).")
            continue

        url = f"{HF_BASE}/{filename}"
        print(f"Downloading {filename} from Hugging Face...")
        try:
            urllib.request.urlretrieve(url, destination)
            size_mb = os.path.getsize(destination) / (1024 * 1024)
            print(f"{filename} saved ({size_mb:.1f} MB).")
        except Exception as exc:
            print(f"Failed to download {filename}: {exc}")


def _load_pickle(filename: str):
    with open(os.path.join(MODELS_DIR, filename), "rb") as file:
        return pickle.load(file)


def load_models() -> None:
    try:
        registry.yield_model = _load_pickle("best_model.pkl")
        registry.scaler = _load_pickle("scaler.pkl")
        registry.feat_cols = _load_pickle("feature_cols.pkl")
        registry.le_area = _load_pickle("le_area.pkl")
        registry.le_item = _load_pickle("le_item.pkl")
        registry.cnn_model = tf.keras.models.load_model(
            os.path.join(MODELS_DIR, "cnn_disease_model.h5")
        )
        registry.class_names = _load_pickle("class_names.pkl")
        print("All models loaded successfully.")
    except Exception as exc:
        print(f"Error loading models: {exc}")
