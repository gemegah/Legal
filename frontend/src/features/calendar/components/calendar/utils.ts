import { formatDate, formatDateTime } from "@/lib/utils";
import type { 
  CalendarEventItem, 
  CalendarEventType, 
  CalendarViewMode 
} from "@/features/calendar/types";

export const hourStart = 8;
export const hourCount = 10;
export const compactThreshold = 80;
export const mobileBreakpoint = 920;
export const nowMarker = new Date("2026-03-03T09:30:00Z");

export const isNowMarkerInHour = (hour: number) => {
  const currentHour = nowMarker.getUTCHours();
  return currentHour === hour;
};

export const viewOptions: CalendarViewMode[] = ["day", "week", "agenda"];

export const typeOptions: Array<{ value: CalendarEventType | "all"; label: string }> = [
  { value: "all", label: "All entries" },
  { value: "hearing", label: "Hearings" },
  { value: "filing_deadline", label: "Deadlines" },
  { value: "meeting", label: "Meetings" },
  { value: "reminder", label: "Reminders" },
];

export function buildReminderCoverage(events: CalendarEventItem[]) {
  return events
    .filter((event) => event.reminders.length > 0)
    .slice(0, 4)
    .map((event) => {
      const primaryReminder = event.reminders[0];

      return {
        id: event.id,
        title: event.title,
        meta: `${primaryReminder.label} • ${formatDateTime(event.startsAt)}`,
        channelLabel: primaryReminder.channels.map((channel) => channel.toUpperCase().replace("_", " ")).join(" / "),
      };
    });
}

export function getEventLeft(value: string): number {
  const date = new Date(value);
  const hoursSinceStart = date.getUTCHours() + date.getUTCMinutes() / 60 - hourStart;
  return Math.max((hoursSinceStart / hourCount) * 100, 0);
}

export function getEventWidth(startsAt: string, endsAt: string): number {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  const hours = (end.getTime() - start.getTime()) / 3600000;
  return Math.max((hours / hourCount) * 100, 2); // Minimum 2% width
}

export function startOfWeek(value: Date): Date {
  const date = new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
  const day = date.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  return addDays(date, diff);
}

export function addDays(value: Date, days: number): Date {
  const next = new Date(value);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

export function isWithinWeek(value: string, weekStart: Date): boolean {
  const current = new Date(value);
  const weekEnd = addDays(weekStart, 7);
  return current >= weekStart && current < weekEnd;
}

export function isSameDay(value: string | Date, day: Date): boolean {
  const date = typeof value === "string" ? new Date(value) : value;
  return (
    date.getUTCFullYear() === day.getUTCFullYear() &&
    date.getUTCMonth() === day.getUTCMonth() &&
    date.getUTCDate() === day.getUTCDate()
  );
}

export function formatWeekLabel(weekStart: Date): string {
  const weekEnd = addDays(weekStart, 6);
  return `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
}

export function formatWeekday(value: Date): string {
  return new Intl.DateTimeFormat("en-GH", { weekday: "short", timeZone: "UTC" }).format(value);
}

export function formatDayNumber(value: Date): string {
  return new Intl.DateTimeFormat("en-GH", { day: "2-digit", timeZone: "UTC" }).format(value);
}

export function formatHourLabel(hour: number): string {
  const formatted = hour === 12 ? 12 : hour % 12;
  return `${formatted} ${hour >= 12 ? "PM" : "AM"}`;
}

export function formatShortTime(value: Date): string {
  return new Intl.DateTimeFormat("en-GH", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(value);
}

export function formatTimeRange(startsAt: string, endsAt: string): string {
  return `${formatShortTime(new Date(startsAt))} - ${formatShortTime(new Date(endsAt))}`;
}

export function durationLabel(startsAt: string, endsAt: string): string {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  return `${Math.round((end.getTime() - start.getTime()) / 60000)} min`;
}

export function getViewLabel(view: CalendarViewMode): string {
  if (view === "day") {
    return "Day";
  }
  if (view === "agenda") {
    return "Agenda";
  }
  return "Week";
}

export function getEventTypeLabel(type: CalendarEventType): string {
  switch (type) {
    case "filing_deadline":
      return "Deadline";
    case "hearing":
      return "Hearing";
    case "meeting":
      return "Meeting";
    case "mention":
      return "Mention";
    case "reminder":
      return "Reminder";
    default:
      return "Event";
  }
}

export function getStatusLabel(status: CalendarEventItem["status"]): string {
  if (status === "ai_suggested") {
    return "AI review";
  }
  return status === "confirmed" ? "Confirmed" : "Tentative";
}

export function formatDateForInput(date: Date) {
  const pad = (num: number) => num.toString().padStart(2, '0');
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  return `${y}-${m}-${d}T${hh}:${mm}`;
}
