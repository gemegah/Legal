import "server-only";

import { listMockEvents, listMockEventsByCase } from "@/features/calendar/data/mock";
import type { CalendarEventItem } from "@/features/calendar/types";
import { getDataSource } from "@/lib/data-source";

export interface EventRepository {
  listEvents(): Promise<CalendarEventItem[]>;
  listEventsByCase(caseId: string): Promise<CalendarEventItem[]>;
}

export const mockEventRepository: EventRepository = {
  async listEvents() {
    return listMockEvents();
  },
  async listEventsByCase(caseId) {
    return listMockEventsByCase(caseId);
  },
};

export const apiEventRepository: EventRepository = {
  async listEvents() {
    throw new Error('Calendar API repository is not wired yet. Use DATA_SOURCE="mock" for calendar views until the backend slice is implemented.');
  },
  async listEventsByCase() {
    throw new Error('Calendar API repository is not wired yet. Use DATA_SOURCE="mock" for calendar views until the backend slice is implemented.');
  },
};

function createEventRepository(): EventRepository {
  return getDataSource() === "api" ? apiEventRepository : mockEventRepository;
}

export const eventRepository: EventRepository = createEventRepository();
