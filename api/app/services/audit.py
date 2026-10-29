"""Rule-based medical bill auditing service.

Applies deterministic rule-based checks to detect possible overcharges:
- Price above reference threshold by a configurable percentage
- Duplicate line items
- Arithmetic calculation mismatches
- GST / tax inconsistencies
- Unbundled items billed alongside a package

All flags include a non-accusatory reason mentioning 'possible overcharge'
and cite the reference source.
"""

from decimal import ROUND_HALF_UP, Decimal
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


def _to_decimal(val: Any, default: Decimal = Decimal("0.00")) -> Decimal:
    if val is None:
        return default
    if isinstance(val, Decimal):
        return val
    try:
        return Decimal(str(val))
    except Exception:
        return default


class AuditFlag(BaseModel):
    rule_id: str
    item_id: Optional[str] = None
    item_description: Optional[str] = None
    cpt_code: Optional[str] = None
    billed_amount: Optional[Decimal] = None
    possible_overcharge: Decimal = Field(default=Decimal("0.00"))
    reason: str
    reference_source: str


def check_price_above_reference(
    items: List[Dict[str, Any]],
    reference_prices: Optional[Dict[str, Any]] = None,
    threshold_pct: float = 10.0,
) -> List[AuditFlag]:
    """Flag items billed above reference price by more than threshold_pct."""
    flags: List[AuditFlag] = []
    threshold_factor = Decimal("1.0") + (_to_decimal(threshold_pct) / Decimal("100.0"))

    for idx, item in enumerate(items):
        item_id = str(item.get("id", f"item_{idx + 1}"))
        description = item.get("description", "Medical Service")
        cpt_code = item.get("cpt_code") or item.get("item_key")
        billed_amount = _to_decimal(item.get("billed_amount") or item.get("unit_price"))

        ref_price: Optional[Decimal] = None
        ref_source: str = "Reference Price Benchmark"

        # Check direct benchmark on item if available
        if "benchmark_amount" in item and item["benchmark_amount"] is not None:
            ref_price = _to_decimal(item["benchmark_amount"])
            ref_source = item.get("benchmark_source", "Regional Commercial Benchmark")
        elif "reference_price" in item and item["reference_price"] is not None:
            ref_price = _to_decimal(item["reference_price"])
            ref_source = item.get("reference_source", "Fee Schedule Benchmark")
        elif reference_prices and cpt_code and cpt_code in reference_prices:
            ref_data = reference_prices[cpt_code]
            if hasattr(ref_data, "ceiling_or_reference_price"):
                ref_price = _to_decimal(ref_data.ceiling_or_reference_price)
                ref_source = getattr(ref_data, "source", ref_source)
            elif isinstance(ref_data, dict):
                ref_price = _to_decimal(
                    ref_data.get("ceiling_or_reference_price")
                    or ref_data.get("reference_price")
                )
                ref_source = ref_data.get("source", ref_source)

        if ref_price is not None and ref_price > Decimal("0.00"):
            allowed_max = ref_price * threshold_factor
            if billed_amount > allowed_max:
                overcharge = billed_amount - ref_price
                flags.append(
                    AuditFlag(
                        rule_id="PRICE_ABOVE_REFERENCE",
                        item_id=item_id,
                        item_description=description,
                        cpt_code=cpt_code,
                        billed_amount=billed_amount,
                        possible_overcharge=overcharge,
                        reason=(
                            f"Billed amount (${billed_amount:.2f}) exceeds "
                            f"reference benchmark (${ref_price:.2f}) by more "
                            f"than {threshold_pct:.1f}%, indicating a possible "
                            f"overcharge of ${overcharge:.2f}."
                        ),
                        reference_source=ref_source,
                    )
                )

    return flags


