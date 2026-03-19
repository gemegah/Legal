import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { CalendarEventItem, CalendarEventType } from "@/features/calendar/types";
import { 
  getEventTypeLabel, 
  formatTimeRange, 
  formatDateForInput 
} from "./utils";

function toCaseId(caseReference: string) {
  return caseReference.trim().toLowerCase().replace(/^cas-/, "case-");
}

export function EventDetailModal({
  event,
  onClose,
}: {
  event: CalendarEventItem;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="calendar-modal-overlay">
      <div className="calendar-modal-backdrop" onClick={onClose} />
      <article
        className={cn(
          "calendar-event-card is-expanded",
          `is-${event.type}`,
          `is-${event.urgency}`,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="calendar-event-close" 
          type="button"
          onClick={onClose}
        >
          &times;
        </button>
        
        <div className="calendar-event-meta">
          <span className="calendar-event-type">{getEventTypeLabel(event.type)}</span>
        </div>
        <p className="calendar-event-title">{event.title}</p>
        
        <div className="calendar-event-details">
          {/* Attendees & Join Section */}
          <div className="calendar-event-attendees">
            <div className="avatar-stack">
              <div className="avatar-circle">BS</div>
              <div className="avatar-circle">AK</div>
              <div className="avatar-circle">ML</div>
            </div>
            <span className="attendee-count">3 members</span>
            {event.meetingUrl ? (
              <a className="btn-join" href={event.meetingUrl} rel="noopener noreferrer" target="_blank">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width: 14, height: 14}}><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
                Join Meeting
              </a>
            ) : null}
          </div>

          {/* Info Rows */}
          <div className="calendar-event-row">
            <span className="calendar-event-row-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            </span>
            <p className="calendar-event-time">Tue, March 03 -- {formatTimeRange(event.startsAt, event.endsAt)}</p>
          </div>

          {event.caseReference && (
            <div className="calendar-event-row">
              <span className="calendar-event-row-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14.5 2 14.5 7.5 20 7.5"/></svg>
              </span>
              <span className="case-chip">{event.caseReference}</span>
            </div>
          )}

          <div className="calendar-event-row">
            <span className="calendar-event-row-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </span>
            <span>{event.location || "LegalOS War Room, Floor 4"}</span>
          </div>

          <div className="calendar-event-row">
            <span className="calendar-event-row-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            </span>
            <span>10 Minutes Before</span>
          </div>

          <div className="calendar-event-description">
            <p>Everyone should join this session without fail. The Legal team is all set to go for the new case updates. Please ensure all documents are ready.</p>
          </div>

          {/* RSVP Section */}
          <div className="calendar-event-rsvp">
            <p className="rsvp-label">Going?</p>
            <div className="rsvp-actions">
              <button className="btn-rsvp is-yes">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{width: 12, height: 12}}><polyline points="20 6 9 17 4 12"/></svg>
                Yes
              </button>
              <button className="btn-rsvp is-no">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{width: 12, height: 12}}><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
                No
              </button>
              <button className="btn-rsvp is-maybe">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{width: 12, height: 12}}><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12" y1="8" y2="8"/></svg>
                Maybe
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

export function CreateEventModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (event: Omit<CalendarEventItem, "id">) => void;
}) {
  const [formData, setFormData] = useState({
    title: "",
    caseReference: "CAS-2026-014",
    caseTitle: "Asante v. Mensah Industries Ltd",
    type: "meeting" as CalendarEventType,
    urgency: "normal" as const,
    startsAt: formatDateForInput(new Date()),
    endsAt: formatDateForInput(new Date(Date.now() + 3600000)),
    location: "",
    description: "",
  });

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      ...formData,
      startsAt: new Date(formData.startsAt).toISOString(),
      endsAt: new Date(formData.endsAt).toISOString(),
      caseId: toCaseId(formData.caseReference),
      clientName: "Internal Client",
      ownerName: "Current User",
      source: "manual",
      status: "confirmed",
      reminders: [],
    });
  };

  return (
    <div className="calendar-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="calendar-modal-backdrop" />
      <div className="calendar-create-modal">
        <div className="modal-header">
          <div className="modal-header-content">
            <p className="eyebrow-label">Schedule</p>
            <h2 className="modal-title">Create New Event</h2>
          </div>
          <button className="btn-modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="calendar-create-form">
          <div className="form-section">
            <label className="form-label">Event Title</label>
            <input
              type="text"
              className="form-input is-large"
              placeholder="e.g. Settlement Discussion"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-grid">
            <div className="form-section">
              <label className="form-label">Case Reference</label>
              <input
                type="text"
                className="form-input"
                value={formData.caseReference}
                onChange={(e) => setFormData({ ...formData, caseReference: e.target.value })}
                required
              />
            </div>
            <div className="form-section">
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-input"
                placeholder="Virtual or Address"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-section">
              <label className="form-label">Event Type</label>
              <div className="calendar-inline-select is-full">
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as CalendarEventType })}
                >
                  <option value="meeting">Meeting</option>
                  <option value="hearing">Court Hearing</option>
                  <option value="filing_deadline">Filing Deadline</option>
                  <option value="mention">Registry Mention</option>
                  <option value="reminder">Reminder</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="form-section">
              <label className="form-label">Urgency</label>
              <div className="calendar-inline-select is-full">
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
                >
                  <option value="normal">Normal</option>
                  <option value="elevated">Elevated</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-section">
              <label className="form-label">Starts At</label>
              <input
                type="datetime-local"
                className="form-input"
                value={formData.startsAt}
                onChange={(e) => setFormData({ ...formData, startsAt: e.target.value })}
                required
              />
            </div>
            <div className="form-section">
              <label className="form-label">Ends At</label>
              <input
                type="datetime-local"
                className="form-input"
                value={formData.endsAt}
                onChange={(e) => setFormData({ ...formData, endsAt: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              placeholder="Add notes or agenda details..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
