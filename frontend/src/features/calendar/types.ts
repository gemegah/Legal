export type CalendarEventType =
  | "hearing"
  | "filing_deadline"
  | "meeting"
  | "mention"
  | "reminder"
  | "other";

export type CalendarViewMode = "day" | "week" | "agenda";
export type CalendarScope = "firm" | "matter";
export type CalendarEventStatus = "confirmed" | "tentative" | "ai_suggested";
export type CalendarUrgency = "normal" | "elevated" | "critical";
export type ReminderChannel = "email" | "sms" | "in_app";

export interface CalendarReminder {
  id: string;
  label: string;
  offsetMinutes: number;
  channels: ReminderChannel[];
}

export interface CalendarEventItem {
  id: string;
  title: string;
  description: string;
  matterId: string | null;
  matterReference: string | null;
  matterTitle: string | null;
  clientName: string | null;
  ownerName: string;
  startsAt: string;
  endsAt: string;
  type: CalendarEventType;
  status: CalendarEventStatus;
  urgency: CalendarUrgency;
  location: string;
  source: "manual" | "ai";
  reminders: CalendarReminder[];
}
