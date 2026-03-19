import { deriveDocumentStatus, inferFileExtension } from "@/features/documents/helpers";
import type {
  DocumentProviderStatus,
  DocumentRecord,
  DocumentTemplate,
  DocumentWorkflowStatus,
  DocumentWorkspaceData,
  DocumentWorkspaceFacets,
} from "@/features/documents/types";

const providers: DocumentProviderStatus[] = [
  {
    provider: "word",
    label: "Microsoft Word",
    status: "connected",
    description: "Word-authored files can open in the firm workspace.",
    lastSyncedAt: "2026-03-09T08:30:00Z",
  },
  {
    provider: "google_docs",
    label: "Google Docs",
    status: "attention",
    description: "Google-authored files are available with one template recheck pending.",
    lastSyncedAt: "2026-03-08T17:15:00Z",
  },
];

function buildDocumentRecord(
  record: Omit<DocumentRecord, "fileExtension" | "status"> & {
    fileExtension?: string;
    status?: DocumentWorkflowStatus;
  },
): DocumentRecord {
  const fileExtension = record.fileExtension ?? inferFileExtension(record.fileName, record.sourceKind);

  return {
    ...record,
    fileExtension,
    status:
      record.status ??
      deriveDocumentStatus({
        aiStatus: record.aiStatus,
        isClientShared: record.isClientShared,
        ocrStatus: record.ocrStatus,
        requestStatus: record.requestStatus,
      }),
  };
}

