"""Starter in-memory document service for the SPE-14 workspace."""

from copy import deepcopy
from datetime import UTC, datetime

from app.schemas.document import (
    DocumentMetadataUpdate,
    DocumentProviderStatus,
    DocumentRecord,
    DocumentTemplate,
    DocumentTemplateCreateRequest,
    DocumentTemplateGenerateRequest,
    DocumentWorkspaceData,
)

_DOCUMENTS: list[DocumentRecord] = [
    DocumentRecord(
        id="api-doc-001",
        matterId="matter-0041",
        matterReference="M-0041",
        matterTitle="Asante v. Mensah Industries Ltd",
        clientName="Akosua Asante",
        title="Reply to Notice of Preliminary Objection",
        documentType="Court Filing",
        sourceKind="word",
        latestVersionNumber=3,
        ocrStatus="complete",
        aiStatus="ready",
        requestStatus="none",
        isClientShared=False,
        tags=["litigation", "reply", "urgent"],
        updatedAt="2026-03-09T10:00:00Z",
        uploadedBy="K. Boateng",
        previewSummary="Provider-authored draft with extracted deadlines ready for review.",
        versions=[
            {"id": "api-doc-001-v3", "versionNumber": 3, "createdAt": "2026-03-09T10:00:00Z", "createdBy": "K. Boateng", "summary": "Pre-filing review saved.", "ocrStatus": "complete", "providerRevisionId": "word-rev-3"},
            {"id": "api-doc-001-v2", "versionNumber": 2, "createdAt": "2026-03-08T16:30:00Z", "createdBy": "A. Owusu", "summary": "Authorities inserted.", "ocrStatus": "complete", "providerRevisionId": "word-rev-2"},
        ],
        aiReview={
            "status": "ready",
            "summary": "2 deadlines flagged with high confidence.",
            "flags": [
                {"id": "api-flag-1", "label": "Reply deadline", "detail": "Reply must be filed by 11 Mar 2026.", "confidence": "high"},
                {"id": "api-flag-2", "label": "Hearing date", "detail": "Matter is listed for 15 Mar 2026.", "confidence": "high"},
            ],
            "lastAnalyzedAt": "2026-03-09T10:05:00Z",
        },
        providerLink={"provider": "word", "documentUrl": "https://example.com/word/doc-001", "templateUrl": "https://example.com/word/template-litigation", "syncStatus": "idle", "lastSyncedAt": "2026-03-09T10:02:00Z"},
        activity=[{"id": "api-activity-1", "at": "2026-03-09T10:05:00Z", "actor": "LegalOS AI", "detail": "Deadline extraction completed."}],
    ),
    DocumentRecord(
        id="api-doc-002",
        matterId="matter-0039",
        matterReference="M-0039",
        matterTitle="Re: Accra Properties Ltd Acquisition",
        clientName="Accra Properties Ltd",
        title="Executed Transfer Deed",
        documentType="Executed Deed",
        sourceKind="generated",
        latestVersionNumber=2,
        ocrStatus="complete",
        aiStatus="failed",
        requestStatus="requested",
        isClientShared=True,
        tags=["property", "signed"],
        updatedAt="2026-03-08T12:00:00Z",
        uploadedBy="A. Owusu",
        previewSummary="Generated deed package with local snapshot retained for search.",
        versions=[
            {"id": "api-doc-002-v2", "versionNumber": 2, "createdAt": "2026-03-08T12:00:00Z", "createdBy": "A. Owusu", "summary": "Executed deed uploaded.", "ocrStatus": "complete", "providerRevisionId": None},
        ],
        aiReview={"status": "failed", "summary": "Unreadable signature page blocked extraction.", "flags": [], "lastAnalyzedAt": "2026-03-08T12:10:00Z"},
        providerLink=None,
        activity=[{"id": "api-activity-2", "at": "2026-03-08T12:10:00Z", "actor": "LegalOS AI", "detail": "Analysis failed and needs manual follow-up."}],
    ),
]

