from fastapi.testclient import TestClient

from app.main import app


def test_healthcheck() -> None:
    client = TestClient(app)

    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_list_matters() -> None:
    client = TestClient(app)

    response = client.get("/api/v1/matters")

    assert response.status_code == 200
    payload = response.json()
    assert len(payload) >= 1
    assert payload[0]["reference"] == "M-0041"


def test_get_matter_detail() -> None:
    client = TestClient(app)

    response = client.get("/api/v1/matters/matter-0041")

    assert response.status_code == 200
    payload = response.json()
    assert payload["title"] == "Asante v. Mensah Industries Ltd"
    assert payload["recentTimeline"]


def test_get_missing_matter_returns_404() -> None:
    client = TestClient(app)

    response = client.get("/api/v1/matters/matter-missing")

    assert response.status_code == 404
    assert response.json()["detail"] == "Matter not found"
