"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { CaseTable } from "@/components/case/CaseTable";
import { listMockCases } from "@/features/cases/data/mock";
import type { CaseListItem } from "@/features/cases/types";

import {
  AISuggestionsWidget,
  type AISuggestionPreview,
} from "./AISuggestionsWidget";
import { RecentPayments, type RecentPaymentItem } from "./RecentPayments";
import { StatCards, type DashboardStat } from "./StatCards";
import { TodayDeadlines, type DeadlineItem } from "./TodayDeadlines";

const stats: DashboardStat[] = [
  { label: "Active Cases", value: "12", subtext: "+2 this week", tone: "default" },
  { label: "Due This Week", value: "4", subtext: "2 urgent", tone: "danger" },
  { label: "Outstanding AR", value: "GHS 28,400", subtext: "6 invoices", tone: "warning" },
  { label: "Collected (Feb)", value: "GHS 41,200", subtext: "Up 18% vs Jan", tone: "success" },
];

const deadlines: DeadlineItem[] = [
  {
    time: "09:00",
    label: "Hearing - Asante v. Mensah Industries",
    type: "hearing",
    case: "CAS-2026-014",
    urgent: true,
  },
  {
    time: "12:00",
    label: "Filing deadline - Ayitey Employment",
    type: "filing",
    case: "CAS-2026-007",
    urgent: true,
  },
  {
    time: "14:30",
    label: "Client call - Volta Ridge Developers",
    type: "meeting",
    case: "CAS-2026-009",
  },
  {
    time: "16:00",
    label: "Invoice review - CediCore brief",
    type: "billing",
    case: "CAS-2026-006",
  },
];

const aiSuggestions: AISuggestionPreview[] = [
  {
    id: 1,
    category: "deadline",
    label: "Court order uploaded to CAS-2026-014",
    suggestion:
      "2 new deadlines extracted for review: hearing on Mar 15 and filing on Mar 22.",
  },
  {
    id: 2,
    category: "invoice",
    label: "Invoice draft ready for CAS-2026-007",
    suggestion:
      "4 time entries were grouped into a GHS 6,500 draft with a billing narrative.",
  },
];

const recentPayments: RecentPaymentItem[] = [
  {
    client: "Accra Properties Ltd",
    amount: "GHS 12,000",
    method: "MoMo MTN",
    date: "Today",
    status: "confirmed",
  },
  {
    client: "Kwame Darko",
    amount: "GHS 900",
    method: "Card",
    date: "Yesterday",
    status: "confirmed",
  },
  {
    client: "Mensah Industries",
    amount: "GHS 4,200",
    method: "MoMo MTN",
    date: "Feb 24",
    status: "pending",
  },
];

const previewCases: CaseListItem[] = listMockCases().slice(0, 5);

export function DashboardHome() {
  return (
    <div className="dashboard-shell">
      <section className="panel-card surface-card">
        <div className="panel-header">
          <div>
            <p className="eyebrow-label">Workspace ready</p>
            <h2 className="section-title">Everything due today is already in view.</h2>
            <p className="muted-copy">
              Review deadlines, billing activity, and AI suggestions, or sign out to return to the staff login screen.
            </p>
          </div>

          <div className="button-row">
            <Link className="btn btn-ghost" href="/login">
              Sign Out
            </Link>
          </div>
        </div>
      </section>

      <StatCards items={stats} />

      <section className="dashboard-grid">
        <TodayDeadlines items={deadlines} />

        <div className="dashboard-right-column">
          <AISuggestionsWidget items={aiSuggestions} />
          <RecentPayments items={recentPayments} />
        </div>
      </section>

      <ActiveCasesTable items={previewCases} />
    </div>
  );
}

function ActiveCasesTable({ items }: { items: CaseListItem[] }) {
  const [selectedType, setSelectedType] = useState("");
  const router = useRouter();
  const types = useMemo(() => Array.from(new Set(items.map((item) => item.caseType))).sort(), [items]);
  const visibleItems = selectedType
    ? items.filter((item) => item.caseType === selectedType)
    : items;

  return (
    <section className="table-card">
      <div className="panel-header table-card-header">
        <h2 className="section-title">Active Cases</h2>
        <div className="inline-actions">
          <label className="btn btn-ghost filter-select-field">
            <FilterIcon />
            <select
              onChange={(e) => setSelectedType(e.target.value)}
              value={selectedType}
            >
              <option value="">All Types</option>
              {types.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </label>
          <button className="btn btn-primary" onClick={() => router.push("/cases/new")} type="button">
            + New Case
          </button>
        </div>
      </div>

      <CaseTable items={visibleItems} />

      <div className="table-footer">
        <Link className="panel-link" href="/cases">View all cases</Link>
      </div>
    </section>
  );
}

function FilterIcon() {
  return (
    <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" viewBox="0 0 16 16">
      <line x1="2" x2="14" y1="4" y2="4" />
      <line x1="4" x2="12" y1="8" y2="8" />
      <line x1="6" x2="10" y1="12" y2="12" />
    </svg>
  );
}
