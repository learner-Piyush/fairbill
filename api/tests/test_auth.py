from decimal import Decimal

from fastapi.testclient import TestClient

from app.config import Settings
from app.main import app

client = TestClient(app)
VALID_KEY = "test_internal_key"


def test_settings_load_from_environment(monkeypatch):
    monkeypatch.setenv("INTERNAL_API_KEY", "custom_internal_secret")
    monkeypatch.setenv("GEMINI_API_KEY", "custom_gemini_secret")
    settings = Settings()
    assert settings.internal_api_key == "custom_internal_secret"
    assert settings.gemini_api_key == "custom_gemini_secret"
    assert settings.INTERNAL_API_KEY == "custom_internal_secret"
    assert settings.GEMINI_API_KEY == "custom_gemini_secret"


def test_v1_audit_unauthorized_when_server_key_unset(monkeypatch):
    monkeypatch.delenv("INTERNAL_API_KEY", raising=False)
    response = client.post(
        "/v1/audit",
        headers={"X-Internal-Key": "any_key"},
        json={},
    )
    assert response.status_code == 401
    assert "Invalid or missing internal API key" in response.json()["detail"]


def test_v1_audit_unauthorized_when_missing_key(monkeypatch):
    monkeypatch.setenv("INTERNAL_API_KEY", VALID_KEY)
    response = client.post("/v1/audit", json={})
    assert response.status_code == 401
    assert "Invalid or missing internal API key" in response.json()["detail"]


def test_v1_audit_unauthorized_when_invalid_key(monkeypatch):
    monkeypatch.setenv("INTERNAL_API_KEY", VALID_KEY)
    response = client.post(
        "/v1/audit",
        headers={"X-Internal-Key": "wrong_key"},
        json={},
    )
    assert response.status_code == 401
    assert "Invalid or missing internal API key" in response.json()["detail"]


def test_v1_audit_success_with_valid_key(monkeypatch):
    monkeypatch.setenv("INTERNAL_API_KEY", VALID_KEY)
    response = client.post(
        "/v1/audit",
        headers={"X-Internal-Key": VALID_KEY},
        json={"provider_name": "Test Hospital"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["provider_name"] == "Test Hospital"
    assert Decimal(str(data["total_billed"])) > 0
    assert Decimal(str(data["total_possible_overcharge"])) > 0
    assert len(data["items"]) == 3
    # Check that user-facing wording uses "possible overcharge"
    assert "possible overcharges" in data["disclaimer"]
    for item in data["items"]:
        assert "possible_overcharge" in item
