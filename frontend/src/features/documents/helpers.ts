import type {
  ClientRequestStatus,
  DocumentAiStatus,
  DocumentDateFilter,
  DocumentOcrStatus,
  DocumentSourceKind,
  DocumentWorkflowStatus,
} from "./types";

export function deriveDocumentStatus(input: {
  aiStatus: DocumentAiStatus;
  isClientShared: boolean;
  ocrStatus: DocumentOcrStatus;
  requestStatus: ClientRequestStatus;
}): DocumentWorkflowStatus {
  if (input.ocrStatus === "pending" || input.ocrStatus === "processing" || input.aiStatus === "pending") {
    return "processing";
  }

  if (input.ocrStatus === "failed" || input.aiStatus === "failed") {
    return "attention";
  }

  if (input.requestStatus !== "none" && input.requestStatus !== "cancelled") {
    return "client_requested";
  }

  if (input.isClientShared) {
    return "client_shared";
  }

  return "ready";
}

export function inferFileExtension(fileName: string, sourceKind?: DocumentSourceKind): string {
  const extension = fileName.split(".").pop()?.trim().toLowerCase();
  if (extension) {
    return extension;
  }

  if (sourceKind === "word") return "docx";
  if (sourceKind === "google_docs") return "gdoc";
  if (sourceKind === "generated") return "docx";
  return "pdf";
}

export function matchesDateFilter(updatedAt: string, filter: DocumentDateFilter): boolean {
  if (filter === "all") {
    return true;
  }

  const target = new Date(updatedAt);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - target.getTime()) / 86400000);

  if (filter === "today") {
    return now.toDateString() === target.toDateString();
  }

  if (filter === "last_7_days") {
    return diffDays <= 7;
  }

  if (filter === "last_30_days") {
    return diffDays <= 30;
  }

  return diffDays > 30;
}
