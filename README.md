<div align="center">

# 🌿 Precision Agriculture System

### AI-Powered Plant Disease Detection, Crop Yield Prediction & Fertilizer Optimization

[![Live Demo](https://img.shields.io/badge/🤗%20Hugging%20Face-Live%20Demo-yellow?style=for-the-badge)](https://sharmipandiyan-precision-agriculture.hf.space)
[![Python](https://img.shields.io/badge/Python-3.x-blue?style=for-the-badge&logo=python)](https://www.python.org/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)](https://www.tensorflow.org/)
[![Streamlit](https://img.shields.io/badge/Streamlit-FF4B4B?style=for-the-badge&logo=streamlit&logoColor=white)](https://streamlit.io/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](#-license)

*An end-to-end precision agriculture platform combining computer vision, machine learning, fertilizer optimization, and explainable AI to support data-driven farming decisions.*

[🌐 Live Demo](https://sharmipandiyan-precision-agriculture.hf.space) • [📂 Hugging Face Space](https://huggingface.co/spaces/SHARMIPANDIYAN/precision-agriculture) • [⚙️ Installation](#️-local-installation) • [🛠️ Tech Stack](#️-technology-stack)

</div>

---

## 📖 Overview

The **Precision Agriculture System** empowers farmers, researchers, and agricultural professionals with a single platform to:

- 🔬 **Detect plant diseases** from leaf images using deep learning
- 🌾 **Predict crop yield** using environmental and agricultural factors
- 🧪 **Generate fertilizer recommendations** tailored to crop and soil conditions
- 📊 **Understand model predictions** through explainable AI (SHAP) visualizations

No installation needed — the app is fully deployed and accessible from any browser.

---

## 🎯 Project Highlights

| | |
|---|---|
| ✅ **Plant Disease Detection** | MobileNetV2 — 93.55% validation accuracy |
| ✅ **Crop Yield Prediction** | Ensemble ML models (Random Forest, XGBoost) |
| ✅ **Fertilizer Optimization** | NPK-based recommendation engine |
| ✅ **Explainable AI** | SHAP-driven feature importance insights |
| ✅ **72 Disease Classes** | Spanning 20+ crop types |
| ✅ **116,147 Training Images** | Sourced from the PlantVillage dataset |
| ✅ **Fully Deployed** | Live and accessible on Hugging Face Spaces |

---

## 📌 Features

| Module | Functionality | Description |
|---|---|---|
| 🔬 **Disease Detection** | CNN Classification | Upload a leaf image and identify plant diseases with confidence scores |
| 🌾 **Yield Prediction** | ML Ensemble Models | Predict crop yield using agricultural, environmental, and production data |
| 🧪 **Fertilizer Optimizer** | NPK Recommendation | Generate optimal Nitrogen, Phosphorus, and Potassium recommendations |
| 📊 **SHAP Insights** | Explainable AI | Visualize feature importance and model decision-making |

---

## 🤖 Models Used

| Model | Purpose | Performance |
|---|---|---|
| **MobileNetV2** (Transfer Learning) | Plant Disease Detection | **93.55% Accuracy** |
| **Random Forest** | Crop Yield Prediction | Evaluated via R² Score |
| **XGBoost** | Crop Yield Prediction | Evaluated via R² Score |
| **SHAP** | Model Explainability | Feature Impact Analysis |

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
- Unfrozen upper layers
- Learning rate reduction
- 10 epochs

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

## 🧪 Fertilizer Optimization

The fertilizer recommendation engine analyzes agricultural inputs and suggests optimal **Nitrogen (N)**, **Phosphorus (P)**, and **Potassium (K)** levels to maximize crop productivity and improve yield outcomes.

---

## 📊 Explainable AI (SHAP)

To improve transparency and trust, SHAP visualizations are integrated throughout the system, allowing users to:

- Understand the key drivers behind each prediction
- Analyze feature importance across models
- Interpret crop yield predictions with confidence

This bridges the gap between AI predictions and real-world agricultural decision-making.

---

## ☁️ Deployment

The application is deployed using **Streamlit** on **Hugging Face Spaces**.

### Deployment Architecture

```text
                     User
                      │
                      ▼
            Streamlit Frontend
                      │
        ┌─────────────┼─────────────────┬───────────────────┐
        ▼             ▼                 ▼                    ▼
 Disease Detection  Yield Prediction  Fertilizer        SHAP
     (CNN)            (ML Models)     Optimization   Explainability
        │             │                 │                    │
        └─────────────┴─────────────────┴───────────────────┘
                      │
                      ▼
              Results Dashboard
```

---

## 🛠️ Technology Stack

<div align="center">

| Category | Tools |
|---|---|
| **Deep Learning** | TensorFlow • Keras • MobileNetV2 |
| **Machine Learning** | Scikit-Learn • XGBoost |
| **Explainable AI** | SHAP |
| **Web Application** | Streamlit |
| **Data Processing** | Pandas • NumPy |
| **Visualization** | Matplotlib • Seaborn |
| **Deployment** | Hugging Face Spaces |

</div>

---

## 📁 Project Structure

```text
precision-agriculture/
│
├── app.py
├── main.py
├── requirements.txt
│
├── models/
│   ├── cnn_disease_model.h5
│   ├── best_model.pkl
│   ├── class_names.pkl
│   ├── scaler.pkl
│   ├── le_area.pkl
│   ├── le_item.pkl
│   └── feature_cols.pkl
│
├── src/
│   ├── cnn_model.py
│   ├── train_cnn.py
│   ├── image_preprocess.py
│   ├── split_dataset.py
│   ├── preprocess.py
│   ├── feature_eng.py
│   ├── train.py
│   ├── evaluate.py
│   ├── explainability.py
│   └── optimizer.py
│
└── notebooks/
    ├── 01_eda_yield.ipynb
    ├── 02_eda_soil.ipynb
    └── 03_fusion_check.ipynb
```

---

## ⚙️ Local Installation

### 1. Clone the Repository

```bash
git clone https://github.com/SHARMI-P/precision-agriculture.git
cd precision-agriculture
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Download Model Files

Download the pretrained model files from:

🔗 [Google Drive — Model Files](https://drive.google.com/drive/folders/1EkbqMN-53W1_E4zp0aAV7ANKsgkOgLDG)

Place them inside the `models/` directory:

```text
models/
├── cnn_disease_model.h5
└── best_model.pkl
```

---

## ▶️ Run the Application

```bash
streamlit run app.py
```

---

## 🧪 Run the Full Pipeline

| Task | Command |
|---|---|
| Yield Prediction Pipeline | `python main.py` |
| CNN Training | `python src/train_cnn.py` |
| Launch Web Application | `streamlit run app.py` |

---

## 📸 Application Screenshots

| Disease Detection | Yield Prediction |
|---|---|
| _Add screenshot here_ | _Add screenshot here_ |

| Fertilizer Optimization | SHAP Insights |
|---|---|
| _Add screenshot here_ | _Add screenshot here_ |

---

## 🌍 Real-World Impact

This project demonstrates practical applications of AI in agriculture by integrating:

- 🖼️ Computer Vision
- 📈 Predictive Analytics
- 🔍 Explainable AI
- 🧭 Decision Support Systems

The platform assists farmers and agricultural stakeholders in improving crop monitoring, disease management, and yield optimization — turning raw data into actionable farming decisions.

---

## 👩‍💻 Author

**Sharmi P**
B.Tech Computer Science and Engineering
Indian Institute of Information Technology Dharwad

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/SHARMI-P)
[![Hugging Face](https://img.shields.io/badge/🤗%20Hugging%20Face-Space-yellow?style=for-the-badge)](https://huggingface.co/spaces/SHARMIPANDIYAN/precision-agriculture)

---

## ⭐ Support

If you found this project useful, consider giving the repository a ⭐ on GitHub — it helps others discover the project and motivates further development!

<div align="center">

**Made with 🌿 for smarter, data-driven farming**

</div>
