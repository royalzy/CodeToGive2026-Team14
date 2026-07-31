from app.data.impact_rules import IMPACT_RULES
from app.schemas.donation import (
    ContributionImpact,
    CountedImpact,
    FlexibleImpact,
    ImpactPreviewRequest,
    ImpactPreviewResponse,
)


def calculate_impact(request: ImpactPreviewRequest) -> ImpactPreviewResponse:
    rule = IMPACT_RULES[request.cause_id]

    if rule.unit_cost_hkd is None:
        return FlexibleImpact(
            cause_id=request.cause_id,
            amount_hkd=request.amount_hkd,
            copy_key=rule.copy_key,
        )

    estimated_units = request.amount_hkd // rule.unit_cost_hkd
    if estimated_units < 1:
        return ContributionImpact(
            cause_id=request.cause_id,
            amount_hkd=request.amount_hkd,
            copy_key=rule.copy_key,
            unit_key=rule.unit_key,
        )

    return CountedImpact(
        cause_id=request.cause_id,
        amount_hkd=request.amount_hkd,
        copy_key=rule.copy_key,
        estimated_units=estimated_units,
        unit_key=rule.unit_key,
    )
