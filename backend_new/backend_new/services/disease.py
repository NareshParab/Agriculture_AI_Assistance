import io

import numpy as np
from fastapi import HTTPException, UploadFile
from PIL import Image

from ..core.model_registry import registry


ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/jpg"}


async def predict_disease_from_upload(file: UploadFile) -> dict:
    if registry.cnn_model is None:
        raise HTTPException(
            status_code=503,
            detail="Disease model not loaded yet. Please wait and retry.",
        )

    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Invalid file type")

    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    image_array = np.array(image.resize((224, 224))) / 255.0
    image_array = np.expand_dims(image_array, axis=0)

    predictions = registry.cnn_model.predict(image_array)
    top3_indexes = np.argsort(predictions[0])[::-1][:3]

    top_class = registry.class_names[top3_indexes[0]]
    top_confidence = float(predictions[0][top3_indexes[0]] * 100)

    parts = top_class.split("___")
    plant = parts[0].replace("_", " ")
    disease = parts[1].replace("_", " ") if len(parts) > 1 else "Unknown"

    top3_predictions = []
    for index in top3_indexes:
        name = registry.class_names[index].replace("___", " -> ").replace("_", " ")
        confidence = float(predictions[0][index] * 100)
        top3_predictions.append({"name": name, "confidence": confidence})

    return {
        "plant": plant,
        "disease": disease,
        "is_healthy": "healthy" in disease.lower(),
        "confidence": top_confidence,
        "top3": top3_predictions,
    }
