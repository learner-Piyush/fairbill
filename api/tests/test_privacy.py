import logging
import os
from typing import Any

from app.services.extract import extract_bill_items


def test_bill_files_never_written_to_disk(tmp_path: Any, monkeypatch: Any) -> None:
    """Verify that processing uploaded bill files never creates files on disk."""

    test_file_bytes = b"%PDF-1.4 Mock Medical Bill Content - Confidential Patient Data"
    test_mime = "application/pdf"

    # Track directory contents before extraction
    files_before = set(os.listdir("."))
    if os.path.exists("/tmp"):
        tmp_before = set(os.listdir("/tmp"))
    else:
        tmp_before = set()

    # Call the extraction service with raw bill bytes
    items = extract_bill_items(test_file_bytes, test_mime)
    assert isinstance(items, list)

    # Track directory contents after extraction
    files_after = set(os.listdir("."))
    if os.path.exists("/tmp"):
        tmp_after = set(os.listdir("/tmp"))
    else:
        tmp_after = set()

    # Assert no new files were created in current working directory or /tmp
    assert files_after - files_before == set(), (
        "New files were detected in working directory"
    )
    assert tmp_after - tmp_before == set(), "New files were detected in /tmp directory"

    # Further verify test payload content is nowhere on disk in working dir
    for root, _, filenames in os.walk("."):
        if ".venv" in root or ".git" in root or "__pycache__" in root:
            continue
        for filename in filenames:
            filepath = os.path.join(root, filename)
            # Ignore test files themselves
            if filename == "test_privacy.py":
                continue
            try:
                with open(filepath, "rb") as f:
                    content = f.read()
                    assert b"Confidential Patient Data" not in content, (
                        f"Raw bill payload leaked into disk file: {filepath}"
                    )
            except OSError:
                pass


def test_bill_text_never_logged(caplog: Any) -> None:
    """Verify that raw bill text or file payloads are never emitted to loggers."""

    sensitive_bill_text = (
        "PATIENT: John Doe; SSN: 000-12-3456; BILLED: $10,500.00 for Surgery"
    )
    sensitive_bytes = sensitive_bill_text.encode("utf-8")

    with caplog.at_level(logging.DEBUG):
        extract_bill_items(sensitive_bytes, "text/plain")

    # Assert that no log records captured sensitive patient text
    for record in caplog.records:
        assert sensitive_bill_text not in record.getMessage()
        assert "John Doe" not in record.getMessage()
        assert "000-12-3456" not in record.getMessage()
