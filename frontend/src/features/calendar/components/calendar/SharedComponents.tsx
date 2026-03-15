import { cn, formatRelativeDate } from "@/lib/utils";
import type { CalendarEventItem } from "@/features/calendar/types";
import { formatShortTime } from "./utils";

export function DeadlineRow({ event }: { event: CalendarEventItem }) {
  return (
    <div className={cn("calendar-deadline-row", `is-${event.urgency}`)}>
      <div className="calendar-deadline-time">{formatShortTime(new Date(event.startsAt))}</div>
      <div className="calendar-deadline-body">
        <p className="row-title">{event.title}</p>
        <p className="row-meta">
          {formatRelativeDate(event.startsAt)} * {event.location}
        </p>
      </div>
      {event.caseReference ? <span className="case-chip">{event.caseReference}</span> : null}
    </div>
  );
}

export function MetricCard({
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
