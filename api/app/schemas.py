from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = Field(default="ok", description="Health check status")


class AuditItemInput(BaseModel):
    description: str
    billed_amount: Decimal = Field(..., ge=0)
    cpt_code: Optional[str] = None


class AuditRequest(BaseModel):
    provider_name: Optional[str] = None
    items: Optional[List[AuditItemInput]] = None


class AuditItemResponse(BaseModel):
    id: str
    cpt_code: Optional[str] = None
    description: str
    billed_amount: Decimal
    benchmark_amount: Optional[Decimal] = None
    possible_overcharge: Optional[Decimal] = None
    explanation: Optional[str] = None


class AuditResponse(BaseModel):
    id: str
    provider_name: Optional[str] = None
    total_billed: Decimal
    total_possible_overcharge: Decimal
    items: List[AuditItemResponse]
    disclaimer: str = (
        "All audit findings highlight possible overcharges for review "
        "and negotiation. FairBill does not provide legal advice or "
        "accuse healthcare providers of wrongdoing."
    )
