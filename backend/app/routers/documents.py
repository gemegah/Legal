"""Mock-backed document routes for the SPE-14 workspace."""

from fastapi import APIRouter, HTTPException, Query, status

from app.schemas.document import (
    ClientUploadRequest,
    DocumentMetadataUpdate,
    DocumentRecord,
    DocumentTemplate,
    DocumentTemplateCreateRequest,
    DocumentTemplateGenerateRequest,
    DocumentWorkspaceData,
    DownloadResponse,
    ProviderConnectResponse,
    ShareRequest,
    UploadConfirmRequest,
    UploadConfirmResponse,
    UploadInitiateRequest,
    UploadInitiateResponse,
)
from app.services.document_service import (
    connect_provider,
    create_template,
    confirm_document_upload,
    generate_from_template,
    get_document,
    get_template,
    get_workspace,
    initiate_document_upload,
    list_document_versions,
    list_provider_statuses,
    list_templates,
    restore_document_version,
    run_document_analysis,
    toggle_document_share,
    update_client_request_state,
    update_document_metadata,
)

router = APIRouter()


@router.get("/documents/workspace", response_model=DocumentWorkspaceData)
async def document_workspace(case_id: str | None = Query(default=None)) -> DocumentWorkspaceData:
    return get_workspace(case_id)


@router.get("/cases/{case_id}/documents", response_model=list[DocumentRecord])
async def case_documents(case_id: str) -> list[DocumentRecord]:
    return get_workspace(case_id).documents


@router.post("/cases/{case_id}/documents/upload-initiate", response_model=UploadInitiateResponse)
async def initiate_upload(case_id: str, payload: UploadInitiateRequest) -> UploadInitiateResponse:
    document_id, storage_key = initiate_document_upload(case_id, payload)
    return UploadInitiateResponse(
        document_id=document_id,
        upload_url=f"https://uploads.example/{document_id}",
        storage_key=storage_key,
    )


@router.post("/cases/{case_id}/documents/{doc_id}/confirm", response_model=UploadConfirmResponse)
async def confirm_upload(case_id: str, doc_id: str, payload: UploadConfirmRequest) -> UploadConfirmResponse:
    result = confirm_document_upload(case_id, doc_id, payload)
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    document_id, version_id = result
    return UploadConfirmResponse(document_id=document_id, version_id=version_id, ocr_status="processing")


@router.get("/documents/{document_id}", response_model=DocumentRecord)
async def document_detail(document_id: str) -> DocumentRecord:
    document = get_document(document_id)
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    return document


@router.get("/documents/{document_id}/versions")
async def document_versions(document_id: str) -> list[dict]:
    versions = list_document_versions(document_id)
    if not versions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    return versions


@router.post("/documents/{document_id}/versions/{version_id}/restore", response_model=DocumentRecord)
async def restore_version(document_id: str, version_id: str) -> DocumentRecord:
    document = restore_document_version(document_id, version_id)
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    return document


@router.patch("/documents/{document_id}/metadata", response_model=DocumentRecord)
async def patch_document_metadata(document_id: str, payload: DocumentMetadataUpdate) -> DocumentRecord:
    document = update_document_metadata(document_id, payload)
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    return document


@router.get("/documents/{document_id}/download", response_model=DownloadResponse)
async def document_download(document_id: str) -> DownloadResponse:
    if not get_document(document_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    return DownloadResponse(download_url=f"https://downloads.example/{document_id}", expires_in=900)


@router.post("/documents/{document_id}/analyze", response_model=DocumentRecord)
async def analyze_document(document_id: str) -> DocumentRecord:
    document = run_document_analysis(document_id)
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    return document


@router.post("/documents/{document_id}/share", response_model=DocumentRecord)
async def share_document(document_id: str, payload: ShareRequest) -> DocumentRecord:
    document = toggle_document_share(document_id, payload.is_client_shared)
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    return document


@router.post("/documents/{document_id}/request-client-upload", response_model=DocumentRecord)
async def request_client_upload(document_id: str, payload: ClientUploadRequest) -> DocumentRecord:
    document = update_client_request_state(document_id, payload.status)
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    return document


@router.get("/document-templates", response_model=list[DocumentTemplate])
async def document_templates() -> list[DocumentTemplate]:
    return list_templates()


@router.post("/document-templates", response_model=DocumentTemplate)
async def create_document_template(payload: DocumentTemplateCreateRequest) -> DocumentTemplate:
    return create_template(payload)


@router.get("/document-templates/{template_id}", response_model=DocumentTemplate)
async def document_template_detail(template_id: str) -> DocumentTemplate:
    template = get_template(template_id)
    if not template:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Template not found")
    return template


@router.patch("/document-templates/{template_id}", response_model=DocumentTemplate)
async def patch_document_template(template_id: str, payload: DocumentTemplateCreateRequest) -> DocumentTemplate:
    template = get_template(template_id)
    if not template:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Template not found")
    return create_template(payload)


@router.post("/document-templates/{template_id}/generate", response_model=DocumentRecord)
async def generate_document(template_id: str, payload: DocumentTemplateGenerateRequest) -> DocumentRecord:
    document = generate_from_template(template_id, payload)
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Template not found")
    return document


@router.get("/integrations/document-providers")
async def provider_statuses() -> list[dict]:
    return [item.model_dump() for item in list_provider_statuses()]


@router.post("/integrations/document-providers/{provider}/connect", response_model=ProviderConnectResponse)
async def provider_connect(provider: str) -> ProviderConnectResponse:
    item = connect_provider(provider)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Provider not found")
    return ProviderConnectResponse(provider=item.provider, status=item.status)
