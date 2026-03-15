export type NoteVisibility = "firm_only";
export type NoteSource = "manual" | "ai_draft" | "imported";

export interface NoteRelatedItem {
  entityType: "task" | "document" | "invoice" | "event";
  entityId: string;
  label: string;
}

export interface CaseNote {
  id: string;
  caseId: string;
  title: string;
  body: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
  visibility: NoteVisibility;
  tags: string[];
  source: NoteSource;
  relatedItems: NoteRelatedItem[];
  reviewedAt?: string | null;
}
