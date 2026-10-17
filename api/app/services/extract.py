"""Extraction service stub.

Extracts structured line items, dates, and charges from ephemeral bill inputs
using multimodal LLM processing. In adherence to privacy guidelines, uploaded
bill documents and raw bill text are processed in memory and never stored
or logged.
"""

from typing import Any, Dict, List


def extract_bill_items(file_bytes: bytes, mime_type: str) -> List[Dict[str, Any]]:
    """Extract structured line items from an in-memory document.

    Raw content is never persisted.

    Args:
        file_bytes: In-memory document bytes.
        mime_type: MIME type of the document (e.g., application/pdf, image/png).

    Returns:
        A list of extracted line items as structured dictionaries.
    """
    # Stub implementation - to be implemented with Gemini google-genai SDK
    return []