const documents: DocumentRecord[] = [
  buildDocumentRecord({
    id: "doc-001",
    caseId: "case-2026-014",
    caseReference: "CAS-2026-014",
    caseTitle: "Asante v. Mensah Industries Ltd",
    clientName: "Asante Holdings Ltd",
    title: "Reply to Notice of Preliminary Objection",
    fileName: "reply-preliminary-objection.docx",
    documentType: "Court Filing",
    sourceKind: "word",
    latestVersionNumber: 3,
    ocrStatus: "complete",
    aiStatus: "ready",
    requestStatus: "none",
    isClientShared: false,
    tags: ["litigation", "filing", "urgent"],
    updatedAt: "2026-03-09T10:00:00Z",
    uploadedBy: "Kwame Boateng",
    previewSummary: "Final reply draft prepared for filing.",
    highlight: {
      title: ["Reply", "Preliminary Objection"],
      ocrText: ["reply deadline", "hearing date"],
    },
    versions: [
      {
        id: "doc-001-v3",
        versionNumber: 3,
        createdAt: "2026-03-09T10:00:00Z",
        createdBy: "Kwame Boateng",
        summary: "Counsel edits and final pre-filing review.",
        ocrStatus: "complete",
        providerRevisionId: "word-rev-3",
      },
      {
        id: "doc-001-v2",
        versionNumber: 2,
        createdAt: "2026-03-08T16:30:00Z",
        createdBy: "Ama Osei",
        summary: "Inserted authorities and corrected suit references.",
        ocrStatus: "complete",
        providerRevisionId: "word-rev-2",
      },
    ],
    aiReview: {
      status: "ready",
      summary: "Deadlines were extracted in the background.",
      flags: [
        {
          id: "ai-001",
          label: "Reply deadline",
          detail: "Reply must be filed by 11 Mar 2026 before noon.",
          confidence: "high",
        },
      ],
      lastAnalyzedAt: "2026-03-09T10:05:00Z",
    },
    providerLink: {
      provider: "word",
      documentUrl: "https://example.com/word/doc-001",
      templateUrl: "https://example.com/word/template-litigation-reply",
      syncStatus: "idle",
      lastSyncedAt: "2026-03-09T10:02:00Z",
    },
    activity: [
      {
        id: "activity-001",
        at: "2026-03-09T10:05:00Z",
        actor: "LegalOS AI",
        detail: "Deadlines were extracted for internal review.",
      },
      {
        id: "activity-002",
        at: "2026-03-09T10:00:00Z",
        actor: "Kwame Boateng",
        detail: "Version 3 saved from Microsoft Word.",
      },
    ],
  }),
  buildDocumentRecord({
    id: "doc-002",
    caseId: "case-2026-014",
    caseReference: "CAS-2026-014",
    caseTitle: "Asante v. Mensah Industries Ltd",
    clientName: "Asante Holdings Ltd",
    title: "Scanned Court Notice - 7 March",
    fileName: "court-notice-7-march.pdf",
    documentType: "Court Notice",
    sourceKind: "upload",
    latestVersionNumber: 1,
    ocrStatus: "processing",
    aiStatus: "pending",
    requestStatus: "none",
    isClientShared: false,
    tags: ["court notice", "scan"],
    updatedAt: "2026-03-09T08:45:00Z",
    uploadedBy: "Naa Korkor Abbey",
    previewSummary: "Registry scan queued for OCR and extraction.",
    versions: [
      {
        id: "doc-002-v1",
        versionNumber: 1,
        createdAt: "2026-03-09T08:45:00Z",
        createdBy: "Naa Korkor Abbey",
        summary: "Original registry scan uploaded.",
        ocrStatus: "processing",
        providerRevisionId: null,
      },
    ],
    aiReview: {
      status: "pending",
      summary: "Waiting for OCR before background extraction starts.",
      flags: [],
      lastAnalyzedAt: null,
    },
    providerLink: null,
    activity: [
      {
        id: "activity-003",
        at: "2026-03-09T08:46:00Z",
        actor: "LegalOS OCR",
        detail: "OCR job started for the uploaded scan.",
      },
    ],
  }),
  buildDocumentRecord({
    id: "doc-003",
    caseId: "case-2026-011",
    caseReference: "CAS-2026-011",
    caseTitle: "Darko Family Estate Administration",
    clientName: "Esi Darko",
    title: "Estate Inventory Update",
    fileName: "estate-inventory-update.docx",
    documentType: "Client Update",
    sourceKind: "google_docs",
    latestVersionNumber: 2,
    ocrStatus: "complete",
    aiStatus: "idle",
    requestStatus: "requested",
    isClientShared: true,
    tags: ["estate", "client update"],
    updatedAt: "2026-03-08T15:20:00Z",
    uploadedBy: "Ama Osei",
    previewSummary: "Client-facing estate summary with follow-up request.",
    versions: [
      {
        id: "doc-003-v2",
        versionNumber: 2,
        createdAt: "2026-03-08T15:20:00Z",
        createdBy: "Ama Osei",
        summary: "Updated asset schedule and client summary.",
        ocrStatus: "complete",
        providerRevisionId: "gdoc-rev-2",
      },
    ],
    aiReview: {
      status: "idle",
      summary: "No additional AI review required.",
      flags: [],
      lastAnalyzedAt: null,
    },
    providerLink: {
      provider: "google_docs",
      documentUrl: "https://example.com/google/doc-003",
      templateUrl: "https://example.com/google/template-estate-update",
      syncStatus: "idle",
      lastSyncedAt: "2026-03-08T15:25:00Z",
    },
    activity: [
      {
        id: "activity-004",
        at: "2026-03-08T15:25:00Z",
        actor: "Ama Osei",
        detail: "Shared latest client update and requested signed inventory support.",
      },
    ],
  }),
  buildDocumentRecord({
    id: "doc-004",
    caseId: "case-2026-009",
    caseReference: "CAS-2026-009",
    caseTitle: "Volta Ridge Land Transfer",
    clientName: "Volta Ridge Developers",
    title: "Transfer Completion Briefing Deck",
    fileName: "transfer-completion-briefing-deck.pptx",
    documentType: "Closing Brief",
    sourceKind: "upload",
    latestVersionNumber: 1,
    ocrStatus: "complete",
    aiStatus: "idle",
    requestStatus: "none",
    isClientShared: true,
    tags: ["property", "deck", "closing"],
    updatedAt: "2026-03-07T18:05:00Z",
    uploadedBy: "Kweku Biney",
    previewSummary: "Briefing deck prepared for the closing meeting.",
    versions: [
      {
        id: "doc-004-v1",
        versionNumber: 1,
        createdAt: "2026-03-07T18:05:00Z",
        createdBy: "Kweku Biney",
        summary: "Closing deck exported for client review.",
        ocrStatus: "complete",
        providerRevisionId: null,
      },
    ],
    aiReview: {
      status: "idle",
      summary: "Slides were indexed automatically.",
      flags: [],
      lastAnalyzedAt: null,
    },
    providerLink: null,
    activity: [
      {
        id: "activity-005",
        at: "2026-03-07T18:06:00Z",
        actor: "Kweku Biney",
        detail: "Deck shared ahead of the transfer completion call.",
      },
    ],
  }),
  buildDocumentRecord({
    id: "doc-005",
    caseId: "case-2026-003",
    caseReference: "CAS-2026-003",
    caseTitle: "Tema Port Customs Appeal",
    clientName: "Harbourline Imports",
    title: "Customs Appeal Bundle",
    fileName: "customs-appeal-bundle.pdf",
    documentType: "Appeal Bundle",
    sourceKind: "upload",
    latestVersionNumber: 4,
    ocrStatus: "complete",
    aiStatus: "failed",
    requestStatus: "none",
    isClientShared: false,
    tags: ["appeal", "bundle", "customs"],
    updatedAt: "2026-03-06T14:10:00Z",
    uploadedBy: "Naa Korkor Abbey",
    previewSummary: "Signature pages need manual follow-up after extraction failed.",
    versions: [
      {
        id: "doc-005-v4",
        versionNumber: 4,
        createdAt: "2026-03-06T14:10:00Z",
        createdBy: "Naa Korkor Abbey",
        summary: "Merged exhibits and resubmitted the appeal pack.",
        ocrStatus: "complete",
        providerRevisionId: null,
      },
    ],
    aiReview: {
      status: "failed",
      summary: "Signature pages blocked extraction and need manual review.",
      flags: [],
      lastAnalyzedAt: "2026-03-06T14:18:00Z",
    },
    providerLink: null,
    activity: [
      {
        id: "activity-006",
        at: "2026-03-06T14:18:00Z",
        actor: "LegalOS AI",
        detail: "Extraction flagged unreadable signature pages for follow-up.",
      },
    ],
  }),
  buildDocumentRecord({
    id: "doc-006",
    caseId: "case-2026-006",
    caseReference: "CAS-2026-006",
    caseTitle: "CediCore Vendor Debt Recovery",
    clientName: "CediCore Systems",
    title: "Demand Letter Draft",
    fileName: "demand-letter-vendor.gdoc",
    documentType: "Demand Letter",
    sourceKind: "google_docs",
    latestVersionNumber: 2,
    ocrStatus: "complete",
    aiStatus: "ready",
    requestStatus: "none",
    isClientShared: false,
    tags: ["demand", "debt recovery"],
    updatedAt: "2026-03-05T09:50:00Z",
    uploadedBy: "Kwame Boateng",
    previewSummary: "Google-authored demand letter awaiting dispatch approval.",
    versions: [
      {
        id: "doc-006-v2",
        versionNumber: 2,
        createdAt: "2026-03-05T09:50:00Z",
        createdBy: "Kwame Boateng",
        summary: "Updated payment timeline and settlement warning.",
        ocrStatus: "complete",
        providerRevisionId: "gdoc-rev-2",
      },
    ],
    aiReview: {
      status: "ready",
      summary: "Names and dates were indexed automatically.",
      flags: [],
      lastAnalyzedAt: "2026-03-05T09:52:00Z",
    },
    providerLink: {
      provider: "google_docs",
      documentUrl: "https://example.com/google/doc-006",
      templateUrl: "https://example.com/google/template-demand-letter",
      syncStatus: "idle",
      lastSyncedAt: "2026-03-05T09:54:00Z",
    },
    activity: [
      {
        id: "activity-007",
        at: "2026-03-05T09:54:00Z",
        actor: "Kwame Boateng",
        detail: "Draft synced to Google Docs for final edits.",
      },
    ],
  }),
];

