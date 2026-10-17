from decimal import Decimal

from fastapi import APIRouter, Depends

from app.auth import verify_internal_key
from app.schemas import AuditItemResponse, AuditRequest, AuditResponse

router = APIRouter(
    prefix="/v1",
    tags=["audit"],
    dependencies=[Depends(verify_internal_key)],
)


@router.post("/audit", response_model=AuditResponse)
def create_audit(request: AuditRequest | None = None) -> AuditResponse:
    """Analyze a medical bill and return structured audit findings.

    Returns a fixed sample result highlighting possible overcharges.
    Raw bill text or files are never stored or logged.
    """
    sample_items = [
        AuditItemResponse(
            id="item_01",
            cpt_code="99285",
            description="Emergency Department Visit - High Severity",
            billed_amount=Decimal("950.00"),
            benchmark_amount=Decimal("450.00"),
            possible_overcharge=Decimal("500.00"),
            explanation=(
                "Billed amount exceeds estimated 80th percentile regional "
                "commercial benchmark for CPT 99285."
            ),
        ),
        AuditItemResponse(
            id="item_02",
            cpt_code="80053",
            description="Comprehensive Metabolic Panel",
            billed_amount=Decimal("275.00"),
            benchmark_amount=Decimal("125.00"),
            possible_overcharge=Decimal("150.00"),
            explanation=(
                "Billed amount exceeds standard clinical lab fee schedule "
                "for regional facilities."
            ),
        ),
        AuditItemResponse(
            id="item_03",
            cpt_code="71046",
            description="Chest X-Ray 2 Views",
            billed_amount=Decimal("200.00"),
            benchmark_amount=Decimal("200.00"),
            possible_overcharge=Decimal("0.00"),
            explanation="Charge aligns with regional benchmark.",
        ),
    ]

    total_billed = sum(item.billed_amount for item in sample_items)
    total_possible_overcharge = sum(
        item.possible_overcharge or Decimal("0.00") for item in sample_items
    )

    provider_name = (
        request.provider_name
        if request and request.provider_name
        else "Metro General Hospital"
    )

    return AuditResponse(
        id="audit_sample_001",
        provider_name=provider_name,
        total_billed=total_billed,
        total_possible_overcharge=total_possible_overcharge,
        items=sample_items,
    )