_TEMPLATES: list[DocumentTemplate] = [
    DocumentTemplate(
        id="api-template-001",
        name="Litigation Reply Pack",
        category="Litigation",
        sourceKind="word",
        status="active",
        ownerName="K. Boateng",
        matterTypes=["Commercial Litigation"],
        practiceAreas=["Litigation"],
        updatedAt="2026-03-08T16:00:00Z",
        defaultDocumentType="Court Filing",
        defaultTags=["litigation", "reply"],
        titlePattern="{{matter.reference}} - Reply Draft",
        supportsInternalGeneration=False,
        outputTargets=["word"],
        sourceFileName="litigation-reply.dotx",
        fields=[
            {"id": "template-field-1", "token": "{{matter.reference}}", "label": "Matter Reference", "source": "matter.reference", "required": True},
            {"id": "template-field-2", "token": "{{client.name}}", "label": "Client Name", "source": "client.name", "required": True},
        ],
    )
]

_PROVIDERS: list[DocumentProviderStatus] = [
    DocumentProviderStatus(provider="word", label="Microsoft Word", status="connected", description="Word drafts can open in the firm SharePoint workspace.", lastSyncedAt="2026-03-09T08:30:00Z"),
    DocumentProviderStatus(provider="google_docs", label="Google Docs", status="attention", description="Google Docs needs one template re-authentication.", lastSyncedAt="2026-03-08T17:15:00Z"),
]


def _build_facets(documents: list[DocumentRecord]) -> dict[str, list[dict[str, str | int]]]:
    def pack(values: list[str]) -> list[dict[str, str | int]]:
        counts: dict[str, int] = {}
        for value in values:
            counts[value] = counts.get(value, 0) + 1
        return [{"value": key, "count": value} for key, value in sorted(counts.items())]

    return {
        "matterOptions": pack([f"{doc.matterId}::{doc.matterReference}" for doc in documents]),
        "documentTypeOptions": pack([doc.documentType for doc in documents]),
        "sourceOptions": pack([doc.sourceKind for doc in documents]),
        "aiStatusOptions": pack([doc.aiStatus for doc in documents]),
        "requestOptions": pack([doc.requestStatus for doc in documents]),
    }


def get_workspace(matter_id: str | None = None) -> DocumentWorkspaceData:
    documents = [doc for doc in _DOCUMENTS if not matter_id or doc.matterId == matter_id]
    return DocumentWorkspaceData(
        documents=deepcopy(documents),
        templates=deepcopy(_TEMPLATES),
        providers=deepcopy(_PROVIDERS),
        facets=_build_facets(documents),
    )


def get_document(document_id: str) -> DocumentRecord | None:
    return next((deepcopy(doc) for doc in _DOCUMENTS if doc.id == document_id), None)


def list_document_versions(document_id: str) -> list[dict]:
    document = next((doc for doc in _DOCUMENTS if doc.id == document_id), None)
    return deepcopy(document.versions) if document else []


def restore_document_version(document_id: str, version_id: str) -> DocumentRecord | None:
    document = next((doc for doc in _DOCUMENTS if doc.id == document_id), None)
    if not document or not any(version.id == version_id for version in document.versions):
        return None
    document.updatedAt = datetime.now(UTC).isoformat().replace("+00:00", "Z")
    return deepcopy(document)


def update_document_metadata(document_id: str, payload: DocumentMetadataUpdate) -> DocumentRecord | None:
    document = next((doc for doc in _DOCUMENTS if doc.id == document_id), None)
    if not document:
        return None
    if payload.title is not None:
        document.title = payload.title
    if payload.document_type is not None:
        document.documentType = payload.document_type
    if payload.tags is not None:
        document.tags = payload.tags
    if payload.is_client_shared is not None:
        document.isClientShared = payload.is_client_shared
    document.updatedAt = datetime.now(UTC).isoformat().replace("+00:00", "Z")
    return deepcopy(document)


def toggle_document_share(document_id: str, is_client_shared: bool) -> DocumentRecord | None:
    return update_document_metadata(document_id, DocumentMetadataUpdate(is_client_shared=is_client_shared))


def update_client_request_state(document_id: str, status: str) -> DocumentRecord | None:
    document = next((doc for doc in _DOCUMENTS if doc.id == document_id), None)
    if not document:
        return None
    document.requestStatus = status
    document.updatedAt = datetime.now(UTC).isoformat().replace("+00:00", "Z")
    return deepcopy(document)


