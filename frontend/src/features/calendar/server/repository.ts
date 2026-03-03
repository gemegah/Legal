import "server-only";

import { listMockEvents, listMockEventsByMatter } from "@/features/calendar/data/mock";
import type { CalendarEventItem } from "@/features/calendar/types";
import { getDataSource } from "@/lib/data-source";

export interface EventRepository {
  listEvents(): Promise<CalendarEventItem[]>;
  listEventsByMatter(matterId: string): Promise<CalendarEventItem[]>;
}

export const mockEventRepository: EventRepository = {
  async listEvents() {
    return listMockEvents();
  },
  async listEventsByMatter(matterId) {
    return listMockEventsByMatter(matterId);
  },
};

export const apiEventRepository: EventRepository = {
  async listEvents() {
    throw new Error('Calendar API repository is not wired yet. Use DATA_SOURCE="mock" for calendar views until the backend slice is implemented.');
  },
  async listEventsByMatter() {
    throw new Error('Calendar API repository is not wired yet. Use DATA_SOURCE="mock" for calendar views until the backend slice is implemented.');
  },
};

function createEventRepository(): EventRepository {
  return getDataSource() === "api" ? apiEventRepository : mockEventRepository;
}

export const eventRepository: EventRepository = createEventRepository();
