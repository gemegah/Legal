import "server-only";

import { cache } from "react";

import type { AuditListFilters, PaginatedAuditResult } from "@/features/audit/types";

import { auditRepository } from "./repository";

export const getCaseAudit = cache(async (caseId: string, filters?: AuditListFilters): Promise<PaginatedAuditResult> => {
  return auditRepository.listByCase(caseId, filters);
});
