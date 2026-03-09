import { getMatterDocumentWorkspaceData, getDocumentWorkspaceData } from "@/features/documents/data/mock";
import type { DocumentWorkspaceData } from "@/features/documents/types";
import { apiGet } from "@/lib/api";
import { getDataSource } from "@/lib/data-source";

interface DocumentsRepository {
  getWorkspace(): Promise<DocumentWorkspaceData>;
  getMatterWorkspace(matterId: string): Promise<DocumentWorkspaceData>;
}

const mockDocumentsRepository: DocumentsRepository = {
  async getWorkspace() {
    return getDocumentWorkspaceData();
  },
  async getMatterWorkspace(matterId: string) {
    return getMatterDocumentWorkspaceData(matterId);
  },
};

const apiDocumentsRepository: DocumentsRepository = {
  async getWorkspace() {
    return apiGet<DocumentWorkspaceData>("/api/v1/documents/workspace");
  },
  async getMatterWorkspace(matterId: string) {
    return apiGet<DocumentWorkspaceData>(`/api/v1/documents/workspace?matter_id=${matterId}`);
  },
};

export const documentsRepository =
  getDataSource() === "api" ? apiDocumentsRepository : mockDocumentsRepository;
