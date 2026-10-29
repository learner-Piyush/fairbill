"""Dispute and itemization letter generation service.

Generates polite, professional dispute and itemized review request letters
highlighting possible overcharges using Jinja2 templates.
Wording strictly uses non-accusatory terminology and phrases such as
'possible overcharge'.
"""

from datetime import date
from typing import Any, Dict, List, Optional

import jinja2

DISPUTE_LETTER_TEMPLATE = """\
Date: {{ letter_date }}

To: Billing Department
{{ provider_name }}

Subject: Request for Itemized Billing Review - Account / Bill Ref: {{ bill_id }}

Dear Billing Department,

I am writing to respectfully request an itemized review of my recent medical \
bill (Reference: {{ bill_id }}), dated {{ bill_date }}. I appreciate the care \
provided by {{ provider_name }} and am seeking clarification regarding certain \
charges listed on my statement.

Upon reviewing the charges against benchmark fee schedules and standard \
billing guidelines, I noted findings that may represent a possible overcharge:

Total Billed: ${{ "%.2f"|format(total_billed) }}
Total Estimated Possible Overcharge: ${{ "%.2f"|format(total_possible_overcharge) }}

Summary of Identified Items for Review:
{% for flag in flags %}
* Item: {{ flag.item_description or flag.cpt_code or "Line Item" }}
  {% if flag.cpt_code %}CPT/Code: {{ flag.cpt_code }}{% endif %}
  {% if flag.billed_amount is not none %}\
Billed Amount: ${{ "%.2f"|format(flag.billed_amount) }}{% endif %}
  Estimated Possible Overcharge: ${{ "%.2f"|format(flag.possible_overcharge) }}
  Reason: {{ flag.reason }}
  Reference Source: {{ flag.reference_source }}

{% endfor %}
In light of these findings, I kindly request a review of these line items for \
possible overcharge adjustments or clarification. Please provide an updated, \
itemized statement.

Thank you for your time, assistance, and continued support.

Sincerely,

{{ patient_name }}
{{ patient_contact }}
"""


def _to_float(val: Any) -> float:
    if val is None:
        return 0.0
    try:
        return float(val)
    except Exception:
        return 0.0


def generate_dispute_letter(
    audit_result: Dict[str, Any],
    provider_name: Optional[str] = None,
    patient_name: Optional[str] = None,
    patient_contact: Optional[str] = None,
    bill_id: Optional[str] = None,
    bill_date: Optional[str] = None,
    letter_date: Optional[str] = None,
) -> str:
    """Generate a formal dispute and itemization review letter using Jinja2.

    Args:
        audit_result: Audit findings dict containing flags, total_billed, and
            total_possible_overcharge.
        provider_name: Hospital or healthcare provider name.
        patient_name: Patient full name.
        patient_contact: Patient contact details.
        bill_id: Bill or account reference identifier.
        bill_date: Date of original medical bill.
        letter_date: Date of letter issuance.

    Returns:
        Formatted polite dispute letter text highlighting possible overcharges.
    """
    flags_raw = audit_result.get("flags") or audit_result.get("raw_flags") or []
    flags: List[Dict[str, Any]] = []

    for item in flags_raw:
        if isinstance(item, dict):
            flags.append(item)
        elif hasattr(item, "model_dump"):
            flags.append(item.model_dump())
        elif hasattr(item, "__dict__"):
            flags.append(item.__dict__)

    total_billed = _to_float(audit_result.get("total_billed", 0.0))
    total_possible_overcharge = _to_float(
        audit_result.get("total_possible_overcharge", 0.0)
    )

    if total_possible_overcharge == 0.0 and flags:
        total_possible_overcharge = sum(
            _to_float(f.get("possible_overcharge", 0.0)) for f in flags
        )

    ctx = {
        "provider_name": (
            provider_name or audit_result.get("provider_name") or "Healthcare Provider"
        ),
        "patient_name": patient_name or "Valued Patient",
        "patient_contact": (
            patient_contact or "Contact Email/Phone: [Patient Contact Details]"
        ),
        "bill_id": bill_id or audit_result.get("id") or "BILL-REF-001",
        "bill_date": bill_date or "Recent Date of Service",
        "letter_date": letter_date or str(date.today()),
        "total_billed": total_billed,
        "total_possible_overcharge": total_possible_overcharge,
        "flags": flags,
    }

    template = jinja2.Template(DISPUTE_LETTER_TEMPLATE)
    return template.render(ctx)
