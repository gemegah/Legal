"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import type { AuditCategory, AuditEvent, AuditSource, PaginatedAuditResult } from "@/features/audit/types";
import { cn, formatDateTime } from "@/lib/utils";

type DateRangeFilter = "all" | "7d" | "30d" | "90d";

export function CaseAuditClient({ initialData }: { initialData: PaginatedAuditResult }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<AuditCategory | "all">("all");
  const [source, setSource] = useState<AuditSource | "all">("all");
  const [dateRange, setDateRange] = useState<DateRangeFilter>("all");
  const [selectedEventId, setSelectedEventId] = useState<number | null>(initialData.items[0]?.id ?? null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const filteredEvents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const now = Date.now();
    const maxAge =
      dateRange === "7d"
        ? 1000 * 60 * 60 * 24 * 7
        : dateRange === "30d"
          ? 1000 * 60 * 60 * 24 * 30
          : dateRange === "90d"
            ? 1000 * 60 * 60 * 24 * 90
            : null;

    return initialData.items.filter((event) => {
      if (category !== "all" && event.category !== category) return false;
      if (source !== "all" && event.source !== source) return false;
      if (maxAge && now - Date.parse(event.createdAt) > maxAge) return false;
      if (!normalizedQuery) return true;
      return [
        event.summary,
        event.actorLabel,
        event.entityType,
        event.action,
        ...event.diffEntries.map((entry) => `${entry.field} ${entry.before} ${entry.after}`),
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [category, dateRange, initialData.items, query, source]);

  const selectedEvent = filteredEvents.find((event) => event.id === selectedEventId) ?? filteredEvents[0] ?? null;

  useEffect(() => {
    if (!selectedEvent && filteredEvents[0]) {
      setSelectedEventId(filteredEvents[0].id);
    }
  }, [filteredEvents, selectedEvent]);

  function handleExportCsv() {
    const header = ["ID", "Action", "Category", "Source", "Actor", "Entity Type", "Created At", "Summary"];
    const rows = filteredEvents.map((event) => [
      event.id,
      event.action,
      event.category,
      event.source,
      event.actorLabel,
      event.entityType,
      event.createdAt,
      event.summary.replace(/,/g, ";"),
    ]);
    const content = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "case-audit.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    setFeedback("Exported current audit view as CSV.");
  }

  function handlePrint() {
    window.print();
  }

  return (
    <section className="case-tab-panel audit-workspace">
      <div className="surface-card audit-hero">
        <div>
          <p className="eyebrow-label">Case Audit</p>
          <h2 className="section-title">Immutable operational history for the case</h2>
          <p className="case-tab-copy">
            Audit entries are system-generated. Use filters and the detail panel to inspect changes, source, and related workflow context.
          </p>
        </div>
        <div className="audit-hero-actions">
          <span className="case-inline-note">Append-only history</span>
          <Button onClick={handlePrint} variant="ghost">
            Print
          </Button>
          <Button onClick={handleExportCsv}>Export CSV</Button>
        </div>
      </div>

      <div className="surface-card audit-toolbar">
        <label className="audit-search">
          <span className="sr-only">Search audit history</span>
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search audit events, actors, fields..."
            type="search"
            value={query}
          />
        </label>

        <label className="audit-select-field">
          <span>Action</span>
          <select onChange={(event) => setCategory(event.target.value as AuditCategory | "all")} value={category}>
            <option value="all">All</option>
            <option value="created">Created</option>
            <option value="updated">Updated</option>
            <option value="shared">Shared</option>
            <option value="viewed">Viewed</option>
            <option value="uploaded">Uploaded</option>
            <option value="billing">Billing</option>
            <option value="client_activity">Client activity</option>
            <option value="ai">AI</option>
          </select>
        </label>

        <label className="audit-select-field">
          <span>Source</span>
          <select onChange={(event) => setSource(event.target.value as AuditSource | "all")} value={source}>
            <option value="all">All</option>
            <option value="firm">Firm</option>
            <option value="client">Client</option>
            <option value="system">System</option>
            <option value="ai">AI</option>
          </select>
        </label>

        <label className="audit-select-field">
          <span>Date range</span>
          <select onChange={(event) => setDateRange(event.target.value as DateRangeFilter)} value={dateRange}>
            <option value="all">All time</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </label>
      </div>

      {feedback ? <div className="audit-feedback">{feedback}</div> : null}

      <div className="audit-grid">
        <div className="surface-card audit-feed-panel">
          {initialData.items.length === 0 ? (
            <div className="empty-state">
              Audit history will populate automatically as work happens on this case.
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="empty-state">
              No matching audit events for the current filters. Expand the date range or clear the search to inspect more history.
            </div>
          ) : (
            <div className="audit-feed-list">
              {filteredEvents.map((event) => (
                <button
                  className={cn("audit-event-row", selectedEvent?.id === event.id && "is-selected")}
                  key={event.id}
                  onClick={() => setSelectedEventId(event.id)}
                  type="button"
                >
                  <span className={cn("audit-event-icon", `is-${event.category}`)}>{iconForCategory(event.category)}</span>
                  <div className="audit-event-body">
                    <div className="audit-event-head">
                      <div className="audit-event-badges">
                        <span className="audit-chip">{labelForCategory(event.category)}</span>
                        <span className={cn("audit-chip", `is-${event.source}`)}>{labelForSource(event.source)}</span>
                        <span className="audit-chip">{event.entityType}</span>
                      </div>
                      <span className="row-meta">{formatDateTime(event.createdAt)}</span>
                    </div>
                    <p className="audit-event-summary">{event.summary}</p>
                    <p className="row-meta">
                      {event.actorLabel}
                      {event.diffEntries[0] ? `  -  ${event.diffEntries[0].field}: ${event.diffEntries[0].before} -> ${event.diffEntries[0].after}` : ""}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="surface-card audit-detail-panel">
          {selectedEvent ? (
            <>
              <div className="audit-detail-head">
                <div>
                  <p className="eyebrow-label">Event Detail</p>
                  <h3 className="section-title">{selectedEvent.summary}</h3>
                </div>
                <span className={cn("audit-chip", `is-${selectedEvent.source}`)}>{labelForSource(selectedEvent.source)}</span>
              </div>

              <dl className="audit-detail-grid">
                <AuditMeta label="Action" value={selectedEvent.action} />
                <AuditMeta label="Actor" value={selectedEvent.actorLabel} />
                <AuditMeta label="Entity" value={selectedEvent.entityType} />
                <AuditMeta label="Recorded at" value={formatDateTime(selectedEvent.createdAt)} />
                <AuditMeta label="IP address" value={selectedEvent.ipAddress ?? "Not captured"} />
                <AuditMeta label="User agent" value={selectedEvent.userAgent ?? "Not captured"} />
              </dl>

              <div className="audit-detail-section">
                <h4 className="section-title">Change diff</h4>
                {selectedEvent.diffEntries.length > 0 ? (
                  <div className="audit-diff-table">
                    {selectedEvent.diffEntries.map((entry) => (
                      <div className="audit-diff-row" key={`${selectedEvent.id}-${entry.field}`}>
                        <span className="audit-diff-field">{entry.field}</span>
                        <span className="audit-diff-before">{entry.before}</span>
                        <span className="audit-diff-arrow">{"->"}</span>
                        <span className="audit-diff-after">{entry.after}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state audit-empty-inline">
                    No field-level diff was captured for this event. The summary still records the operational action.
                  </div>
                )}
              </div>

              {selectedEvent.relatedItems.length > 0 ? (
                <div className="audit-detail-section">
                  <h4 className="section-title">Related links</h4>
                  <div className="audit-link-list">
                    {selectedEvent.relatedItems.map((item) => (
                      <a className="panel-link" href={item.href} key={item.href}>
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <div className="empty-state">Select an audit event to inspect its details.</div>
          )}
        </div>
      </div>
    </section>
  );
}

function AuditMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="audit-meta-item">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function iconForCategory(category: AuditCategory) {
  switch (category) {
    case "created":
      return "+";
    case "shared":
      return "S";
    case "viewed":
      return "V";
    case "uploaded":
      return "U";
    case "billing":
      return "$";
    case "client_activity":
      return "C";
    case "ai":
      return "A";
    default:
      return "*";
  }
}

function labelForCategory(category: AuditCategory) {
  switch (category) {
    case "client_activity":
      return "Client Activity";
    default:
      return category.charAt(0).toUpperCase() + category.slice(1);
  }
}

function labelForSource(source: AuditSource) {
  return source.charAt(0).toUpperCase() + source.slice(1);
}
