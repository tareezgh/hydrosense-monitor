from enum import Enum

class Classification(str, Enum):
    HEALTHY = "Healthy"
    NEEDS_ATTENTION = "Needs Attention"
