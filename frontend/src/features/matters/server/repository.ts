import "server-only";

import { getMockMatterById, listMockMatters } from "@/features/matters/data/mock";
import type { MatterDetail, MatterListItem } from "@/features/matters/types";

export interface MatterRepository {
  findMatterById(id: string): Promise<MatterDetail | null>;
  listMatters(): Promise<MatterListItem[]>;
}

export const mockMatterRepository: MatterRepository = {
  async findMatterById(id) {
    return getMockMatterById(id);
  },
  async listMatters() {
    return listMockMatters();
  },
};

export const matterRepository: MatterRepository = mockMatterRepository;
