"""Pydantic schemas for the starter document workspace slice."""

from pydantic import BaseModel


class DocumentVersion(BaseModel):
    id: str
    versionNumber: int
    createdAt: str
    createdBy: str
    summary: str
    ocrStatus: str
    providerRevisionId: str | None


class DocumentAiFlag(BaseModel):
    id: str
    label: str
    detail: str
    confidence: str


class DocumentAiReview(BaseModel):
    status: str
    summary: str
    flags: list[DocumentAiFlag]
    lastAnalyzedAt: str | None


class DocumentActivityItem(BaseModel):
    id: str
    at: str
    actor: str
    detail: str


class DocumentProviderLink(BaseModel):
    provider: str
    documentUrl: str | None
    templateUrl: str | None
    syncStatus: str
    lastSyncedAt: str | None


class DocumentRecord(BaseModel):
    id: str
    caseId: str
    caseReference: str
    caseTitle: str
    clientName: str
    title: str
    documentType: str
    sourceKind: str
    latestVersionNumber: int
    ocrStatus: str
    aiStatus: str
    requestStatus: str
    isClientShared: bool
    tags: list[str]
    updatedAt: str
    uploadedBy: str
    previewSummary: str
    versions: list[DocumentVersion]
    aiReview: DocumentAiReview
    providerLink: DocumentProviderLink | None
    activity: list[DocumentActivityItem]


class DocumentTemplateField(BaseModel):
    id: str
    token: str
    label: str
    source: str
    required: bool


class DocumentTemplate(BaseModel):
    id: str
    name: str
    category: str
    sourceKind: str
    status: str
    ownerName: str
    caseTypes: list[str]
    practiceAreas: list[str]
    updatedAt: str
    defaultDocumentType: str
    defaultTags: list[str]
    titlePattern: str
    supportsInternalGeneration: bool
    outputTargets: list[str]
    sourceFileName: str
    fields: list[DocumentTemplateField]


class DocumentProviderStatus(BaseModel):
    provider: str
    label: str
    status: str
    description: str
    lastSyncedAt: str | None


class DocumentWorkspaceData(BaseModel):
    documents: list[DocumentRecord]
    templates: list[DocumentTemplate]
    providers: list[DocumentProviderStatus]
    facets: dict[str, list[dict[str, str | int]]]


class UploadInitiateRequest(BaseModel):
    title: str
    document_type: str
    file_name: str


class UploadInitiateResponse(BaseModel):
    document_id: str
    upload_url: str
    storage_key: str


class UploadConfirmRequest(BaseModel):
    storage_key: str
    checksum_sha256: str
    mime_type: str
    file_size_bytes: int


class UploadConfirmResponse(BaseModel):
    document_id: str
    version_id: str
    ocr_status: str


class DocumentMetadataUpdate(BaseModel):
    title: str | None = None
    document_type: str | None = None
    tags: list[str] | None = None
    is_client_shared: bool | None = None


class DownloadResponse(BaseModel):
    download_url: str
    expires_in: int


class ShareRequest(BaseModel):
    is_client_shared: bool = True


class ClientUploadRequest(BaseModel):
    status: str = "requested"


class DocumentTemplateCreateRequest(BaseModel):
    name: str
    category: str
    sourceKind: str
    status: str


class DocumentTemplateGenerateRequest(BaseModel):
    caseId: str
    title: str
    outputTarget: str


class ProviderConnectResponse(BaseModel):
    provider: str
    status: str
