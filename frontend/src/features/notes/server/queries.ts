import "server-only";

import { cache } from "react";

import type { MatterNote } from "@/features/notes/types";

import { notesRepository } from "./repository";

export const getMatterNotes = cache(async (matterId: string): Promise<MatterNote[]> => {
  return notesRepository.listByMatter(matterId);
});
