import base64
import os

from ..core.config import PLOTS_DIR


SHAP_PLOTS = {
    "bar_plot": "shap_bar.png",
    "beeswarm_plot": "shap_beeswarm.png",
    "dependence_plot": "shap_dependence.png",
}


def get_shap_plot_images() -> dict:
    response = {}

    for key, filename in SHAP_PLOTS.items():
        path = os.path.join(PLOTS_DIR, filename)
        if os.path.exists(path):
            with open(path, "rb") as file:
                encoded = base64.b64encode(file.read()).decode()
                response[key] = f"data:image/png;base64,{encoded}"

    return response
