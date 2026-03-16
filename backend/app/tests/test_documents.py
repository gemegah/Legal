from fastapi.testclient import TestClient

from app.main import app


def test_document_workspace_route() -> None:
    client = TestClient(app)

    response = client.get("/api/v1/documents/workspace")

    assert response.status_code == 200
    payload = response.json()
    assert payload["documents"]
    assert payload["templates"]
    assert payload["providers"]


def test_document_detail_route() -> None:
    client = TestClient(app)

    response = client.get("/api/v1/documents/api-doc-001")

    assert response.status_code == 200
    payload = response.json()
    assert payload["title"] == "Reply to Notice of Preliminary Objection"
    assert payload["fileName"] == "reply-preliminary-objection.docx"
    assert payload["status"] == "ready"
    assert payload["versions"]


def test_can_update_document_share_state() -> None:
    client = TestClient(app)

    response = client.post("/api/v1/documents/api-doc-001/share", json={"is_client_shared": True})

    assert response.status_code == 200
    assert response.json()["isClientShared"] is True


def test_can_create_template_and_generate_document() -> None:
    client = TestClient(app)

    template_response = client.post(
        "/api/v1/document-templates",
        json={
            "name": "New Advice Pack",
            "category": "Advisory",
            "sourceKind": "word",
            "status": "draft",
        },
    )

    assert template_response.status_code == 200
    template_id = template_response.json()["id"]

    generate_response = client.post(
        f"/api/v1/document-templates/{template_id}/generate",
        json={
            "caseId": "case-0041",
            "title": "Generated Advice Draft",
            "outputTarget": "word",
        },
    )

    assert generate_response.status_code == 200
    assert generate_response.json()["title"] == "Generated Advice Draft"


def test_upload_initiate_and_confirm_create_pending_document() -> None:
    client = TestClient(app)

    initiate_response = client.post(
        "/api/v1/cases/case-0041/documents/upload-initiate",
        json={
            "title": "Registry Scan",
            "document_type": "Court Notice",
            "file_name": "registry-scan.pdf",
        },
    )

    assert initiate_response.status_code == 200
    initiated = initiate_response.json()

    confirm_response = client.post(
        f"/api/v1/cases/case-0041/documents/{initiated['document_id']}/confirm",
        json={
            "storage_key": initiated["storage_key"],
            "checksum_sha256": "starter-checksum",
            "mime_type": "application/pdf",
            "file_size_bytes": 1024,
        },
    )

    assert confirm_response.status_code == 200
    detail_response = client.get(f"/api/v1/documents/{initiated['document_id']}")
    assert detail_response.status_code == 200
    detail = detail_response.json()
    assert detail["fileName"] == "registry-scan.pdf"
    assert detail["status"] == "processing"