const templates: DocumentTemplate[] = [
  {
    id: "tpl-001",
    name: "Litigation Reply Pack",
    category: "Litigation",
    sourceKind: "word",
    status: "active",
    ownerName: "Kwame Boateng",
    caseTypes: ["Commercial Litigation", "Debt Recovery"],
    practiceAreas: ["Dispute Resolution", "Commercial"],
    updatedAt: "2026-03-08T16:00:00Z",
    defaultDocumentType: "Court Filing",
    defaultTags: ["litigation", "reply"],
    titlePattern: "{{case.reference}} - Reply Draft",
    supportsInternalGeneration: false,
    outputTargets: ["word"],
    sourceFileName: "litigation-reply.dotx",
    fields: [
      { id: "field-001", token: "{{case.reference}}", label: "Case Reference", source: "case.reference", required: true },
      { id: "field-002", token: "{{client.name}}", label: "Client Name", source: "client.name", required: true },
    ],
  },
  {
    id: "tpl-002",
    name: "Estate Update Memo",
    category: "Client Update",
    sourceKind: "google_docs",
    status: "active",
    ownerName: "Ama Osei",
    caseTypes: ["Probate"],
    practiceAreas: ["Estates"],
    updatedAt: "2026-03-07T11:00:00Z",
    defaultDocumentType: "Client Update",
    defaultTags: ["estate", "update"],
    titlePattern: "{{client.name}} - Estate Update",
    supportsInternalGeneration: false,
    outputTargets: ["google_docs"],
    sourceFileName: "estate-update-template.gdoc",
    fields: [
      { id: "field-003", token: "{{client.name}}", label: "Client Name", source: "client.name", required: true },
      { id: "field-004", token: "{{case.title}}", label: "Case Title", source: "case.title", required: true },
    ],
  },
  {
    id: "tpl-003",
    name: "Property Transfer Summary",
    category: "Property",
    sourceKind: "generated",
    status: "draft",
    ownerName: "Kweku Biney",
    caseTypes: ["Conveyancing"],
    practiceAreas: ["Property"],
    updatedAt: "2026-03-05T09:00:00Z",
    defaultDocumentType: "Closing Brief",
    defaultTags: ["property", "briefing"],
    titlePattern: "{{case.reference}} - Transfer Summary",
    supportsInternalGeneration: true,
    outputTargets: ["legalos", "word"],
    sourceFileName: "property-transfer-summary.docx",
    fields: [
      { id: "field-005", token: "{{case.title}}", label: "Case Title", source: "case.title", required: true },
      { id: "field-006", token: "{{today.long}}", label: "Generation Date", source: "today.long", required: true },
    ],
  },
];

