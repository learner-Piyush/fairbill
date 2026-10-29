from decimal import Decimal

from app.services.audit import (
    audit_charges,
    check_arithmetic_mismatch,
    check_duplicate_lines,
    check_gst_inconsistency,
    check_price_above_reference,
    check_unbundled_items,
)


def test_price_above_reference_configurable_percentage():
    reference_prices = {
        "99285": {
            "ceiling_or_reference_price": "500.00",
            "source": "Medicare Fee Schedule 2024",
        }
    }

    items = [
        {
            "id": "item_1",
            "cpt_code": "99285",
            "description": "Emergency Room Visit",
            "billed_amount": Decimal("520.00"),  # 4% above ref price
        },
        {
            "id": "item_2",
            "cpt_code": "99285",
            "description": "Emergency Room Visit",
            "billed_amount": Decimal("600.00"),  # 20% above ref price
        },
    ]

    # With default threshold 10%: item_1 (4% above) should pass,
    # item_2 (20% above) should flag
    flags_10 = check_price_above_reference(
        items, reference_prices=reference_prices, threshold_pct=10.0
    )
    assert len(flags_10) == 1
    assert flags_10[0].item_id == "item_2"
    assert flags_10[0].rule_id == "PRICE_ABOVE_REFERENCE"
    assert "possible overcharge" in flags_10[0].reason
    assert flags_10[0].reference_source == "Medicare Fee Schedule 2024"
    assert flags_10[0].possible_overcharge == Decimal("100.00")

    # With custom threshold 0%: both item_1 and item_2 should flag
    flags_0 = check_price_above_reference(
        items, reference_prices=reference_prices, threshold_pct=0.0
    )
    assert len(flags_0) == 2


def test_duplicate_lines_check():
    items = [
        {
            "id": "item_1",
            "cpt_code": "80053",
            "description": "Comprehensive Metabolic Panel",
            "billed_amount": Decimal("150.00"),
            "date_of_service": "2024-01-15",
        },
        {
            "id": "item_2",
            "cpt_code": "80053",
            "description": "Comprehensive Metabolic Panel",
            "billed_amount": Decimal("150.00"),
            "date_of_service": "2024-01-15",
        },
        {
            "id": "item_3",
            "cpt_code": "71046",
            "description": "Chest X-Ray",
            "billed_amount": Decimal("200.00"),
            "date_of_service": "2024-01-15",
        },
    ]

    flags = check_duplicate_lines(items)
    assert len(flags) == 1
    assert flags[0].item_id == "item_2"
    assert flags[0].rule_id == "DUPLICATE_LINE"
    assert "possible overcharge" in flags[0].reason
    assert flags[0].reference_source != ""
    assert flags[0].possible_overcharge == Decimal("150.00")


def test_arithmetic_mismatch_check():
    items = [
        {
            "id": "item_1",
            "description": "Disposable Syringes",
            "quantity": 5,
            "unit_price": Decimal("10.00"),
            "billed_amount": Decimal("75.00"),  # Expected 50.00
        },
        {
            "id": "item_2",
            "description": "Bandages",
            "quantity": 2,
            "unit_price": Decimal("5.00"),
            "billed_amount": Decimal("10.00"),  # Expected 10.00
        },
    ]

    flags = check_arithmetic_mismatch(items, reported_total=Decimal("100.00"))
    assert len(flags) == 2

    # Item level mismatch flag
    item_flag = [f for f in flags if f.item_id == "item_1"][0]
    assert item_flag.rule_id == "ARITHMETIC_MISMATCH"
    assert "possible overcharge" in item_flag.reason
    assert item_flag.possible_overcharge == Decimal("25.00")
    assert item_flag.reference_source != ""

    # Bill total level mismatch flag (sum of items = 85.00, reported total = 100.00)
    total_flag = [f for f in flags if f.item_id is None][0]
    assert total_flag.rule_id == "ARITHMETIC_MISMATCH"
    assert "possible overcharge" in total_flag.reason
    assert total_flag.possible_overcharge == Decimal("15.00")


def test_gst_inconsistency_check():
    items = [
        {
            "id": "item_1",
            "description": "Prescription Medication",
            "billed_amount": Decimal("100.00"),
            "gst_amount": Decimal("10.00"),
            "is_gst_exempt": True,  # Charged GST on exempt item
        },
        {
            "id": "item_2",
            "description": "Medical Consultation",
            "billed_amount": Decimal("200.00"),
            "gst_amount": Decimal("30.00"),
            "gst_rate": Decimal("0.10"),  # Expected 20.00 GST (10%)
        },
    ]

    flags = check_gst_inconsistency(items)
    assert len(flags) == 2

    exempt_flag = [f for f in flags if f.item_id == "item_1"][0]
    assert exempt_flag.rule_id == "GST_INCONSISTENCY"
    assert exempt_flag.possible_overcharge == Decimal("10.00")
    assert "GST-exempt" in exempt_flag.reason
    assert "possible overcharge" in exempt_flag.reason
    assert exempt_flag.reference_source != ""

    rate_flag = [f for f in flags if f.item_id == "item_2"][0]
    assert rate_flag.rule_id == "GST_INCONSISTENCY"
    assert rate_flag.possible_overcharge == Decimal("10.00")
    assert "possible overcharge" in rate_flag.reason
    assert rate_flag.reference_source != ""


def test_unbundled_items_check():
    items = [
        {
            "id": "item_pkg",
            "cpt_code": "80053",
            "description": "Comprehensive Metabolic Panel",
            "billed_amount": Decimal("300.00"),
            "is_package": True,
        },
        {
            "id": "item_comp",
            "cpt_code": "82565",  # Blood Creatinine (part of 80053)
            "description": "Creatinine Blood Test",
            "billed_amount": Decimal("50.00"),
        },
    ]

    flags = check_unbundled_items(items)
    assert len(flags) == 1
    assert flags[0].item_id == "item_comp"
    assert flags[0].rule_id == "UNBUNDLED_ITEM"
    assert "possible overcharge" in flags[0].reason
    assert flags[0].possible_overcharge == Decimal("50.00")
    assert "CMS NCCI Unbundling Guidelines" in flags[0].reference_source


def test_audit_charges_integration():
    items = [
        {
            "id": "item_1",
            "cpt_code": "80053",
            "description": "Comprehensive Metabolic Panel",
            "billed_amount": Decimal("300.00"),
            "is_package": True,
        },
        {
            "id": "item_2",
            "cpt_code": "80053",
            "description": "Comprehensive Metabolic Panel",
            "billed_amount": Decimal("300.00"),
            "date_of_service": "2024-01-01",
        },
    ]

    result = audit_charges(items)
    assert result["total_billed"] == Decimal("600.00")
    assert result["total_possible_overcharge"] > Decimal("0.00")
    assert len(result["flags"]) >= 1
    for flag in result["flags"]:
        assert "reason" in flag
        assert "reference_source" in flag
        assert "possible overcharge" in flag["reason"].lower()
