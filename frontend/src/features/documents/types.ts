export type DocumentSourceKind = "upload" | "word" | "google_docs" | "generated";
export type DocumentOcrStatus = "pending" | "processing" | "complete" | "failed";
export type DocumentAiStatus = "idle" | "pending" | "ready" | "failed";
export type DocumentSyncStatus = "idle" | "syncing" | "out_of_date" | "error";
export type ClientRequestStatus = "none" | "requested" | "uploaded" | "fulfilled" | "cancelled";
export type DocumentTemplateStatus = "draft" | "active";
export type DocumentOutputTarget = "word" | "google_docs" | "legalos";

export interface DocumentHighlight {
  title?: string[];
  ocrText?: string[];
}

export interface DocumentVersion {
  id: string;
  versionNumber: number;
  createdAt: string;
  createdBy: string;
  summary: string;
  ocrStatus: DocumentOcrStatus;
  providerRevisionId: string | null;
}

export interface DocumentAiFlag {
  id: string;
  label: string;
  detail: string;
  confidence: "low" | "medium" | "high";
}

export interface DocumentAiReview {
  status: DocumentAiStatus;
  summary: string;
  flags: DocumentAiFlag[];
  lastAnalyzedAt: string | null;
}

export interface DocumentActivityItem {
  id: string;
  at: string;
  actor: string;
  detail: string;
}

export interface DocumentProviderLink {
  provider: "word" | "google_docs";
  documentUrl: string | null;
  templateUrl: string | null;
  syncStatus: DocumentSyncStatus;
  lastSyncedAt: string | null;
}

export interface DocumentRecord {
  id: string;
  caseId: string;
  caseReference: string;
  caseTitle: string;
  clientName: string;
  title: string;
  documentType: string;
  sourceKind: DocumentSourceKind;
  latestVersionNumber: number;
  ocrStatus: DocumentOcrStatus;
  aiStatus: DocumentAiStatus;
  requestStatus: ClientRequestStatus;
  isClientShared: boolean;
  tags: string[];
  updatedAt: string;
  uploadedBy: string;
  previewSummary: string;
  highlight?: DocumentHighlight;
  versions: DocumentVersion[];
  aiReview: DocumentAiReview;
  providerLink: DocumentProviderLink | null;
  activity: DocumentActivityItem[];
}

export interface DocumentTemplateField {
  id: string;
  token: string;
  label: string;
  source: string;
  required: boolean;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  category: string;
  sourceKind: Exclude<DocumentSourceKind, "upload"> | "upload";
  status: DocumentTemplateStatus;
  ownerName: string;
  caseTypes: string[];
  practiceAreas: string[];
  updatedAt: string;
  defaultDocumentType: string;
  defaultTags: string[];
  titlePattern: string;
  supportsInternalGeneration: boolean;
  outputTargets: DocumentOutputTarget[];
  sourceFileName: string;
  fields: DocumentTemplateField[];
}

export interface DocumentProviderStatus {
  provider: "word" | "google_docs";
  label: string;
  status: "connected" | "disconnected" | "attention";
  description: string;
  lastSyncedAt: string | null;
}

export interface DocumentSearchFilters {
  query: string;
  caseId: string;
  documentType: string;
  sourceKind: string;
  aiStatus: string;
  ocrStatus: string;
  sharedState: string;
  requestState: string;
}

export interface DocumentFacetOption {
  value: string;
  count: number;
}

export interface DocumentWorkspaceFacets {
  caseOptions: DocumentFacetOption[];
  documentTypeOptions: DocumentFacetOption[];
  sourceOptions: DocumentFacetOption[];
  aiStatusOptions: DocumentFacetOption[];
  requestOptions: DocumentFacetOption[];
}

export interface DocumentWorkspaceData {
  documents: DocumentRecord[];
  templates: DocumentTemplate[];
  providers: DocumentProviderStatus[];
  facets: DocumentWorkspaceFacets;
}