def run_document_analysis(document_id: str) -> DocumentRecord | None:
    document = next((doc for doc in _DOCUMENTS if doc.id == document_id), None)
    if not document:
        return None
    document.aiStatus = "ready"
    if not document.aiReview.flags:
        document.aiReview.flags = [
            {"id": f"{document.id}-flag", "label": "Review extracted date", "detail": "Confirm the extracted date before filing.", "confidence": "medium"}
        ]
    document.aiReview.summary = "AI extraction completed and review items were refreshed."
    document.aiReview.status = "ready"
    document.aiReview.lastAnalyzedAt = datetime.now(UTC).isoformat().replace("+00:00", "Z")
    return deepcopy(document)


def list_templates() -> list[DocumentTemplate]:
    return deepcopy(_TEMPLATES)


def get_template(template_id: str) -> DocumentTemplate | None:
    return next((deepcopy(template) for template in _TEMPLATES if template.id == template_id), None)


def create_template(payload: DocumentTemplateCreateRequest) -> DocumentTemplate:
    template = DocumentTemplate(
        id=f"api-template-{len(_TEMPLATES) + 1:03d}",
        name=payload.name,
        category=payload.category,
        sourceKind=payload.sourceKind,
        status=payload.status,
        ownerName="K. Boateng",
        matterTypes=["Commercial Litigation", "Advisory"],
        practiceAreas=["Commercial"],
        updatedAt=datetime.now(UTC).isoformat().replace("+00:00", "Z"),
        defaultDocumentType="Advice Letter",
        defaultTags=["automation"],
        titlePattern="{{matter.reference}} - Draft",
        supportsInternalGeneration=payload.sourceKind in {"generated", "upload"},
        outputTargets=["word"] if payload.sourceKind == "word" else ["google_docs"] if payload.sourceKind == "google_docs" else ["legalos", "word"],
        sourceFileName=f"{payload.name.lower().replace(' ', '-')}.docx",
        fields=[{"id": "template-field-new", "token": "{{client.name}}", "label": "Client Name", "source": "client.name", "required": True}],
    )
    _TEMPLATES.insert(0, template)
    return deepcopy(template)


def generate_from_template(template_id: str, payload: DocumentTemplateGenerateRequest) -> DocumentRecord | None:
    template = next((item for item in _TEMPLATES if item.id == template_id), None)
    if not template:
        return None
    document = DocumentRecord(
        id=f"api-doc-{len(_DOCUMENTS) + 1:03d}",
        matterId=payload.matterId,
        matterReference=payload.matterId.upper(),
        matterTitle="Generated Matter Draft",
        clientName="Generated Client",
        title=payload.title,
        documentType=template.defaultDocumentType,
        sourceKind="generated" if payload.outputTarget == "legalos" else payload.outputTarget,
        latestVersionNumber=1,
        ocrStatus="complete",
        aiStatus="idle",
        requestStatus="none",
        isClientShared=False,
        tags=template.defaultTags,
        updatedAt=datetime.now(UTC).isoformat().replace("+00:00", "Z"),
        uploadedBy="LegalOS Templates",
        previewSummary=f"Generated from {template.name}.",
        versions=[{"id": f"{template_id}-generated-v1", "versionNumber": 1, "createdAt": datetime.now(UTC).isoformat().replace('+00:00', 'Z'), "createdBy": "LegalOS Templates", "summary": "Generated draft.", "ocrStatus": "complete", "providerRevisionId": None}],
        aiReview={"status": "idle", "summary": "No AI review has run yet.", "flags": [], "lastAnalyzedAt": None},
        providerLink=None,
        activity=[{"id": f"{template_id}-activity", "at": datetime.now(UTC).isoformat().replace('+00:00', 'Z'), "actor": "LegalOS Templates", "detail": f"Generated from {template.name}."}],
    )
    _DOCUMENTS.insert(0, document)
    return deepcopy(document)


def list_provider_statuses() -> list[DocumentProviderStatus]:
    return deepcopy(_PROVIDERS)


def connect_provider(provider: str) -> DocumentProviderStatus | None:
    item = next((entry for entry in _PROVIDERS if entry.provider == provider), None)
    if not item:
        return None
    item.status = "connected"
    item.lastSyncedAt = datetime.now(UTC).isoformat().replace("+00:00", "Z")
    return deepcopy(item)
