import "server-only";

import { cache } from "react";

import type { CaseNote } from "@/features/notes/types";

import { notesRepository } from "./repository";

export const getCaseNotes = cache(async (caseId: string): Promise<CaseNote[]> => {
  return notesRepository.listByCase(caseId);
});
