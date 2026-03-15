import "server-only";

import { cache } from "react";

import type { DocumentWorkspaceData } from "@/features/documents/types";

import { documentsRepository } from "./repository";

export const getDocumentWorkspace = cache(async (): Promise<DocumentWorkspaceData> => {
  return documentsRepository.getWorkspace();
});

export const getCaseDocumentWorkspace = cache(async (caseId: string): Promise<DocumentWorkspaceData> => {
  return documentsRepository.getCaseWorkspace(caseId);
});
