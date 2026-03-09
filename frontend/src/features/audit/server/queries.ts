import "server-only";

import { cache } from "react";

import type { AuditListFilters, PaginatedAuditResult } from "@/features/audit/types";

import { auditRepository } from "./repository";

export const getMatterAudit = cache(async (matterId: string, filters?: AuditListFilters): Promise<PaginatedAuditResult> => {
  return auditRepository.listByMatter(matterId, filters);
});
