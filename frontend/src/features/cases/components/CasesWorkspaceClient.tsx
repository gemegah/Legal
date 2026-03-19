"use client";

import { useDeferredValue, useState } from "react";

import { CaseCard } from "@/components/case/CaseCard";
import { CaseTable } from "@/components/case/CaseTable";
import type {
  CaseListFilter,
  CaseListItem,
  CaseWorkspaceStats,
} from "@/features/cases/types";
import { formatGHS } from "@/lib/utils";

const filters: Array<{ key: CaseListFilter; label: string }> = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "pending", label: "Pending" },
  { key: "closed", label: "Closed" },
  { key: "archived", label: "Archived" },
];

export interface CasesWorkspaceClientProps {
  initialCases: CaseListItem[];
  initialStats: CaseWorkspaceStats;
}

export function CasesWorkspaceClient({
  initialCases,
  initialStats,
}: CasesWorkspaceClientProps) {
  const [activeFilter, setActiveFilter] = useState<CaseListFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [assignedToMeOnly, setAssignedToMeOnly] = useState(false);
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const query = deferredSearchQuery.trim().toLowerCase();

  const filteredCases = initialCases.filter((item) => {
    if (activeFilter !== "all" && item.status !== activeFilter) {
      return false;
    }

    if (assignedToMeOnly && !item.assignedToMe) {
      return false;
    }

    if (!query) {
      return true;
    }

    return [
      item.reference,
      item.title,
      item.clientName,
      item.practiceArea,
    ].some((value) => value.toLowerCase().includes(query));
  });

  return (
    <section className="case-workspace">
        {/* <div className="case-workspace-hero-copy">
          <p className="eyebrow-label">Practitioner Workspace</p>
          <h2 className="case-title">Case Workspace</h2>
          <p className="case-workspace-copy">
            Track case status, upcoming deadlines, and billing exposure from one shared queue.
          </p>
        </div> */}

        <div className="case-workspace-actions" style={{display: 'flex', alignSelf: 'end'}}>
          <button className="btn btn-ghost" type="button">
            Export
          </button>
          <button className="btn btn-primary" type="button">
            + New Case
          </button>
        </div>


      <div className="case-workspace-stats">
        <StatCard
          label="Active Cases"
          value={String(initialStats.activeCount)}
          subtext="Live cases moving through the firm."
          tone="default"
        />
        <StatCard
          label="Pending Cases"
          value={String(initialStats.pendingCount)}
          subtext="Awaiting intake completion or next action."
          tone="warning"
        />
        <StatCard
          label="Due This Week"
          value={String(initialStats.dueThisWeekCount)}
          subtext="Deadlines and filings inside the next 7 days."
          tone="danger"
        />
        <StatCard
          label="Outstanding Balance"
          value={formatGHS(initialStats.outstandingBalanceGhs)}
          subtext="Total unbilled or unpaid case exposure."
          tone="success"
        />
      </div>

      <div className="surface-card case-workspace-panel">
        <div className="case-workspace-toolbar">
          <div className="case-filter-tabs" role="tablist" aria-label="Case filters">
            {filters.map((filter) => (
              <button
                aria-pressed={activeFilter === filter.key}
                className={`case-filter-tab${activeFilter === filter.key ? " is-active" : ""}`}
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                type="button"
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="case-toolbar-controls">
            <label className="case-search-field" aria-label="Search cases">
              <SearchIcon />
              <input
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search case, client, or practice area"
                type="search"
                value={searchQuery}
              />
            </label>

            <button
              aria-pressed={assignedToMeOnly}
              className={`btn btn-ghost case-filter-button${assignedToMeOnly ? " is-active" : ""}`}
              onClick={() => setAssignedToMeOnly((current) => !current)}
              type="button"
            >
              Assigned to Me
            </button>

            <button className="btn btn-ghost case-filter-button" type="button">
              Practice Area
            </button>
          </div>
        </div>

        <div className="case-table-desktop">
          <CaseTable items={filteredCases} />
        </div>

        <div className="case-card-stack">
          {filteredCases.length > 0 ? (
            filteredCases.map((item) => <CaseCard item={item} key={item.id} />)
          ) : (
            <div className="empty-state case-list-empty">No cases match your current filters.</div>
          )}
        </div>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  subtext,
  tone,
}: {
  label: string;
  value: string;
  subtext: string;
  tone: "default" | "warning" | "danger" | "success";
}) {
  return (
    <div className="surface-card case-workspace-stat">
      <p className="eyebrow-label">{label}</p>
      <p className={`case-workspace-stat-value is-${tone}`}>{value}</p>
      <p className="case-workspace-copy">{subtext}</p>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" x2="16.65" y1="21" y2="16.65" />
    </svg>
  );
}
