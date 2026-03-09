import "server-only";

import { listMockAuditByMatter } from "@/features/audit/data/mock";
import type { AuditApiItem, AuditCategory, AuditEvent, AuditListFilters, AuditSource, PaginatedAuditResult } from "@/features/audit/types";
import { apiGet } from "@/lib/api";
import { getDataSource } from "@/lib/data-source";

export interface AuditRepository {
  listByMatter(matterId: string, filters?: AuditListFilters): Promise<PaginatedAuditResult>;
}

const mockAuditRepository: AuditRepository = {
  async listByMatter(matterId) {
    return listMockAuditByMatter(matterId);
  },
};

const apiAuditRepository: AuditRepository = {
  async listByMatter(matterId) {
    try {
      const items = await apiGet<AuditApiItem[]>(`/api/v1/matters/${matterId}/audit-log`, { allowNotFound: true });
      if (!items) {
        return listMockAuditByMatter(matterId);
      }
      const normalized = items.map((item) => normalizeAuditApiItem(matterId, item));
      return {
        items: normalized,
        page: 1,
        perPage: normalized.length || 25,
        total: normalized.length,
      };
    } catch {
      return listMockAuditByMatter(matterId);
    }
  },
};

export const auditRepository: AuditRepository =
  getDataSource() === "api" ? apiAuditRepository : mockAuditRepository;

function normalizeAuditApiItem(matterId: string, item: AuditApiItem): AuditEvent {
  const diffEntries = buildDiffEntries(item.diff);
  const category = deriveCategory(item.action);
  const source = deriveSource(item.action);

  return {
    id: item.id,
    matterId,
    entityType: item.entity_type,
    entityId: item.entity_id,
    action: item.action,
    category,
    createdAt: item.created_at,
    actorId: null,
    actorLabel: source === "ai" ? "LegalOS AI" : source === "system" ? "System" : "Firm user",
    source,
    diff: item.diff,
    diffEntries,
    summary: buildSummary(item.entity_type, item.action, diffEntries),
    ipAddress: null,
    userAgent: null,
    relatedItems: [],
  };
}

function buildDiffEntries(diff: Record<string, unknown> | null) {
  if (!diff) {
    return [];
  }

  return Object.entries(diff).flatMap(([field, value]) => {
    if (Array.isArray(value) && value.length === 2) {
      return [
        {
          field: prettifyField(field),
          before: stringifyValue(value[0]),
          after: stringifyValue(value[1]),
        },
      ];
    }

    return [
      {
        field: prettifyField(field),
        before: "Not set",
        after: stringifyValue(value),
      },
    ];
  });
}

function buildSummary(entityType: string, action: string, diffEntries: Array<{ field: string; before: string; after: string }>) {
  if (diffEntries.length > 0) {
    const lead = diffEntries[0];
    return `${prettifyField(entityType)} ${action.replace(/_/g, " ")}. ${lead.field} changed from ${lead.before} to ${lead.after}.`;
  }
  return `${prettifyField(entityType)} ${action.replace(/_/g, " ")}.`;
}

function deriveCategory(action: string): AuditCategory {
  const value = action.toLowerCase();
  if (value.includes("share")) return "shared";
  if (value.includes("view")) return "viewed";
  if (value.includes("upload")) return "uploaded";
  if (value.includes("invoice") || value.includes("payment") || value.includes("billing")) return "billing";
  if (value.includes("client")) return "client_activity";
  if (value.includes("ai")) return "ai";
  if (value.includes("create")) return "created";
  return "updated";
}

function deriveSource(action: string): AuditSource {
  const value = action.toLowerCase();
  if (value.includes("client")) return "client";
  if (value.includes("ai")) return "ai";
  if (value.includes("system")) return "system";
  return "firm";
}

function prettifyField(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function stringifyValue(value: unknown) {
  if (value === null || value === undefined) return "Not set";
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}
