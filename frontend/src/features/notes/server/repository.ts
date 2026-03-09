import "server-only";

import { createMockNote, listMockNotesByMatter, toggleMockNotePin, updateMockNote } from "@/features/notes/data/mock";
import type { MatterNote } from "@/features/notes/types";

export interface NotesRepository {
  listByMatter(matterId: string): Promise<MatterNote[]>;
  create(input: Omit<MatterNote, "id" | "createdAt" | "updatedAt">): Promise<MatterNote>;
  update(id: string, input: Partial<Omit<MatterNote, "id" | "matterId" | "createdAt">>): Promise<MatterNote | null>;
  togglePin(id: string): Promise<MatterNote | null>;
}

const mockNotesRepository: NotesRepository = {
  async listByMatter(matterId) {
    return listMockNotesByMatter(matterId);
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
