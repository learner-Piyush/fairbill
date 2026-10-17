import os
from typing import Optional

from fastapi import Header, HTTPException, status


def verify_internal_key(
    x_internal_key: Optional[str] = Header(None, alias="X-Internal-Key"),
) -> str:
    """Validate internal API key for inter-service communication.

    Raises:
        HTTPException: 401 if X-Internal-Key is missing or does
            not match INTERNAL_API_KEY.
    """
    expected_key = os.environ.get("INTERNAL_API_KEY")
    if not expected_key or not x_internal_key or x_internal_key != expected_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing internal API key",
        )
    return x_internal_key
