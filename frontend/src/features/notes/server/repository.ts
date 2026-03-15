import "server-only";

import { createMockNote, listMockNotesByCase, toggleMockNotePin, updateMockNote } from "@/features/notes/data/mock";
import type { CaseNote } from "@/features/notes/types";

export interface NotesRepository {
  listByCase(caseId: string): Promise<CaseNote[]>;
  create(input: Omit<CaseNote, "id" | "createdAt" | "updatedAt">): Promise<CaseNote>;
  update(id: string, input: Partial<Omit<CaseNote, "id" | "caseId" | "createdAt">>): Promise<CaseNote | null>;
  togglePin(id: string): Promise<CaseNote | null>;
}

const mockNotesRepository: NotesRepository = {
  async listByCase(caseId) {
    return listMockNotesByCase(caseId);
  },
  async create(input) {
    return createMockNote(input);
  },
  async update(id, input) {
    return updateMockNote(id, input);
  },
  async togglePin(id) {
    return toggleMockNotePin(id);
  },
};

export const notesRepository: NotesRepository = mockNotesRepository;
