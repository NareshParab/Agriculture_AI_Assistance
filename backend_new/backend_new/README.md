# Modular Backend

This folder contains the cleaned, modular FastAPI backend.

## Structure

```text
backend_new/
  main.py                  # ASGI entrypoint: backend_new.main:app
  app.py                   # FastAPI app creation, CORS, router registration
  schemas.py               # Pydantic request models
  core/
    config.py              # Paths, Hugging Face settings, model filenames
    model_registry.py      # Shared loaded model state
  services/
    model_loader.py        # Download and load ML artifacts
    disease.py             # Disease prediction logic
    yield_prediction.py    # Yield prediction logic
    fertilizer.py          # Fertilizer recommendation logic
    soil_data.py           # Soil CSV loading and ranges
    shap_insights.py       # SHAP image encoding
  api/routes/
    health.py
    disease.py
    yield_prediction.py
    fertilizer.py
    shap.py
    metadata.py
```

## Run

From the repository root:

```powershell
pip install -r backend_new/requirements.txt
uvicorn backend_new.main:app --reload
```

The API will be available at `http://localhost:8000`.

## Runtime files

The backend expects these folders at the repository root:

```text
data/processed/cleaned_soil.csv
models/
```

Missing model files are downloaded automatically from the Hugging Face repo configured by `HF_REPO_ID`.
