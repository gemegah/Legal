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
    UploadConfirmRequest,
    UploadInitiateRequest,
)


def _now() -> str:
    return datetime.now(UTC).isoformat().replace("+00:00", "Z")


def _infer_extension(file_name: str, source_kind: str) -> str:
    parts = file_name.rsplit(".", 1)
    if len(parts) == 2 and parts[1]:
        return parts[1].lower()
    if source_kind == "word":
        return "docx"
    if source_kind == "google_docs":
        return "gdoc"
    if source_kind == "generated":
        return "docx"
    return "pdf"


def _derive_status(*, ai_status: str, is_client_shared: bool, ocr_status: str, request_status: str) -> str:
    if ocr_status in {"pending", "processing"} or ai_status == "pending":
        return "processing"
    if ocr_status == "failed" or ai_status == "failed":
        return "attention"
    if request_status not in {"none", "cancelled"}:
        return "client_requested"
    if is_client_shared:
        return "client_shared"
    return "ready"


def _case_seed(case_id: str) -> tuple[str, str]:
    cases = {
        "case-0041": ("Asante v. Mensah Industries Ltd", "Akosua Asante"),
        "case-0039": ("Re: Accra Properties Ltd Acquisition", "Accra Properties Ltd"),
        "case-0038": ("Darko Family Estate Administration", "Esi Darko"),
    }
    return cases.get(case_id, ("Generated Case Draft", "Generated Client"))


def _format_case_reference(case_id: str) -> str:
    return case_id.replace("case-", "CAS-", 1)


def _build_document(record: dict) -> DocumentRecord:
    file_name = record["fileName"]
    source_kind = record["sourceKind"]
    ocr_status = record["ocrStatus"]
    ai_status = record["aiStatus"]
    request_status = record["requestStatus"]
    is_client_shared = record["isClientShared"]

    return DocumentRecord(
        **record,
        fileExtension=record.get("fileExtension") or _infer_extension(file_name, source_kind),
        status=record.get("status")
        or _derive_status(
            ai_status=ai_status,
            is_client_shared=is_client_shared,
            ocr_status=ocr_status,
            request_status=request_status,
        ),
    )