def check_duplicate_lines(items: List[Dict[str, Any]]) -> List[AuditFlag]:
    """Flag duplicate line items billed for the same service."""
    flags: List[AuditFlag] = []
    seen_keys: Dict[tuple, int] = {}

    for idx, item in enumerate(items):
        item_id = str(item.get("id", f"item_{idx + 1}"))
        description = (item.get("description") or "").strip().lower()
        cpt_code = (item.get("cpt_code") or item.get("item_key") or "").strip()
        billed_amount = _to_decimal(item.get("billed_amount"))

        key = (cpt_code, description, billed_amount)

        if key in seen_keys:
            flags.append(
                AuditFlag(
                    rule_id="DUPLICATE_LINE",
                    item_id=item_id,
                    item_description=item.get("description", "Medical Service"),
                    cpt_code=cpt_code or None,
                    billed_amount=billed_amount,
                    possible_overcharge=billed_amount,
                    reason=(
                        f"Duplicate line item detected for "
                        f"'{item.get('description')}'. "
                        f"Subsequent charge of ${billed_amount:.2f} represents "
                        "a possible overcharge."
                    ),
                    reference_source=(
                        "Hospital Itemized Billing Audit Standard / Line "
                        "Verification Rule"
                    ),
                )
            )
        else:
            seen_keys[key] = idx

    return flags


def check_arithmetic_mismatch(
    items: List[Dict[str, Any]],
    reported_subtotal: Optional[Any] = None,
    reported_total: Optional[Any] = None,
) -> List[AuditFlag]:
    """Flag arithmetic calculation discrepancies on line items or bill totals."""
    flags: List[AuditFlag] = []
    calc_sum = Decimal("0.00")

    for idx, item in enumerate(items):
        item_id = str(item.get("id", f"item_{idx + 1}"))
        description = item.get("description", "Medical Service")
        billed_amount = _to_decimal(item.get("billed_amount"))
        calc_sum += billed_amount

        quantity = item.get("quantity")
        unit_price = item.get("unit_price")

        if quantity is not None and unit_price is not None:
            qty_dec = _to_decimal(quantity)
            price_dec = _to_decimal(unit_price)
            if qty_dec > Decimal("0.00") and price_dec > Decimal("0.00"):
                expected_amount = (qty_dec * price_dec).quantize(
                    Decimal("0.01"), rounding=ROUND_HALF_UP
                )
                if abs(billed_amount - expected_amount) >= Decimal("0.01"):
                    overcharge = max(Decimal("0.00"), billed_amount - expected_amount)
                    flags.append(
                        AuditFlag(
                            rule_id="ARITHMETIC_MISMATCH",
                            item_id=item_id,
                            item_description=description,
                            cpt_code=item.get("cpt_code"),
                            billed_amount=billed_amount,
                            possible_overcharge=overcharge,
                            reason=(
                                f"Arithmetic mismatch for '{description}': billed "
                                f"amount (${billed_amount:.2f}) does not match "
                                f"calculated total (${expected_amount:.2f} = "
                                f"{qty_dec} x ${price_dec:.2f}), indicating a "
                                f"possible overcharge of ${overcharge:.2f}."
                            ),
                            reference_source="Billing Calculation Audit Rule",
                        )
                    )

    # Check total / subtotal calculation if provided
    rep_subtotal = (
        _to_decimal(reported_subtotal) if reported_subtotal is not None else None
    )
    rep_total = _to_decimal(reported_total) if reported_total is not None else None

    target_total = rep_total if rep_total is not None else rep_subtotal
    if target_total is not None and target_total > Decimal("0.00"):
        if abs(calc_sum - target_total) >= Decimal("0.01"):
            discrepancy = target_total - calc_sum
            if discrepancy > Decimal("0.00"):
                flags.append(
                    AuditFlag(
                        rule_id="ARITHMETIC_MISMATCH",
                        billed_amount=target_total,
                        possible_overcharge=discrepancy,
                        reason=(
                            f"Bill total calculation discrepancy: reported total "
                            f"(${target_total:.2f}) exceeds sum of item charges "
                            f"(${calc_sum:.2f}) by ${discrepancy:.2f}, "
                            "representing a possible overcharge."
                        ),
                        reference_source=("Bill Summary Arithmetic Audit Standard"),
                    )
                )

    return flags


