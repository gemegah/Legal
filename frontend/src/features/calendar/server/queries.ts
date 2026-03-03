import "server-only";

import { cache } from "react";

import type { CalendarEventItem } from "@/features/calendar/types";

import { eventRepository } from "./repository";

export const getCalendarWorkspace = cache(async (): Promise<{ events: CalendarEventItem[] }> => {
  const events = await eventRepository.listEvents();

  return { events };
});

export const getEventsByMatter = cache(async (matterId: string): Promise<{ events: CalendarEventItem[] }> => {
  if (!matterId) {
    return { events: [] };
  }

  const events = await eventRepository.listEventsByMatter(matterId);

  return { events };
});
