export type AuditSource = "firm" | "client" | "system" | "ai";
export type AuditCategory =
  | "created"
  | "updated"
  | "shared"
  | "viewed"
  | "uploaded"
  | "billing"
  | "client_activity"
  | "ai";

export interface AuditDiffEntry {
  field: string;
  before: string;
  after: string;
}

export interface AuditRelatedItem {
  label: string;
  href: string;
}

export interface AuditEvent {
  id: number;
  matterId: string;
  entityType: string;
  entityId: string;
  action: string;
  category: AuditCategory;
  createdAt: string;
  actorId: string | null;
  actorLabel: string;
  source: AuditSource;
  diff: Record<string, unknown> | null;
  diffEntries: AuditDiffEntry[];
  summary: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  relatedItems: AuditRelatedItem[];
}

export interface AuditListFilters {
  action?: string;
}

export interface PaginatedAuditResult {
  items: AuditEvent[];
  page: number;
  perPage: number;
  total: number;
}

export interface AuditApiItem {
  id: number;
  entity_type: string;
  entity_id: string;
  action: string;
  diff: Record<string, unknown> | null;
  created_at: string;
}