def check_gst_inconsistency(
    items: List[Dict[str, Any]],
    default_gst_rate: Optional[Any] = None,
) -> List[AuditFlag]:
    """Flag tax / GST calculation inconsistencies or charges on GST-exempt items."""
    flags: List[AuditFlag] = []

    for idx, item in enumerate(items):
        item_id = str(item.get("id", f"item_{idx + 1}"))
        description = item.get("description", "Medical Service")
        billed_amount = _to_decimal(item.get("billed_amount"))
        gst_amount = _to_decimal(item.get("gst_amount"))
        is_exempt = bool(item.get("is_gst_exempt", False))

        rate = (
            item.get("gst_rate")
            if item.get("gst_rate") is not None
            else default_gst_rate
        )

        if is_exempt and gst_amount > Decimal("0.00"):
            flags.append(
                AuditFlag(
                    rule_id="GST_INCONSISTENCY",
                    item_id=item_id,
                    item_description=description,
                    cpt_code=item.get("cpt_code"),
                    billed_amount=billed_amount,
                    possible_overcharge=gst_amount,
                    reason=(
                        f"GST inconsistency: item '{description}' is "
                        f"designated GST-exempt but was charged GST of "
                        f"${gst_amount:.2f}, representing a possible "
                        "overcharge."
                    ),
                    reference_source="GST Tax Assessment Schedule",
                )
            )
        elif gst_amount > Decimal("0.00") and rate is not None:
            gst_rate_dec = _to_decimal(rate)
            taxable_base = _to_decimal(item.get("taxable_amount"), billed_amount)
            expected_gst = (taxable_base * gst_rate_dec).quantize(
                Decimal("0.01"), rounding=ROUND_HALF_UP
            )

            if gst_amount > expected_gst and (gst_amount - expected_gst) >= Decimal(
                "0.01"
            ):
                overcharge = gst_amount - expected_gst
                rate_pct = gst_rate_dec * Decimal("100.0")
                flags.append(
                    AuditFlag(
                        rule_id="GST_INCONSISTENCY",
                        item_id=item_id,
                        item_description=description,
                        cpt_code=item.get("cpt_code"),
                        billed_amount=billed_amount,
                        possible_overcharge=overcharge,
                        reason=(
                            f"GST inconsistency for '{description}': billed "
                            f"GST (${gst_amount:.2f}) exceeds expected GST "
                            f"(${expected_gst:.2f}) at {rate_pct:.1f}% rate on "
                            f"base ${taxable_base:.2f}, representing a "
                            f"possible overcharge of ${overcharge:.2f}."
                        ),
                        reference_source="GST Tax Calculation Standard",
                    )
                )

    return flags


