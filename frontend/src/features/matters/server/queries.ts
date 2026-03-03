import "server-only";

import { cache } from "react";

import { computeMatterWorkspaceStats } from "@/features/matters/stats";
import type { MatterDetail, MatterListItem, MatterWorkspaceStats } from "@/features/matters/types";

import { matterRepository } from "./repository";

export const getMatterById = cache(async (id: string): Promise<MatterDetail | null> => {
  if (!id) {
    return null;
  }

  return matterRepository.findMatterById(id);
});

export const getMatterWorkspace = cache(
  async (): Promise<{ matters: MatterListItem[]; stats: MatterWorkspaceStats }> => {
    const matters = await matterRepository.listMatters();

    return {
      matters,
      stats: computeMatterWorkspaceStats(matters),
    };
  },
);
