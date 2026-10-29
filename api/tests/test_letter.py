from decimal import Decimal

from app.services.audit import audit_charges
from app.services.letter import generate_dispute_letter


def test_generate_dispute_letter_rendering():
    items = [
        {
            "id": "item_1",
            "cpt_code": "99285",
            "description": "Emergency Department Visit",
            "billed_amount": Decimal("1200.00"),
            "benchmark_amount": Decimal("600.00"),
            "benchmark_source": "Medicare Fee Schedule 2024",
        },
        {
            "id": "item_2",
            "cpt_code": "80053",
            "description": "Comprehensive Metabolic Panel",
            "billed_amount": Decimal("150.00"),
            "is_gst_exempt": True,
            "gst_amount": Decimal("15.00"),
        },
    ]

    audit_result = audit_charges(items)
    letter_text = generate_dispute_letter(
        audit_result=audit_result,
        provider_name="City General Hospital",
        patient_name="Jane Doe",
        bill_id="BILL-2024-99",
        bill_date="2024-02-01",
    )

    # Assert basic rendering structure
    assert "City General Hospital" in letter_text
    assert "Jane Doe" in letter_text
    assert "BILL-2024-99" in letter_text

    # Assert mandatory non-accusatory requirement: "possible overcharge"
    assert "possible overcharge" in letter_text.lower()

    # Assert flag reasons and reference sources are present in output
    assert "Medicare Fee Schedule 2024" in letter_text or "Benchmark" in letter_text
    assert "GST Tax Assessment Schedule" in letter_text or "GST" in letter_text

    # Assert no forbidden accusatory words
    accusatory_words = [
        "fraud",
        "illegal",
        "cheat",
        "scam",
        "malpractice",
        "wrongdoing",
    ]
    for word in accusatory_words:
        assert word not in letter_text.lower()


def test_generate_dispute_letter_empty_flags():
    empty_audit = {
        "total_billed": Decimal("500.00"),
        "total_possible_overcharge": Decimal("0.00"),
        "flags": [],
    }

    letter_text = generate_dispute_letter(
        audit_result=empty_audit,
        provider_name="St. Jude Clinic",
        patient_name="John Smith",
    )

    assert "St. Jude Clinic" in letter_text
    assert "John Smith" in letter_text
    assert "possible overcharge" in letter_text.lower()