function buildFacetOptions(values: string[]): Array<{ value: string; count: number }> {
  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  return Array.from(counts.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => a.value.localeCompare(b.value));
}

function buildFacets(items: DocumentRecord[]): DocumentWorkspaceFacets {
  return {
    caseOptions: buildFacetOptions(items.map((item) => `${item.caseId}::${item.caseReference}`)),
    statusOptions: buildFacetOptions(items.map((item) => item.status)),
  };
}

function cloneDocument(item: DocumentRecord): DocumentRecord {
  return {
    ...item,
    tags: [...item.tags],
    versions: item.versions.map((version) => ({ ...version })),
    aiReview: {
      ...item.aiReview,
      flags: item.aiReview.flags.map((flag) => ({ ...flag })),
    },
    providerLink: item.providerLink ? { ...item.providerLink } : null,
    activity: item.activity.map((entry) => ({ ...entry })),
    highlight: item.highlight
      ? {
          title: item.highlight.title ? [...item.highlight.title] : undefined,
          ocrText: item.highlight.ocrText ? [...item.highlight.ocrText] : undefined,
        }
      : undefined,
  };
}

export function getDocumentWorkspaceData(): DocumentWorkspaceData {
  return {
    documents: documents.map(cloneDocument),
    templates: templates.map((item) => ({
      ...item,
      caseTypes: [...item.caseTypes],
      practiceAreas: [...item.practiceAreas],
      defaultTags: [...item.defaultTags],
      outputTargets: [...item.outputTargets],
      fields: item.fields.map((field) => ({ ...field })),
    })),
    providers: providers.map((item) => ({ ...item })),
    facets: buildFacets(documents),
  };
}

export function getCaseDocumentWorkspaceData(caseId: string): DocumentWorkspaceData {
  const workspace = getDocumentWorkspaceData();
  const filteredDocuments = workspace.documents.filter((item) => item.caseId === caseId);

  return {
    ...workspace,
    documents: filteredDocuments,
    facets: buildFacets(filteredDocuments),
  };
}
