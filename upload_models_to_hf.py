"""
upload_models_to_hf.py
Run this ONCE from your local machine to upload all model files to Hugging Face Hub.

Usage:
    python upload_models_to_hf.py
"""

from huggingface_hub import HfApi, create_repo

MODEL_FILES = [
    "models/best_model.pkl",
    "models/cnn_disease_model.h5",
    "models/class_names.pkl",
    "models/scaler.pkl",
    "models/le_area.pkl",
    "models/le_item.pkl",
    "models/feature_cols.pkl",
]

api = HfApi()

# Auto-detect your actual Hugging Face username
user_info = api.whoami()
hf_username = user_info["name"]
HF_REPO_ID  = f"{hf_username}/smart-agri-models"

print(f"👤 Logged in as: {hf_username}")
print(f"📦 Creating / verifying repo: {HF_REPO_ID}")
create_repo(HF_REPO_ID, repo_type="model", exist_ok=True, private=False)

for path in MODEL_FILES:
    filename = path.split("/")[-1]
    print(f"⬆️  Uploading {filename} ...")
    api.upload_file(
        path_or_fileobj=path,
        path_in_repo=filename,
        repo_id=HF_REPO_ID,
        repo_type="model",
    )
    print(f"✅  {filename} uploaded!")

print(f"\n🎉 All models uploaded!")
print(f"🔗 View at: https://huggingface.co/{HF_REPO_ID}")
print(f"\n📋 Set this in Render environment variables:")
print(f"   HF_REPO_ID = {HF_REPO_ID}")
