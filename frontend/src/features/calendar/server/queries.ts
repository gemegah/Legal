import "server-only";

import { cache } from "react";

import type { CalendarEventItem } from "@/features/calendar/types";

import { eventRepository } from "./repository";

export const getCalendarWorkspace = cache(async (): Promise<{ events: CalendarEventItem[] }> => {
  const events = await eventRepository.listEvents();

  return { events };
});

export const getEventsByCase = cache(async (caseId: string): Promise<{ events: CalendarEventItem[] }> => {
  if (!caseId) {
    return { events: [] };
  }

  const events = await eventRepository.listEventsByCase(caseId);

  return { events };
});
