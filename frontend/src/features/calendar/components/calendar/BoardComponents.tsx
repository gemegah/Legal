import React from "react";
import { cn, formatDate } from "@/lib/utils";
import type { CalendarEventItem } from "@/features/calendar/types";
import { 
  hourCount, 
  hourStart, 
  nowMarker, 
  isNowMarkerInHour, 
  formatHourLabel, 
  formatShortTime, 
  formatWeekday, 
  formatDayNumber, 
  isSameDay, 
  getEventLeft, 
  getEventWidth, 
  getEventTypeLabel, 
  durationLabel, 
  formatTimeRange, 
  getStatusLabel 
} from "./utils";

export function WeekBoard({
  days,
  events,
  selectedEventId,
  onSelectEvent,
}: {
  days: Date[];
  events: CalendarEventItem[];
  selectedEventId: string | null;
  onSelectEvent: (id: string | null) => void;
}) {
  return (
    <div className="calendar-board is-week-view" style={{ "--hour-count": hourCount } as React.CSSProperties}>
      <div className="calendar-day-header-top">
        <div className="calendar-board-corner">GMT</div>
        {days.map((day) => (
          <div key={day.toISOString()} className={cn("calendar-day-label-static", isSameDay(day, nowMarker) && "is-today")}>
            <strong>{formatWeekday(day).toUpperCase()}</strong> {formatDayNumber(day)}
          </div>
        ))}
      </div>

      <div className="calendar-day-grid-container">
        <div className="calendar-vertical-time-rail">
          {Array.from({ length: hourCount }, (_, i) => {
            const hour = hourStart + i;
            const isNowInHour = isNowMarkerInHour(hour);
            return (
              <div className="calendar-time-slot" key={i}>
                {formatHourLabel(hour)}
                {isNowInHour && (
                  <div className="calendar-time-marker-now" style={{ top: `${(nowMarker.getUTCMinutes() / 60) * 100}%` }}>
                    {formatShortTime(nowMarker)}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {days.map((day) => (
          <DayColumn
            key={day.toISOString()}
            day={day}
            events={events.filter((event) => isSameDay(event.startsAt, day))}
            selectedEventId={selectedEventId}
            onSelectEvent={onSelectEvent}
          />
        ))}
      </div>
    </div>
  );
}

export function DayColumn({
  day,
  events,
  selectedEventId,
  onSelectEvent,
}: {
  day: Date;
  events: CalendarEventItem[];
  selectedEventId: string | null;
  onSelectEvent: (id: string | null) => void;
}) {
  const isToday = isSameDay(day, nowMarker);
  const nowTop = isToday 
    ? ((nowMarker.getUTCHours() + nowMarker.getUTCMinutes() / 60 - hourStart) / hourCount) * 100 
    : null;

  const eventLanes: Record<string, number> = {};
  const sorted = [...events].sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

  sorted.forEach((event) => {
    let lane = 0;
    while (true) {
      const collision = sorted.find((other) => {
        if (eventLanes[other.id] !== lane) return false;
        if (other.id === event.id) return false;
        return (
          new Date(event.startsAt) < new Date(other.endsAt) && new Date(event.endsAt) > new Date(other.startsAt)
        );
      });
      if (!collision) break;
      lane++;
    }
    eventLanes[event.id] = lane;
  });

  const maxLanes = Math.max(0, ...Object.values(eventLanes)) + 1;

  return (
    <div className={cn("calendar-vertical-content", isToday && "is-today")}>
      <div className="calendar-vertical-track" style={{ "--lane-count": maxLanes } as React.CSSProperties}>
        {nowTop !== null && nowTop >= 0 && nowTop <= 100 && (
          <div className="calendar-now-line" style={{ top: `${nowTop}%` }} />
        )}
        {events.map((event) => {
          const topPct = getEventLeft(event.startsAt);
          const heightPct = getEventWidth(event.startsAt, event.endsAt);
          const laneIndex = eventLanes[event.id] || 0;

          return (
            <article
              className={cn(
                "calendar-event-card",
                `is-${event.type}`,
                `is-${event.urgency}`,
                "is-condensed",
              )}
              key={event.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectEvent(event.id);
              }}
              style={{
                top: `${topPct}%`,
                height: `${heightPct}%`,
                left: `calc((${laneIndex} * (100% / ${maxLanes})) + 4px)`,
                width: `calc((100% / ${maxLanes}) - 8px)`,
                zIndex: 1,
              }}
            >
              <div className="calendar-event-meta">
                <span className="calendar-event-type">{getEventTypeLabel(event.type)}</span>
              </div>
              <p className="calendar-event-title">{event.title}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export function DayBoard({
  day,
  events,
  selectedEventId,
  onSelectEvent,
}: {
  day: Date;
  events: CalendarEventItem[];
  selectedEventId: string | null;
  onSelectEvent: (id: string | null) => void;
}) {
  return (
    <div className="calendar-board is-day-view" style={{ "--hour-count": hourCount } as React.CSSProperties}>
      <div className="calendar-day-header-top">
        <div className="calendar-board-corner">GMT</div>
        <div className="calendar-day-label-static">
          <strong>{formatWeekday(day).toUpperCase()}</strong> {formatDate(day).toUpperCase()}
        </div>
      </div>

      <div className="calendar-day-grid-container">
        <div className="calendar-vertical-time-rail">
          {Array.from({ length: hourCount }, (_, i) => {
            const hour = hourStart + i;
            const isNowInHour = isNowMarkerInHour(hour) && isSameDay(day, nowMarker);
            return (
              <div className="calendar-time-slot" key={i}>
                {formatHourLabel(hour)}
                {isNowInHour && (
                  <div className="calendar-time-marker-now" style={{ top: `${(nowMarker.getUTCMinutes() / 60) * 100}%` }}>
                    {formatShortTime(nowMarker)}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <DayColumn
          day={day}
          events={events}
          selectedEventId={selectedEventId}
          onSelectEvent={onSelectEvent}
        />
      </div>
    </div>
  );
}

export function AgendaBoard({
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
                <div
                  className="calendar-agenda-card"
                  key={event.id}
                  tabIndex={0}
                  title={`${event.title} — ${formatTimeRange(event.startsAt, event.endsAt)}`}
                  role="button"
                >
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
