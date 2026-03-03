"use client";

import { useState } from "react";

import { cn, formatDate, formatDateTime, formatRelativeDate } from "@/lib/utils";

import type {
  CalendarEventItem,
  CalendarEventType,
  CalendarScope,
  CalendarViewMode,
} from "@/features/calendar/types";

const hourStart = 8;
const hourCount = 10;
const hourHeight = 76;
const nowMarker = new Date("2026-03-03T09:30:00Z");
const viewOptions: CalendarViewMode[] = ["day", "week", "agenda"];
const typeOptions: Array<{ value: CalendarEventType | "all"; label: string }> = [
  { value: "all", label: "All entries" },
  { value: "hearing", label: "Hearings" },
  { value: "filing_deadline", label: "Deadlines" },
  { value: "meeting", label: "Meetings" },
  { value: "reminder", label: "Reminders" },
];

interface CalendarWorkspaceProps {
  initialEvents: CalendarEventItem[];
  initialScope: CalendarScope;
  matterTitle?: string | null;
}

export function SharedCalendarClient({ initialEvents }: { initialEvents: CalendarEventItem[] }) {
  return <CalendarWorkspace initialEvents={initialEvents} initialScope="firm" />;
}

export function MatterCalendarClient({
  initialEvents,
  matterTitle,
}: {
  initialEvents: CalendarEventItem[];
  matterTitle?: string | null;
}) {
  return <CalendarWorkspace initialEvents={initialEvents} initialScope="matter" matterTitle={matterTitle} />;
}

