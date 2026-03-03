import "server-only";

import { getMockMatterById, listMockMatters } from "@/features/matters/data/mock";
import type { MatterDetail, MatterListItem } from "@/features/matters/types";
import { apiGet } from "@/lib/api";
import { getDataSource } from "@/lib/data-source";

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

export const apiMatterRepository: MatterRepository = {
  async findMatterById(id) {
    return apiGet<MatterDetail | null>(`/api/v1/matters/${id}`, { allowNotFound: true });
  },
  async listMatters() {
    return apiGet<MatterListItem[]>("/api/v1/matters");
  },
};

function createMatterRepository(): MatterRepository {
  return getDataSource() === "api" ? apiMatterRepository : mockMatterRepository;
}

export const matterRepository: MatterRepository = createMatterRepository();