def check_unbundled_items(
    items: List[Dict[str, Any]],
    package_rules: Optional[Dict[str, List[str]]] = None,
) -> List[AuditFlag]:
    """Flag component items billed separately alongside a package / bundle."""
    flags: List[AuditFlag] = []
    if not package_rules:
        # Default package mapping rules (package_code -> list of component codes/keys)
        package_rules = {
            "80053": [
                "80048",
                "80051",
                "84520",
                "82565",
            ],  # Comprehensive Metabolic Panel
            "85025": ["85004", "85014", "85041"],  # CBC with Differential
            "PKG_SURGERY_01": [
                "COMP_ANESTHESIA_BASIC",
                "COMP_POSTOP_CARE",
                "COMP_DRESSINGS",
            ],
        }

    # Collect active package codes / keys present in bill
    active_packages: Dict[str, str] = {}  # package_code -> package description
    for item in items:
        cpt_code = item.get("cpt_code") or item.get("item_key")
        is_pkg = item.get("is_package", False)
        desc = item.get("description", "Bundled Package")

        if cpt_code and (cpt_code in package_rules or is_pkg):
            active_packages[cpt_code] = desc

        # Check explicit package components attribute
        explicit_components = item.get("package_components")
        if explicit_components and isinstance(explicit_components, list):
            package_rules[cpt_code or desc] = explicit_components
            active_packages[cpt_code or desc] = desc

    if not active_packages:
        return flags

    # Check for unbundled components
    for idx, item in enumerate(items):
        item_id = str(item.get("id", f"item_{idx + 1}"))
        cpt_code = item.get("cpt_code") or item.get("item_key")
        description = item.get("description", "Medical Service")
        billed_amount = _to_decimal(item.get("billed_amount"))

        for pkg_code, pkg_desc in active_packages.items():
            components = package_rules.get(pkg_code, [])
            if (cpt_code and cpt_code in components) or (description in components):
                flags.append(
                    AuditFlag(
                        rule_id="UNBUNDLED_ITEM",
                        item_id=item_id,
                        item_description=description,
                        cpt_code=cpt_code,
                        billed_amount=billed_amount,
                        possible_overcharge=billed_amount,
                        reason=(
                            f"Unbundled item '{description}' (code: "
                            f"{cpt_code or 'N/A'}) was billed separately "
                            f"alongside bundled package '{pkg_desc}', "
                            "representing a possible overcharge of "
                            f"${billed_amount:.2f}."
                        ),
                        reference_source=(
                            "CMS NCCI Unbundling Guidelines / Package Policy Schedule"
                        ),
                    )
                )

    return flags


def audit_charges(
    items: List[Dict[str, Any]],
    zip_code: Optional[str] = None,
    threshold_pct: float = 10.0,
    reference_prices: Optional[Dict[str, Any]] = None,
    package_rules: Optional[Dict[str, List[str]]] = None,
    reported_subtotal: Optional[Any] = None,
    reported_total: Optional[Any] = None,
    default_gst_rate: Optional[Any] = None,
) -> Dict[str, Any]:
    """Audit itemized charges against deterministic rule-based checks.

    Args:
        items: List of line item dicts.
        zip_code: Geographic area code (optional).
        threshold_pct: Price tolerance percentage above reference price.
        reference_prices: Reference price lookup dictionary.
        package_rules: Package bundling definitions.
        reported_subtotal: Subtotal reported on bill.
        reported_total: Total reported on bill.
        default_gst_rate: Default GST rate (e.g. 0.10 for 10%).

    Returns:
        Structured audit result containing total billed, total possible
        overcharge, and flags with reason and reference source.
    """
    flags: List[AuditFlag] = []

    # Run all 5 rule-based checks
    flags.extend(
        check_price_above_reference(
            items,
            reference_prices=reference_prices,
            threshold_pct=threshold_pct,
        )
    )
    flags.extend(check_duplicate_lines(items))
    flags.extend(
        check_arithmetic_mismatch(
            items,
            reported_subtotal=reported_subtotal,
            reported_total=reported_total,
        )
    )
    flags.extend(check_gst_inconsistency(items, default_gst_rate=default_gst_rate))
    flags.extend(check_unbundled_items(items, package_rules=package_rules))

    total_billed = sum(
        (_to_decimal(i.get("billed_amount")) for i in items), Decimal("0.00")
    )
    if reported_total is not None and _to_decimal(reported_total) > Decimal("0.00"):
        total_billed = _to_decimal(reported_total)

    total_possible_overcharge = sum(
        (f.possible_overcharge for f in flags), Decimal("0.00")
    )

    return {
        "total_billed": total_billed,
        "total_possible_overcharge": total_possible_overcharge,
        "items": items,
        "flags": [f.model_dump() for f in flags],
        "raw_flags": flags,
    }
