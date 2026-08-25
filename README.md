<div align="center">

# 🌿 Smart Agri — See. Predict. Grow.

### AI-Powered Plant Disease Detection, Crop Yield Prediction & Fertilizer Optimization

[![Python](https://img.shields.io/badge/Python-3.x-blue?style=for-the-badge&logo=python)](https://www.python.org/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)](https://www.tensorflow.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](#-license)

*An end-to-end precision agriculture platform combining computer vision, machine learning, fertilizer optimization, and explainable AI — now with a modern React frontend and a high-performance FastAPI backend.*

[⚙️ Local Setup](#️-local-setup) • [🛠️ Tech Stack](#️-technology-stack) • [📁 Project Structure](#-project-structure) • [🚀 Running the App](#-running-the-app)

</div>

---

## 📖 Overview

**Smart Agri** empowers farmers, researchers, and agricultural professionals with a single platform to:

- 🔬 **Detect plant diseases** from leaf images using a CNN model (93.55% accuracy, 72 disease classes)
- 🌾 **Predict crop yield** using environmental, soil, and agricultural factors (Random Forest / XGBoost ensemble)
- 🧪 **Optimize fertilizer ratios** (NPK) to maximize yield for a given crop and region
- 📊 **Understand model predictions** through SHAP explainability visualizations

The platform was originally built on Streamlit and has been **fully migrated** to a professional, high-performance **React 19 + Vite 8 frontend** backed by a **FastAPI** integration layer — with zero changes to the trained ML models.

---

## 🎯 Project Highlights

| | |
|---|---|
| ✅ **Plant Disease Detection** | CNN (MobileNetV2-based) — 93.55% validation accuracy |
| ✅ **Crop Yield Prediction** | Ensemble ML models (Random Forest, XGBoost) |
| ✅ **Fertilizer Optimization** | NPK-based recommendation engine via brute-force grid search |
| ✅ **Explainable AI** | SHAP-driven global feature importance (bar + beeswarm plots) |
| ✅ **72 Disease Classes** | Spanning 20+ crop types |
| ✅ **116,147 Training Images** | Sourced from the PlantVillage dataset |
| ✅ **React + FastAPI Frontend** | Migrated from Streamlit to a SPA with a REST API layer |
| ✅ **Tailwind CSS v4 UI** | Custom brand design system with Inter + Playfair Display fonts |

---

## 📌 Features

| Module | Route | Functionality | Description |
|---|---|---|---|
| 🔬 **Disease Detection** | `/disease` | CNN Classification | Upload a leaf image — get disease name, plant, confidence %, and top-3 predictions |
| 🌾 **Yield Prediction** | `/yield` | ML Ensemble | Predict crop yield (hg/ha & tonnes/ha) from climate, soil, and region inputs |
| 🧪 **Fertilizer Optimizer** | `/fertilizer` | NPK Recommendation | Get optimal N, P, K values and delta vs. current — plus a yield impact analysis |
| 📊 **SHAP Insights** | `/insights` | Explainable AI | View global feature importance (bar plot) and feature direction (beeswarm plot) |

---

## 🏗️ Architecture

### New Architecture (React + FastAPI)

```text
                        Browser (localhost:5173)
                               │
                    ┌──────────▼──────────┐
                    │   React 19 + Vite   │  ← SPA Frontend
                    │   Tailwind CSS v4   │
                    │   React Router v7   │
                    └──────────┬──────────┘
                               │ Axios (HTTP)
                               ▼
                    ┌──────────────────────┐
                    │  FastAPI (port 8000) │  ← REST API Layer
                    │  Uvicorn + CORS      │
                    └───┬──────┬──────┬───┘
                        │      │      │
              ┌─────────┘  ┌───┘  ┌───┘
              ▼            ▼      ▼
         TensorFlow    Scikit   src/optimizer.py
         CNN Model     Learn    (NPK grid search)
         (H5 file)    (Pickle)
```

### API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `GET` | `/api/metadata` | Returns available crops and regions for dropdowns |
| `POST` | `/api/disease/predict` | Accepts `multipart/form-data` image → returns prediction JSON |
| `POST` | `/api/yield/predict` | Accepts JSON body → returns `predicted_yield_hg_ha` + `tonnes_ha` |
| `POST` | `/api/fertilizer/optimize` | Accepts crop/area/NPK → returns optimal NPK + yield impact |
| `GET` | `/api/shap/insights` | Returns SHAP plot images as base64-encoded PNG strings |

---

## 🤖 Models

| Model | File | Purpose | Performance |
|---|---|---|---|
| **CNN (MobileNetV2-based)** | `models/cnn_disease_model.h5` | Plant Disease Detection | **93.55% Accuracy** |
| **Random Forest / XGBoost Ensemble** | `models/best_model.pkl` | Crop Yield Prediction | Evaluated via R² Score |
| **StandardScaler** | `models/scaler.pkl` | Feature normalization for yield model | — |
| **LabelEncoder (area)** | `models/le_area.pkl` | Encodes region string for yield model | — |
| **LabelEncoder (crop)** | `models/le_item.pkl` | Encodes crop string for yield model | — |
| **Feature Columns** | `models/feature_cols.pkl` | Ordered feature list for model input | — |
| **Class Names** | `models/class_names.pkl` | Maps CNN output index → disease class name | — |

---

## 🔬 Plant Disease Detection

### Dataset
- **Source:** PlantVillage Dataset
- **Images:** 116,147
- **Disease Classes:** 72
- **Crop Types:** 20+

### Training Strategy

**Phase 1 — Transfer Learning**
- Frozen MobileNetV2 base
- Custom classification head
- 20 epochs

**Phase 2 — Fine-Tuning**
- Unfrozen upper MobileNetV2 layers
- Reduced learning rate
- 10 additional epochs

### Results

| Phase | Epochs | Validation Accuracy |
|---|---|---|
| Head Training | 20 | 89.81% |
| Fine-Tuning | 10 | **93.55%** |

---

## 🌱 Supported Crops

<div align="center">

Apple • Bell Pepper • Blueberry • Cassava • Cherry • Coffee • Corn • Grape • Orange • Peach • Potato • Raspberry • Rice • Rose • Soybean • Squash • Strawberry • Sugarcane • Tomato • Watermelon

</div>

---

## 🛠️ Technology Stack

<div align="center">

| Category | Tools |
|---|---|
| **Frontend** | React 19, Vite 8, React Router v7, Tailwind CSS v4, Axios, Lucide React |
| **Fonts / Design** | Inter (UI text), Playfair Display (headings), custom `brand` color palette |
| **Backend API** | FastAPI, Uvicorn, Python-Multipart, Pydantic |
| **Deep Learning** | TensorFlow, Keras, MobileNetV2 |
| **Machine Learning** | Scikit-Learn, XGBoost |
| **Explainable AI** | SHAP |
| **Data Processing** | Pandas, NumPy, Pillow |
| **Legacy Frontend** | Streamlit (still present in `app.py`) |

</div>

---

## 📁 Project Structure

```text
precision-agriculture/
│
├── app.py                        # Legacy Streamlit app (retained for reference)
├── main.py                       # ML pipeline entry point (yield training)
├── requirements.txt              # Root Python dependencies
│
├── backend/                      # FastAPI REST API
│   ├── main.py                   # All API routes + model loading
│   └── requirements.txt          # Backend-specific dependencies
│
├── frontend/                     # React + Vite SPA
│   ├── index.html                # Entry HTML (title: "Smart Agri | See. Predict. Grow.")
│   ├── vite.config.js            # Vite config
│   ├── tailwind.config.js        # Tailwind v4 color tokens (brand palette)
│   ├── postcss.config.js         # PostCSS with @tailwindcss/postcss
│   ├── package.json
│   └── src/
│       ├── main.jsx              # React entry point
│       ├── App.jsx               # Router + page layout
│       ├── api.js                # Axios API client (base: http://localhost:8000)
│       ├── index.css             # Global styles, @theme tokens, Google Fonts
│       └── components/
│           ├── Navbar.jsx        # Sticky nav with "Smart Agri" brand + mobile menu
│           ├── Home.jsx          # Landing page with feature cards
│           ├── DiseaseDetection.jsx  # Image upload + CNN inference results
│           ├── YieldPrediction.jsx   # Multi-input form + yield output card
│           ├── FertilizerOptimizer.jsx # NPK form + delta + yield impact panel
│           └── ShapInsights.jsx  # SHAP bar + beeswarm plot viewer
│
├── models/                       # Pre-trained model artifacts (frozen)
│   ├── cnn_disease_model.h5
│   ├── best_model.pkl
│   ├── class_names.pkl
│   ├── scaler.pkl
│   ├── le_area.pkl
│   ├── le_item.pkl
│   └── feature_cols.pkl
│
├── src/                          # Core ML source modules
│   ├── cnn_model.py
│   ├── train_cnn.py
│   ├── image_preprocess.py
│   ├── split_dataset.py
│   ├── preprocess.py
│   ├── feature_eng.py
│   ├── train.py
│   ├── evaluate.py
│   ├── explainability.py
│   └── optimizer.py             # NPK grid-search optimizer (used by FastAPI)
│
├── data/
└── notebooks/
    ├── 01_eda_yield.ipynb
    ├── 02_eda_soil.ipynb
    └── 03_fusion_check.ipynb
```

---

## ⚙️ Local Setup

### Prerequisites

- Python 3.9+ with pip
- Node.js 18+ with npm
- A virtual environment (recommended)

### 1. Clone the Repository

```bash
git clone https://github.com/NareshParab/Agriculture_AI_Assistance.git
cd precision-agriculture
```

### 2. Set Up Python Environment

```bash
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
pip install -r backend/requirements.txt
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

### 4. Place Model Files

Ensure the following files exist in `models/`:

```text
models/
├── cnn_disease_model.h5     ← TensorFlow CNN for disease detection
├── best_model.pkl           ← Sklearn/XGBoost yield model
├── class_names.pkl
├── scaler.pkl
├── le_area.pkl
├── le_item.pkl
└── feature_cols.pkl
```

---

## 🚀 Running the App

You need **two terminals** running simultaneously:

### Terminal 1 — Start the FastAPI Backend

```bash
# From the project root
.venv\Scripts\uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

Backend will be available at: **http://localhost:8000**  
Interactive API docs: **http://localhost:8000/docs**

### Terminal 2 — Start the React Frontend

```bash
cd frontend
npm run dev
```

Frontend will be available at: **http://localhost:5173**

> ⚠️ **Both servers must be running** for features to work. The frontend calls the backend at `http://localhost:8000`. If the backend is down, all prediction pages will show a connection error.

---

## 🧪 Run the ML Training Pipeline

| Task | Command |
|---|---|
| Full Yield Prediction Pipeline | `python main.py` |
| CNN Training (disease model) | `python src/train_cnn.py` |
| Generate SHAP Insights | Included in `python main.py` → outputs to `plots/` |
| Legacy Streamlit App | `streamlit run app.py` |

---

## 🎨 UI & Design Notes

The frontend was built with **Tailwind CSS v4**, which uses a CSS-first configuration approach. Custom brand colors are defined in `src/index.css` using the `@theme {}` block (not in `tailwind.config.js`, which is a v3 pattern):

```css
/* src/index.css */
@theme {
  --color-brand-500: #22c55e;
  --color-brand-600: #16a34a;
  --color-brand-700: #15803d;
  /* ...etc */
}
```

**Typography:**
- UI text: **Inter** (Google Fonts)
- Hero headings: **Playfair Display** (Google Fonts)
- Base font size: `17px` (slightly larger than browser default for readability)

**Brand Palette:**

| Token | Hex | Usage |
|---|---|---|
| `brand-50` | `#f0fdf4` | Icon backgrounds, hover fills |
| `brand-500` | `#22c55e` | Active nav indicator, progress bars |
| `brand-600` | `#16a34a` | Primary buttons, icons |
| `brand-700` | `#15803d` | Button hover states |

---

## 📊 Explainable AI (SHAP)

To generate SHAP plots, run the full ML pipeline:

```bash
python main.py
```

This creates:
- `plots/shap_bar.png` — Global feature importance (mean |SHAP|)
- `plots/shap_beeswarm.png` — Feature impact direction per sample

These are served by the FastAPI `/api/shap/insights` endpoint as base64-encoded images and displayed in the **Insights** tab of the React app.

---

## 🌍 Real-World Impact

This project demonstrates practical applications of AI in agriculture by integrating:

- 🖼️ Computer Vision (CNN disease detection)
- 📈 Predictive Analytics (yield forecasting)
- 🔍 Explainable AI (SHAP insights)
- 🧭 Decision Support (NPK optimizer)
- 🌐 Modern Web Engineering (React SPA + REST API)

The platform assists farmers and agricultural stakeholders in improving crop monitoring, disease management, and yield optimization — turning raw sensor and environmental data into actionable farming decisions.

---

## ⭐ Support

If you found this project useful, consider giving the repository a ⭐ on GitHub — it helps others discover the project and motivates further development!

<div align="center">

**Made with 🌿 for smarter, data-driven farming**

*Smart Agri — See. Predict. Grow.*

</div>
