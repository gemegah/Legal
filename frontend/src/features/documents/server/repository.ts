import { getCaseDocumentWorkspaceData, getDocumentWorkspaceData } from "@/features/documents/data/mock";
import type { DocumentWorkspaceData } from "@/features/documents/types";
import { apiGet } from "@/lib/api";
import { getDataSource } from "@/lib/data-source";

interface DocumentsRepository {
  getWorkspace(): Promise<DocumentWorkspaceData>;
  getCaseWorkspace(caseId: string): Promise<DocumentWorkspaceData>;
}

const mockDocumentsRepository: DocumentsRepository = {
  async getWorkspace() {
    return getDocumentWorkspaceData();
  },
  async getCaseWorkspace(caseId: string) {
    return getCaseDocumentWorkspaceData(caseId);
  },
};

const apiDocumentsRepository: DocumentsRepository = {
  async getWorkspace() {
    return apiGet<DocumentWorkspaceData>("/api/v1/documents/workspace");
  },
  async getCaseWorkspace(caseId: string) {
    return apiGet<DocumentWorkspaceData>(`/api/v1/documents/workspace?case_id=${caseId}`);
  },
};

export const documentsRepository =
  getDataSource() === "api" ? apiDocumentsRepository : mockDocumentsRepository;
