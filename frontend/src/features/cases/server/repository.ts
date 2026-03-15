import "server-only";

import { getMockCaseById, listMockCases } from "@/features/cases/data/mock";
import type { CaseDetail, CaseListItem } from "@/features/cases/types";
import { apiGet } from "@/lib/api";
import { getDataSource } from "@/lib/data-source";

export interface CaseRepository {
  findCaseById(id: string): Promise<CaseDetail | null>;
  listCases(): Promise<CaseListItem[]>;
}

export const mockCaseRepository: CaseRepository = {
  async findCaseById(id) {
    return getMockCaseById(id);
  },
  async listCases() {
    return listMockCases();
  },
};

export const apiCaseRepository: CaseRepository = {
  async findCaseById(id) {
    return apiGet<CaseDetail | null>(`/api/v1/cases/${id}`, { allowNotFound: true });
  },
  async listCases() {
    return apiGet<CaseListItem[]>("/api/v1/cases");
  },
};

function createCaseRepository(): CaseRepository {
  return getDataSource() === "api" ? apiCaseRepository : mockCaseRepository;
}

export const caseRepository: CaseRepository = createCaseRepository();
