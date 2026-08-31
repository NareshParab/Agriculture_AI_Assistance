from fastapi import APIRouter

from ...services.shap_insights import get_shap_plot_images


router = APIRouter(prefix="/api/shap", tags=["shap"])


@router.get("/insights")
def get_shap_insights():
    return get_shap_plot_images()
