from dataclasses import dataclass, field
from typing import Any


@dataclass
class ModelRegistry:
    yield_model: Any = None
    scaler: Any = None
    feat_cols: Any = None
    le_area: Any = None
    le_item: Any = None
    cnn_model: Any = None
    class_names: list[str] = field(default_factory=list)


registry = ModelRegistry()