_DOCUMENTS: list[DocumentRecord] = [
    _build_document(
        {
            "id": "api-doc-001",
            "caseId": "case-0041",
            "caseReference": "CAS-0041",
            "caseTitle": "Asante v. Mensah Industries Ltd",
            "clientName": "Akosua Asante",
            "title": "Reply to Notice of Preliminary Objection",
            "fileName": "reply-preliminary-objection.docx",
            "documentType": "Court Filing",
            "sourceKind": "word",
            "latestVersionNumber": 3,
            "ocrStatus": "complete",
            "aiStatus": "ready",
            "requestStatus": "none",
            "isClientShared": False,
            "tags": ["litigation", "reply", "urgent"],
            "updatedAt": "2026-03-09T10:00:00Z",
            "uploadedBy": "K. Boateng",
            "previewSummary": "Provider-authored draft prepared for filing.",
            "versions": [
                {"id": "api-doc-001-v3", "versionNumber": 3, "createdAt": "2026-03-09T10:00:00Z", "createdBy": "K. Boateng", "summary": "Pre-filing review saved.", "ocrStatus": "complete", "providerRevisionId": "word-rev-3"},
                {"id": "api-doc-001-v2", "versionNumber": 2, "createdAt": "2026-03-08T16:30:00Z", "createdBy": "A. Owusu", "summary": "Authorities inserted.", "ocrStatus": "complete", "providerRevisionId": "word-rev-2"},
            ],
            "aiReview": {
                "status": "ready",
                "summary": "Deadlines were extracted in the background.",
                "flags": [
                    {"id": "api-flag-1", "label": "Reply deadline", "detail": "Reply must be filed by 11 Mar 2026.", "confidence": "high"},
                    {"id": "api-flag-2", "label": "Hearing date", "detail": "Case is listed for 15 Mar 2026.", "confidence": "high"},
                ],
                "lastAnalyzedAt": "2026-03-09T10:05:00Z",
            },
            "providerLink": {"provider": "word", "documentUrl": "https://example.com/word/doc-001", "templateUrl": "https://example.com/word/template-litigation", "syncStatus": "idle", "lastSyncedAt": "2026-03-09T10:02:00Z"},
            "activity": [{"id": "api-activity-1", "at": "2026-03-09T10:05:00Z", "actor": "LegalOS AI", "detail": "Deadline extraction completed."}],
        }
    ),
    _build_document(
        {
            "id": "api-doc-002",
            "caseId": "case-0039",
            "caseReference": "CAS-0039",
            "caseTitle": "Re: Accra Properties Ltd Acquisition",
            "clientName": "Accra Properties Ltd",
            "title": "Executed Transfer Deed",
            "fileName": "executed-transfer-deed.pdf",
            "documentType": "Executed Deed",
            "sourceKind": "generated",
            "latestVersionNumber": 2,
            "ocrStatus": "complete",
            "aiStatus": "failed",
            "requestStatus": "requested",
            "isClientShared": True,
            "tags": ["property", "signed"],
            "updatedAt": "2026-03-08T12:00:00Z",
            "uploadedBy": "A. Owusu",
            "previewSummary": "Generated deed package with a client request still outstanding.",
            "versions": [
                {"id": "api-doc-002-v2", "versionNumber": 2, "createdAt": "2026-03-08T12:00:00Z", "createdBy": "A. Owusu", "summary": "Executed deed uploaded.", "ocrStatus": "complete", "providerRevisionId": None},
            ],
            "aiReview": {"status": "failed", "summary": "Unreadable signature page blocked extraction.", "flags": [], "lastAnalyzedAt": "2026-03-08T12:10:00Z"},
            "providerLink": None,
            "activity": [{"id": "api-activity-2", "at": "2026-03-08T12:10:00Z", "actor": "LegalOS AI", "detail": "Analysis failed and needs manual follow-up."}],
        }
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
        caseTypes=["Commercial Litigation"],
        practiceAreas=["Litigation"],
        updatedAt="2026-03-08T16:00:00Z",
        defaultDocumentType="Court Filing",
        defaultTags=["litigation", "reply"],
        titlePattern="{{case.reference}} - Reply Draft",
        supportsInternalGeneration=False,
        outputTargets=["word"],
        sourceFileName="litigation-reply.dotx",
        fields=[
            {"id": "template-field-1", "token": "{{case.reference}}", "label": "Case Reference", "source": "case.reference", "required": True},
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
        "caseOptions": pack([f"{doc.caseId}::{doc.caseReference}" for doc in documents]),
        "statusOptions": pack([doc.status for doc in documents]),
    }


def get_workspace(case_id: str | None = None) -> DocumentWorkspaceData:
    documents = [doc for doc in _DOCUMENTS if not case_id or doc.caseId == case_id]
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
    document.updatedAt = _now()
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
    document.status = _derive_status(
        ai_status=document.aiStatus,
        is_client_shared=document.isClientShared,
        ocr_status=document.ocrStatus,
        request_status=document.requestStatus,
    )
    document.updatedAt = _now()
    return deepcopy(document)


def toggle_document_share(document_id: str, is_client_shared: bool) -> DocumentRecord | None:
    return update_document_metadata(document_id, DocumentMetadataUpdate(is_client_shared=is_client_shared))


def update_client_request_state(document_id: str, status: str) -> DocumentRecord | None:
    document = next((doc for doc in _DOCUMENTS if doc.id == document_id), None)
    if not document:
        return None
    document.requestStatus = status
    document.status = _derive_status(
        ai_status=document.aiStatus,
        is_client_shared=document.isClientShared,
        ocr_status=document.ocrStatus,
        request_status=document.requestStatus,
    )
    document.updatedAt = _now()
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
    document.aiReview.lastAnalyzedAt = _now()
    document.status = _derive_status(
        ai_status=document.aiStatus,
        is_client_shared=document.isClientShared,
        ocr_status=document.ocrStatus,
        request_status=document.requestStatus,
    )
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
        caseTypes=["Commercial Litigation", "Advisory"],
        practiceAreas=["Commercial"],
        updatedAt=_now(),
        defaultDocumentType="Advice Letter",
        defaultTags=["automation"],
        titlePattern="{{case.reference}} - Draft",
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
    case_title, client_name = _case_seed(payload.caseId)
    document = _build_document(
        {
            "id": f"api-doc-{len(_DOCUMENTS) + 1:03d}",
            "caseId": payload.caseId,
            "caseReference": _format_case_reference(payload.caseId),
            "caseTitle": case_title,
            "clientName": client_name,
            "title": payload.title,
            "fileName": f"{payload.title.lower().replace(' ', '-')}.docx",
            "documentType": template.defaultDocumentType,
            "sourceKind": "generated" if payload.outputTarget == "legalos" else payload.outputTarget,
            "latestVersionNumber": 1,
            "ocrStatus": "complete",
            "aiStatus": "idle",
            "requestStatus": "none",
            "isClientShared": False,
            "tags": template.defaultTags,
            "updatedAt": _now(),
            "uploadedBy": "LegalOS Templates",
            "previewSummary": f"Generated from {template.name}.",
            "versions": [{"id": f"{template_id}-generated-v1", "versionNumber": 1, "createdAt": _now(), "createdBy": "LegalOS Templates", "summary": "Generated draft.", "ocrStatus": "complete", "providerRevisionId": None}],
            "aiReview": {"status": "idle", "summary": "No AI review has run yet.", "flags": [], "lastAnalyzedAt": None},
            "providerLink": None,
            "activity": [{"id": f"{template_id}-activity", "at": _now(), "actor": "LegalOS Templates", "detail": f"Generated from {template.name}."}],
        }
    )
    _DOCUMENTS.insert(0, document)
    return deepcopy(document)


def initiate_document_upload(case_id: str, payload: UploadInitiateRequest) -> tuple[str, str]:
    case_title, client_name = _case_seed(case_id)
    document_id = f"api-doc-{len(_DOCUMENTS) + 1:03d}"
    timestamp = _now()
    pending = _build_document(
        {
            "id": document_id,
            "caseId": case_id,
            "caseReference": _format_case_reference(case_id),
            "caseTitle": case_title,
            "clientName": client_name,
            "title": payload.title,
            "fileName": payload.file_name,
            "documentType": payload.document_type,
            "sourceKind": "upload",
            "latestVersionNumber": 1,
            "ocrStatus": "pending",
            "aiStatus": "pending",
            "requestStatus": "none",
            "isClientShared": False,
            "tags": [],
            "updatedAt": timestamp,
            "uploadedBy": "K. Boateng",
            "previewSummary": "Upload queued for background processing.",
            "versions": [{"id": f"{document_id}-v1", "versionNumber": 1, "createdAt": timestamp, "createdBy": "K. Boateng", "summary": "Upload queued.", "ocrStatus": "pending", "providerRevisionId": None}],
            "aiReview": {"status": "pending", "summary": "Background extraction will start after upload confirmation.", "flags": [], "lastAnalyzedAt": None},
            "providerLink": None,
            "activity": [{"id": f"{document_id}-activity", "at": timestamp, "actor": "K. Boateng", "detail": "Upload was queued from the practitioner workspace."}],
        }
    )
    _DOCUMENTS.insert(0, pending)
    storage_key = f"firms/demo/cases/{case_id}/documents/{payload.file_name}"
    return document_id, storage_key


def confirm_document_upload(case_id: str, doc_id: str, payload: UploadConfirmRequest) -> tuple[str, str] | None:
    document = next((doc for doc in _DOCUMENTS if doc.id == doc_id and doc.caseId == case_id), None)
    if not document:
        return None
    document.ocrStatus = "processing"
    document.aiStatus = "pending"
    document.status = _derive_status(
        ai_status=document.aiStatus,
        is_client_shared=document.isClientShared,
        ocr_status=document.ocrStatus,
        request_status=document.requestStatus,
    )
    document.updatedAt = _now()
    document.previewSummary = "Upload confirmed and background OCR is now processing."
    document.activity.insert(0, {"id": f"{doc_id}-confirm", "at": _now(), "actor": "LegalOS OCR", "detail": "Upload confirmed and OCR queued."})
    if document.versions:
        document.versions[0].summary = "Initial upload confirmed."
        document.versions[0].ocrStatus = "processing"
    return document.id, document.versions[0].id if document.versions else f"{doc_id}-v1"


def list_provider_statuses() -> list[DocumentProviderStatus]:
    return deepcopy(_PROVIDERS)


def connect_provider(provider: str) -> DocumentProviderStatus | None:
    item = next((entry for entry in _PROVIDERS if entry.provider == provider), None)
    if not item:
        return None
    item.status = "connected"
    item.lastSyncedAt = _now()
    return deepcopy(item)
