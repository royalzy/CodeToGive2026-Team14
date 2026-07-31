from collections.abc import Mapping
from dataclasses import dataclass
from types import MappingProxyType

from app.schemas.donation import CauseId


@dataclass(frozen=True)
class ImpactRule:
    cause_id: CauseId
    copy_key: str
    unit_cost_hkd: int | None
    unit_key: str | None

    def __post_init__(self) -> None:
        if (self.unit_cost_hkd is None) != (self.unit_key is None):
            raise ValueError("Unit cost and unit key must either both be set or both be absent.")
        if self.unit_cost_hkd is not None and self.unit_cost_hkd <= 0:
            raise ValueError("Unit cost must be greater than zero.")


CAUSE_ORDER: tuple[CauseId, ...] = (
    CauseId.WHERE_NEEDED_MOST,
    CauseId.DANCE,
    CauseId.SPORTS,
    CauseId.NUTRITION,
    CauseId.FAMILY_SUPPORT,
)

IMPACT_RULES: Mapping[CauseId, ImpactRule] = MappingProxyType(
    {
        CauseId.WHERE_NEEDED_MOST: ImpactRule(
            cause_id=CauseId.WHERE_NEEDED_MOST,
            copy_key="where_needed_most",
            unit_cost_hkd=None,
            unit_key=None,
        ),
        CauseId.DANCE: ImpactRule(
            cause_id=CauseId.DANCE,
            copy_key="dance",
            unit_cost_hkd=150,
            unit_key="dance_training_session",
        ),
        CauseId.SPORTS: ImpactRule(
            cause_id=CauseId.SPORTS,
            copy_key="sports",
            unit_cost_hkd=120,
            unit_key="supported_sports_session",
        ),
        CauseId.NUTRITION: ImpactRule(
            cause_id=CauseId.NUTRITION,
            copy_key="nutrition",
            unit_cost_hkd=300,
            unit_key="nutrition_consultation",
        ),
        CauseId.FAMILY_SUPPORT: ImpactRule(
            cause_id=CauseId.FAMILY_SUPPORT,
            copy_key="family_support",
            unit_cost_hkd=500,
            unit_key="family_support_opportunity",
        ),
    }
)
