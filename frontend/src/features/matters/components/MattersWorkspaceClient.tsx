"use client";

import { useDeferredValue, useState } from "react";

import { MatterCard } from "@/components/matter/MatterCard";
import { MatterTable } from "@/components/matter/MatterTable";
import type {
  MatterListFilter,
  MatterListItem,
  MatterWorkspaceStats,
} from "@/features/matters/types";
import { formatGHS } from "@/lib/utils";

const filters: Array<{ key: MatterListFilter; label: string }> = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "pending", label: "Pending" },
  { key: "closed", label: "Closed" },
  { key: "archived", label: "Archived" },
];

export interface MattersWorkspaceClientProps {
  initialMatters: MatterListItem[];
  initialStats: MatterWorkspaceStats;
}

export function MattersWorkspaceClient({
  initialMatters,
  initialStats,
}: MattersWorkspaceClientProps) {
  const [activeFilter, setActiveFilter] = useState<MatterListFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [assignedToMeOnly, setAssignedToMeOnly] = useState(false);
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const query = deferredSearchQuery.trim().toLowerCase();

  const filteredMatters = initialMatters.filter((matter) => {
    if (activeFilter !== "all" && matter.status !== activeFilter) {
      return false;
    }

    if (assignedToMeOnly && !matter.assignedToMe) {
      return false;
    }

    if (!query) {
      return true;
    }

    return [
      matter.reference,
      matter.title,
      matter.clientName,
      matter.practiceArea,
    ].some((value) => value.toLowerCase().includes(query));
  });

  return (
    <section className="matter-workspace">
      <div className="surface-card matter-workspace-hero">
        <div className="matter-workspace-hero-copy">
          <p className="eyebrow-label">Practitioner Workspace</p>
          <h2 className="matter-title">Matter Workspace</h2>
          <p className="matter-workspace-copy">
            Track matter status, upcoming deadlines, and billing exposure from one shared queue.
          </p>
        </div>

        <div className="matter-workspace-actions">
          <button className="btn btn-ghost" type="button">
            Export
          </button>
          <button className="btn btn-primary" type="button">
            + New Matter
          </button>
        </div>
      </div>

      <div className="matter-workspace-stats">
        <StatCard
          label="Active Matters"
          value={String(initialStats.activeCount)}
          subtext="Live matters moving through the firm."
          tone="default"
        />
        <StatCard
          label="Pending Matters"
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
          subtext="Total unbilled or unpaid matter exposure."
          tone="success"
        />
      </div>

      <div className="surface-card matter-workspace-panel">
        <div className="matter-workspace-toolbar">
          <div className="matter-filter-tabs" role="tablist" aria-label="Matter filters">
            {filters.map((filter) => (
              <button
                aria-pressed={activeFilter === filter.key}
                className={`matter-filter-tab${activeFilter === filter.key ? " is-active" : ""}`}
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                type="button"
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="matter-toolbar-controls">
            <label className="matter-search-field" aria-label="Search matters">
              <SearchIcon />
              <input
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search matter, client, or practice area"
                type="search"
                value={searchQuery}
              />
            </label>

            <button
              aria-pressed={assignedToMeOnly}
              className={`btn btn-ghost matter-filter-button${assignedToMeOnly ? " is-active" : ""}`}
              onClick={() => setAssignedToMeOnly((current) => !current)}
              type="button"
            >
              Assigned to Me
            </button>

            <button className="btn btn-ghost matter-filter-button" type="button">
              Practice Area
            </button>
          </div>
        </div>

        <div className="matter-table-desktop">
          <MatterTable items={filteredMatters} />
        </div>

        <div className="matter-card-stack">
          {filteredMatters.length > 0 ? (
            filteredMatters.map((item) => <MatterCard item={item} key={item.id} />)
          ) : (
            <div className="empty-state matter-list-empty">No matters match your current filters.</div>
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
    <div className="surface-card matter-workspace-stat">
      <p className="eyebrow-label">{label}</p>
      <p className={`matter-workspace-stat-value is-${tone}`}>{value}</p>
      <p className="matter-workspace-copy">{subtext}</p>
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
