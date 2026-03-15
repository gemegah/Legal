"use client";

import { useEffect, useState, useRef } from "react";
import { cn, formatDate } from "@/lib/utils";
import type {
  CalendarEventItem,
  CalendarEventType,
  CalendarScope,
  CalendarViewMode,
} from "@/features/calendar/types";

// Import modular pieces
import {
  hourStart,
  hourCount,
  mobileBreakpoint,
  nowMarker,
  viewOptions,
  typeOptions,
  startOfWeek,
  addDays,
  isWithinWeek,
  isSameDay,
  formatWeekLabel,
  getViewLabel,
  buildReminderCoverage,
} from "./calendar/utils";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  SidebarIcon,
} from "./calendar/Icons";

import {
  WeekBoard,
  DayBoard,
  AgendaBoard,
} from "./calendar/BoardComponents";

import {
  EventDetailModal,
  CreateEventModal,
} from "./calendar/ModalComponents";

import {
  DeadlineRow,
  MetricCard,
} from "./calendar/SharedComponents";

interface CalendarWorkspaceProps {
  initialEvents: CalendarEventItem[];
  initialScope: CalendarScope;
  caseTitle?: string | null;
}

export function SharedCalendarClient({ initialEvents }: { initialEvents: CalendarEventItem[] }) {
  return <CalendarWorkspace initialEvents={initialEvents} initialScope="firm" />;
}

export function CaseCalendarClient({
  initialEvents,
  caseTitle,
}: {
  initialEvents: CalendarEventItem[];
  caseTitle?: string | null;
}) {
  return <CalendarWorkspace initialEvents={initialEvents} initialScope="case" caseTitle={caseTitle} />;
}

function CalendarWorkspace({
  initialEvents,
  initialScope,
  caseTitle,
}: CalendarWorkspaceProps) {
  const [events, setEvents] = useState<CalendarEventItem[]>(initialEvents);
  const [viewMode, setViewMode] = useState<CalendarViewMode>("week");
  const [typeFilter, setTypeFilter] = useState<CalendarEventType | "all">("all");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showSidePanel, setShowSidePanel] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${mobileBreakpoint}px)`);
    if (mql.matches) setViewMode("agenda");
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setViewMode("agenda");
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const handleCreateEvent = (newEvent: Omit<CalendarEventItem, "id">) => {
    const event: CalendarEventItem = {
      ...newEvent,
      id: `evt-${Date.now()}`,
    };
    setEvents((prev) => [...prev, event]);
    setIsCreateModalOpen(false);
  };

  const handleJumpToDate = (dateString: string) => {
    if (!dateString) return;
    const pickedDate = new Date(dateString);
    const utcDate = new Date(Date.UTC(pickedDate.getUTCFullYear(), pickedDate.getUTCMonth(), pickedDate.getUTCDate()));
    const pickedWeekStart = startOfWeek(utcDate);
    
    const anchorDate = initialEvents[0] ? startOfWeek(new Date(initialEvents[0].startsAt)) : startOfWeek(nowMarker);
    const diffTime = pickedWeekStart.getTime() - anchorDate.getTime();
    const diffWeeks = Math.round(diffTime / (7 * 24 * 3600 * 1000));
    setWeekOffset(diffWeeks);
  };

  const anchorDate = events[0] ? startOfWeek(new Date(events[0].startsAt)) : startOfWeek(nowMarker);
  const activeWeekStart = addDays(anchorDate, weekOffset * 7);
  const weekDays = Array.from({ length: 7 }, (_, index) => addDays(activeWeekStart, index));
  const selectedDayIndex = weekOffset === 0 ? Math.max(0, (nowMarker.getUTCDay() + 6) % 7) : 0;
  const selectedDay = weekDays[selectedDayIndex] ?? activeWeekStart;
  
  const filteredEvents = events
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

  return (
    <section className="calendar-workspace">
      <button style={{width: 'fit-content', alignSelf: 'end'}}
                className="btn btn-primary" 
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
              >
                New Event
              </button>
      <div className="surface-card calendar-workspace-panel">
        <div className="calendar-toolbar">
          <div className="calendar-toolbar-copy">
            <div className="calendar-toolbar-topline">
              <h3 className="section-title">
                {viewMode === "day" ? formatDate(selectedDay) : formatWeekLabel(activeWeekStart)}
              </h3>
              <div className="calendar-toolbar-controls">
                <button className="btn btn-ghost" onClick={() => setWeekOffset(0)} type="button">
                  Today
                </button>
                <div className="date-picker-wrapper">
                  <button 
                    className="btn btn-ghost btn-icon" 
                    onClick={() => dateInputRef.current?.showPicker()} 
                    type="button"
                    title="Jump to date"
                  >
                    <CalendarIcon />
                  </button>
                  <input 
                    type="date" 
                    ref={dateInputRef} 
                    className="hidden-date-input"
                    onChange={(e) => handleJumpToDate(e.target.value)}
                  />
                </div>
              </div>
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
            <div className="calendar-toolbar-actions-group">
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
              {/* <button 
                className="btn btn-primary" 
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
              >
                New Event
              </button> */}
            </div>
            <button 
              className={cn("btn-toggle-side", !showSidePanel && "is-collapsed")} 
              onClick={() => setShowSidePanel(!showSidePanel)}
              type="button"
              title={showSidePanel ? "Hide side panel" : "Show side panel"}
            >
              <SidebarIcon />
              <span>{showSidePanel ? "Collapse sidebar" : "Expand calendar"}</span>
            </button>
          </div>
        </div>

        <div className={cn("calendar-layout", !showSidePanel && "is-full-width")}>
          <div className="calendar-board-shell">
            {viewMode === "agenda" ? (
              <AgendaBoard days={groupedAgenda} />
            ) : viewMode === "day" ? (
              <DayBoard
                day={selectedDay}
                events={weekEvents.filter((e) => isSameDay(e.startsAt, selectedDay))}
                selectedEventId={selectedEventId}
                onSelectEvent={setSelectedEventId}
              />
            ) : (
              <WeekBoard
                days={boardDays}
                events={weekEvents}
                selectedEventId={selectedEventId}
                onSelectEvent={setSelectedEventId}
              />
            )}
          </div>

          {showSidePanel && (
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
          )}
        </div>
      </div>

      {selectedEventId && (
        <EventDetailModal 
          event={events.find(e => e.id === selectedEventId)!} 
          onClose={() => setSelectedEventId(null)} 
        />
      )}

      {isCreateModalOpen && (
        <CreateEventModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateEvent}
        />
      )}
    </section>
  );
}
