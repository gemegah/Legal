import "server-only";

import { cache } from "react";

import { computeCaseWorkspaceStats } from "@/features/cases/stats";
import type { CaseDetail, CaseListItem, CaseWorkspaceStats } from "@/features/cases/types";

import { caseRepository } from "./repository";

export const getCaseById = cache(async (id: string): Promise<CaseDetail | null> => {
  if (!id) {
    return null;
  }

  return caseRepository.findCaseById(id);
});

export const getCaseWorkspace = cache(
  async (): Promise<{ cases: CaseListItem[]; stats: CaseWorkspaceStats }> => {
    const cases = await caseRepository.listCases();

    return {
      cases,
      stats: computeCaseWorkspaceStats(cases),
    };
  },
);
