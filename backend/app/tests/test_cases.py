from fastapi.testclient import TestClient

from app.main import app


def test_healthcheck() -> None:
    client = TestClient(app)

    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_list_cases() -> None:
    client = TestClient(app)

    response = client.get("/api/v1/cases")

    assert response.status_code == 200
    payload = response.json()
    assert len(payload) >= 1
    assert payload[0]["reference"] == "CAS-0041"


def test_get_case_detail() -> None:
    client = TestClient(app)

    response = client.get("/api/v1/cases/case-0041")

    assert response.status_code == 200
    payload = response.json()
    assert payload["title"] == "Asante v. Mensah Industries Ltd"
    assert payload["recentTimeline"]


def test_get_missing_case_returns_404() -> None:
    client = TestClient(app)

    response = client.get("/api/v1/cases/case-missing")

    assert response.status_code == 404
    assert response.json()["detail"] == "Case not found"
