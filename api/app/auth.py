import secrets
from typing import Optional

from fastapi import Depends, Header, HTTPException, status

from app.config import Settings, get_settings


def verify_internal_key(
    x_internal_key: Optional[str] = Header(None, alias="X-Internal-Key"),
    settings: Settings = Depends(get_settings),
) -> str:
    """Validate internal API key for inter-service communication.

    Performs a constant-time comparison against INTERNAL_API_KEY read
    from settings.

    Raises:
        HTTPException: 401 if X-Internal-Key is missing or does
            not match INTERNAL_API_KEY.
    """
    resolved_settings = settings if isinstance(settings, Settings) else get_settings()
    expected_key = resolved_settings.internal_api_key

    if (
        not expected_key
        or not x_internal_key
        or not secrets.compare_digest(x_internal_key, expected_key)
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing internal API key",
        )
    return x_internal_key