function CalendarWorkspace({
  initialEvents,
  initialScope,
  matterTitle,
}: CalendarWorkspaceProps) {
  const [viewMode, setViewMode] = useState<CalendarViewMode>("week");
  const [typeFilter, setTypeFilter] = useState<CalendarEventType | "all">("all");
  const [weekOffset, setWeekOffset] = useState(0);

  const anchorDate = initialEvents[0] ? startOfWeek(new Date(initialEvents[0].startsAt)) : startOfWeek(nowMarker);
  const activeWeekStart = addDays(anchorDate, weekOffset * 7);
  const weekDays = Array.from({ length: 7 }, (_, index) => addDays(activeWeekStart, index));
  const selectedDayIndex = weekOffset === 0 ? Math.max(0, (nowMarker.getUTCDay() + 6) % 7) : 0;
  const selectedDay = weekDays[selectedDayIndex] ?? activeWeekStart;
  const filteredEvents = initialEvents
    .filter((event) => typeFilter === "all" || event.type === typeFilter)
    .sort((left, right) => new Date(left.startsAt).getTime() - new Date(right.startsAt).getTime());
  const weekEvents = filteredEvents.filter((event) => isWithinWeek(event.startsAt, activeWeekStart));
  const boardDays = viewMode === "day" ? [selectedDay] : weekDays;
  const groupedAgenda = boardDays.map((day) => ({
    day,
    items: weekEvents.filter((event) => isSameDay(event.startsAt, day)),
  }));
  const urgentDeadlines = weekEvents
    .filter((event) => event.type === "filing_deadline" || event.type === "hearing" || event.urgency === "critical")
    .slice(0, 4);
  const aiSuggestions = weekEvents.filter((event) => event.source === "ai");
  const reminderCoverage = buildReminderCoverage(weekEvents);
  const todayLoad = filteredEvents.filter((event) => isSameDay(event.startsAt, nowMarker)).length;
  const headline = initialScope === "matter" ? "Matter calendar" : "Shared calendar";
  const subtitle =
    initialScope === "matter"
      ? `Matter-linked hearings, filing deadlines, and reminders for ${matterTitle ?? "this matter"}.`
      : "Firm-wide scheduling for hearings, filings, meetings, and AI-reviewed deadline entries.";

  return (
    <section className="calendar-workspace">
      <div className="surface-card calendar-workspace-hero">
        <div className="calendar-workspace-copy">
          <p className="eyebrow-label">{initialScope === "matter" ? "Matter docket" : "Firm schedule"}</p>
          <h2 className="matter-title">{headline}</h2>
          <p className="muted-copy">{subtitle}</p>
        </div>

        <div className="calendar-hero-stats">
          <MetricCard label="This week" value={`${weekEvents.length} entries`} tone="default" />
          <MetricCard label="Critical" value={`${urgentDeadlines.length} tracked`} tone="danger" />
          <MetricCard label="AI review" value={`${aiSuggestions.length} flagged`} tone="warning" />
          <MetricCard label="Today" value={`${todayLoad} scheduled`} tone="success" />
        </div>
      </div>

      <div className="surface-card calendar-workspace-panel">
        <div className="calendar-toolbar">
          <div className="calendar-toolbar-copy">
            <div className="calendar-toolbar-topline">
              <h3 className="section-title">{formatWeekLabel(activeWeekStart)}</h3>
              <button className="btn btn-ghost" onClick={() => setWeekOffset(0)} type="button">
                Today
              </button>
            </div>

            <div className="calendar-toolbar-nav">
              <button className="calendar-nav-button" onClick={() => setWeekOffset((value) => value - 1)} type="button">
                <ChevronLeftIcon />
              </button>
              <button className="calendar-nav-button" onClick={() => setWeekOffset((value) => value + 1)} type="button">
                <ChevronRightIcon />
              </button>
              <label className="calendar-inline-select">
                <span>Focus</span>
                <select
                  onChange={(event) => setTypeFilter(event.target.value as CalendarEventType | "all")}
                  value={typeFilter}
                >
                  {typeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="calendar-toolbar-actions">
            <div className="calendar-view-toggle" role="tablist" aria-label="Calendar view">
              {viewOptions.map((option) => (
                <button
                  key={option}
                  className={cn("calendar-view-button", viewMode === option && "is-active")}
                  onClick={() => setViewMode(option)}
                  role="tab"
                  type="button"
                >
                  {getViewLabel(option)}
                </button>
              ))}
            </div>
            <button className="btn btn-primary" type="button">
              New Event
            </button>
          </div>
        </div>

        <div className="calendar-layout">
          <div className="calendar-main-column">
            {viewMode === "agenda" ? (
              <AgendaBoard days={groupedAgenda} />
            ) : (
              <WeekBoard days={boardDays} events={weekEvents} />
            )}
          </div>

          <aside className="calendar-side-column">
            <div className="calendar-side-card">
              <div className="panel-header">
                <div>
                  <p className="eyebrow-label">Deadline watch</p>
                  <h3 className="section-title">Priority filings and hearings</h3>
                </div>
              </div>

              {urgentDeadlines.length > 0 ? (
                <div className="calendar-deadline-list">
                  {urgentDeadlines.map((event) => (
                    <DeadlineRow key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="empty-state">No deadline items match the current filters.</div>
              )}
            </div>

            <div className="calendar-side-card">
              <div className="panel-header">
                <div>
                  <p className="eyebrow-label">Reminder coverage</p>
                  <h3 className="section-title">Automated touchpoints</h3>
                </div>
                <span className="count-badge">{reminderCoverage.length}</span>
              </div>

              <div className="calendar-reminder-list">
                {reminderCoverage.map((item) => (
                  <div className="calendar-reminder-card" key={item.id}>
                    <div className="calendar-reminder-copy">
                      <p className="row-title">{item.title}</p>
                      <p className="row-meta">{item.meta}</p>
                    </div>
                    <span className="calendar-reminder-channel">{item.channelLabel}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function WeekBoard({
  days,
  events,
}: {
  days: Date[];
  events: CalendarEventItem[];
}) {
  const columnTemplate = `88px repeat(${days.length}, minmax(168px, 1fr))`;

  return (
    <div className="calendar-board-shell">
      <div className="calendar-board" style={{ gridTemplateColumns: columnTemplate }}>
        <div className="calendar-board-corner">GMT</div>
        {days.map((day) => (
          <div className={cn("calendar-day-head", isSameDay(day, nowMarker) && "is-today")} key={day.toISOString()}>
            <span>{formatWeekday(day)}</span>
            <strong>{formatDayNumber(day)}</strong>
          </div>
        ))}

        <div className="calendar-time-rail">
          {Array.from({ length: hourCount }, (_, index) => (
            <div className="calendar-time-slot" key={`${index}-${hourStart}`}>
              {formatHourLabel(hourStart + index)}
            </div>
          ))}
        </div>

        {days.map((day) => (
          <DayColumn day={day} events={events.filter((event) => isSameDay(event.startsAt, day))} key={day.toISOString()} />
        ))}
      </div>
    </div>
  );
}

function DayColumn({
  day,
  events,
}: {
  day: Date;
  events: CalendarEventItem[];
}) {
  const nowTop = isSameDay(day, nowMarker)
    ? (nowMarker.getUTCHours() + nowMarker.getUTCMinutes() / 60 - hourStart) * hourHeight
    : null;

  return (
    <div className="calendar-day-column">
      <div className="calendar-day-track">
        {nowTop !== null ? (
          <div className="calendar-now-line" style={{ top: `${Math.max(nowTop, 0)}px` }}>
            <span>{formatShortTime(nowMarker)}</span>
          </div>
        ) : null}

        {events.map((event) => (
          <article
            className={cn("calendar-event-card", `is-${event.type}`, `is-${event.urgency}`)}
            key={event.id}
            style={{
              top: `${getEventTop(event.startsAt)}px`,
              height: `${getEventHeight(event.startsAt, event.endsAt)}px`,
            }}
          >
            <div className="calendar-event-meta">
              <span className="calendar-event-type">{getEventTypeLabel(event.type)}</span>
              <span className={cn("calendar-event-status", `is-${event.status}`)}>{getStatusLabel(event.status)}</span>
            </div>
            <p className="calendar-event-title">{event.title}</p>
            <p className="calendar-event-time">{formatTimeRange(event.startsAt, event.endsAt)}</p>
            {event.matterReference ? <span className="matter-chip">{event.matterReference}</span> : null}
          </article>
        ))}
      </div>
    </div>
  );
}

function AgendaBoard({
  days,
}: {
  days: Array<{ day: Date; items: CalendarEventItem[] }>;
}) {
  return (
    <div className="calendar-agenda">
      {days.map(({ day, items }) => (
        <div className="calendar-agenda-day" key={day.toISOString()}>
          <div className="calendar-agenda-head">
            <div>
              <p className="eyebrow-label">{formatWeekday(day)}</p>
              <h3 className="section-title">{formatDate(day)}</h3>
            </div>
            <span className="count-badge">{items.length}</span>
          </div>

          {items.length > 0 ? (
            <div className="calendar-agenda-list">
              {items.map((event) => (
                <div className="calendar-agenda-card" key={event.id}>
                  <div className="calendar-agenda-time">
                    <span>{formatShortTime(new Date(event.startsAt))}</span>
                    <small>{durationLabel(event.startsAt, event.endsAt)}</small>
                  </div>
                  <div className="calendar-agenda-copy">
                    <div className="calendar-event-meta">
                      <span className="calendar-event-type">{getEventTypeLabel(event.type)}</span>
                      <span className={cn("calendar-event-status", `is-${event.status}`)}>{getStatusLabel(event.status)}</span>
                    </div>
                    <p className="row-title">{event.title}</p>
                    <p className="row-meta">
                      {event.location}
                      {event.matterReference ? ` • ${event.matterReference}` : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">No scheduled entries for this day.</div>
          )}
        </div>
      ))}
    </div>
  );
}

function DeadlineRow({ event }: { event: CalendarEventItem }) {
  return (
    <div className={cn("calendar-deadline-row", `is-${event.urgency}`)}>
      <div className="calendar-deadline-time">{formatShortTime(new Date(event.startsAt))}</div>
      <div className="calendar-deadline-body">
        <p className="row-title">{event.title}</p>
        <p className="row-meta">
          {formatRelativeDate(event.startsAt)} • {event.location}
        </p>
      </div>
      {event.matterReference ? <span className="matter-chip">{event.matterReference}</span> : null}
    </div>
  );
}

function MetricCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "default" | "danger" | "warning" | "success";
}) {
  return (
    <div className="calendar-stat-card">
      <span className="eyebrow-label">{label}</span>
      <strong className={cn("stat-value", `stat-value-${tone}`)}>{value}</strong>
    </div>
  );
}

function buildReminderCoverage(events: CalendarEventItem[]) {
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

function getEventTop(value: string): number {
  const date = new Date(value);
  return Math.max((date.getUTCHours() + date.getUTCMinutes() / 60 - hourStart) * hourHeight, 0);
}

function getEventHeight(startsAt: string, endsAt: string): number {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  const hours = Math.max((end.getTime() - start.getTime()) / 3600000, 0.5);
  return Math.max(hours * hourHeight, 44);
}

function startOfWeek(value: Date): Date {
  const date = new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
  const day = date.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  return addDays(date, diff);
}

function addDays(value: Date, days: number): Date {
  const next = new Date(value);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function isWithinWeek(value: string, weekStart: Date): boolean {
  const current = new Date(value);
  const weekEnd = addDays(weekStart, 7);
  return current >= weekStart && current < weekEnd;
}

function isSameDay(value: string | Date, day: Date): boolean {
  const date = typeof value === "string" ? new Date(value) : value;
  return (
    date.getUTCFullYear() === day.getUTCFullYear() &&
    date.getUTCMonth() === day.getUTCMonth() &&
    date.getUTCDate() === day.getUTCDate()
  );
}

function formatWeekLabel(weekStart: Date): string {
  const weekEnd = addDays(weekStart, 6);
  return `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
}

function formatWeekday(value: Date): string {
  return new Intl.DateTimeFormat("en-GH", { weekday: "short", timeZone: "UTC" }).format(value);
}

function formatDayNumber(value: Date): string {
  return new Intl.DateTimeFormat("en-GH", { day: "2-digit", timeZone: "UTC" }).format(value);
}

function formatHourLabel(hour: number): string {
  const formatted = hour === 12 ? 12 : hour % 12;
  return `${formatted} ${hour >= 12 ? "PM" : "AM"}`;
}

function formatShortTime(value: Date): string {
  return new Intl.DateTimeFormat("en-GH", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(value);
}

function formatTimeRange(startsAt: string, endsAt: string): string {
  return `${formatShortTime(new Date(startsAt))} - ${formatShortTime(new Date(endsAt))}`;
}

function durationLabel(startsAt: string, endsAt: string): string {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  return `${Math.round((end.getTime() - start.getTime()) / 60000)} min`;
}

function getViewLabel(view: CalendarViewMode): string {
  if (view === "day") {
    return "Day";
  }
  if (view === "agenda") {
    return "Agenda";
  }
  return "Week";
}

function getEventTypeLabel(type: CalendarEventType): string {
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

function getStatusLabel(status: CalendarEventItem["status"]): string {
  if (status === "ai_suggested") {
    return "AI review";
  }
  return status === "confirmed" ? "Confirmed" : "Tentative";
}

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
