"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

import type {
  CaseDetail,
  CaseKpi,
  CaseStatus,
  CaseTabKey,
  PractitionerRole,
} from "@/features/cases/types";
import { cn, formatDate, formatGHS } from "@/lib/utils";

export interface CaseShellProps {
  caseId: string;
  caseDetail: CaseDetail | null;
  children: ReactNode;
  showOverviewKpis?: boolean;
}

interface CaseTab {
  key: CaseTabKey;
  label: string;
  href: string;
}

interface ActionConfig {
  label: string;
  variant: "primary" | "accent" | "ghost";
  tab?: string;
}

const currentUserRole: PractitionerRole = "admin";

function buildTabs(caseId: string): CaseTab[] {
  const basePath = `/cases/${caseId}`;

  return [
    { key: "overview", label: "Overview", href: basePath },
    { key: "tasks", label: "Tasks", href: `${basePath}/tasks` },
    { key: "calendar", label: "Calendar", href: `${basePath}/calendar` },
    { key: "documents", label: "Documents", href: `${basePath}/documents` },
    { key: "billing", label: "Billing", href: `${basePath}/billing` },
    { key: "notes", label: "Notes", href: `${basePath}/notes` },
    { key: "audit", label: "Audit", href: `${basePath}/audit` },
  ];
}

const roleActions: Record<PractitionerRole, ActionConfig[]> = {
  admin: [
    { label: "Edit Case", variant: "primary" },
    { label: "Add Task", variant: "ghost", tab: "tasks" },
    { label: "Log Time", variant: "ghost" },
    { label: "Upload Document", variant: "ghost", tab: "documents" },
    { label: "Request AI Summary", variant: "ghost" },
    { label: "Archive Case", variant: "accent" },
  ],
  lawyer: [
    { label: "Edit Case", variant: "primary" },
    { label: "Add Task", variant: "ghost", tab: "tasks" },
    { label: "Log Time", variant: "ghost" },
    { label: "Upload Document", variant: "ghost", tab: "documents" },
    { label: "Request AI Summary", variant: "accent" },
  ],
  staff: [
    { label: "Add Task", variant: "primary", tab: "tasks" },
    { label: "Log Time", variant: "ghost" },
    { label: "Upload Document", variant: "ghost", tab: "documents" },
    { label: "View Billing", variant: "ghost", tab: "billing" },
  ],
};

export function CaseShell({
  caseId,
  caseDetail,
  children,
  showOverviewKpis,
}: CaseShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const tabs = buildTabs(caseId);
  const activeTab = getActiveTab(pathname, caseId);
  const shouldShowOverviewKpis = showOverviewKpis ?? activeTab === "overview";

  if (!caseDetail) {
    return (
      <section className="case-shell">
        <div className="surface-card case-feedback-card">
          <p className="eyebrow-label">Case Workspace</p>
          <h2 className="section-title">Case unavailable</h2>
          <p className="placeholder-copy">
            This case could not be loaded. Check the route context or reconnect the data source.
          </p>
          <Link className="panel-link" href="/cases">
            Return to cases
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="case-shell">
      <div className="surface-card case-shell-card">
        <div className="case-breadcrumb">
          <Link href="/cases">Cases</Link>
          <span>/</span>
          <span>{caseDetail.title}</span>
        </div>

        <div className="case-shell-header">
          <div className="case-title-group">
            <p className="eyebrow-label">{caseDetail.reference}</p>
            <h2 className="case-title">{caseDetail.title}</h2>
            <div className="case-chip-row">
              <span className={cn("case-status-pill", `is-${caseDetail.status}`)}>
                {formatStatusLabel(caseDetail.status)}
              </span>
              <span className="case-detail-chip">{caseDetail.caseType}</span>
              <span className="case-detail-chip">{caseDetail.practiceArea}</span>
            </div>
          </div>

          <div className="case-shell-controls">
            <div className="case-action-row">
              {roleActions[currentUserRole].map((action) => (
                <button
                  className={cn("btn", getActionClassName(action.variant), "case-action-button")}
                  key={action.label}
                  onClick={action.tab ? () => router.push(`/cases/${caseId}/${action.tab}`) : undefined}
                  type="button"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <dl className="case-meta-grid">
          <MetaItem label="Client" value={caseDetail.clientName} />
          <MetaItem label="Lead Lawyer" value={caseDetail.leadLawyerName} />
          <MetaItem label="Court" value={caseDetail.court} />
          <MetaItem label="Suit Number" value={caseDetail.suitNumber} />
          <MetaItem
            label="Next Deadline"
            value={caseDetail.nextDeadlineAt ? formatDate(caseDetail.nextDeadlineAt) : null}
            auxiliary={
              caseDetail.nextDeadlineAt
                ? `(${formatDeadlineCountdown(caseDetail.nextDeadlineAt)})`
                : undefined
            }
          />
          <MetaItem label="Opened" value={formatDate(caseDetail.openedAt)} />
          <MetaItem label="Opposing Party" value={caseDetail.opposingParty} />
          <MetaItem label="Opposing Counsel" value={caseDetail.opposingCounsel} />
        </dl>

        <nav aria-label="Case sections" className="case-tab-nav">
          {tabs.map((tab) => (
            <Link
              className={cn("case-tab-link", activeTab === tab.key && "is-active")}
              href={tab.href}
              key={tab.key}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>

      {shouldShowOverviewKpis ? (
        <div className="case-kpi-grid">
          {buildCaseKpis(caseDetail).map((item) => (
            <div className="surface-card case-kpi-card" key={item.label}>
              <p className="eyebrow-label">{item.label}</p>
              <p className={cn("case-kpi-value", `is-${item.tone}`)}>{item.value}</p>
              <p className="case-kpi-copy">{item.subtext}</p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="case-shell-body">{children}</div>
    </section>
  );
}

function MetaItem({
  label,
  value,
  auxiliary,
}: {
  label: string;
  value: string | null;
  auxiliary?: string;
}) {
  return (
    <div className="case-meta-item">
      <dt>{label}</dt>
      <dd>
        {value ?? "--"}
        {auxiliary ? <span>{` ${auxiliary}`}</span> : null}
      </dd>
    </div>
  );
}

function buildCaseKpis(caseDetail: CaseDetail): CaseKpi[] {
  return [
    {
      label: "Status",
      value: formatStatusLabel(caseDetail.status),
      subtext: "Pleadings settled and filing sequence is in progress.",
      tone: "success",
    },
    {
      label: "Next Deadline",
      value: caseDetail.nextDeadlineAt ? formatDeadlineCountdown(caseDetail.nextDeadlineAt) : "--",
      subtext: caseDetail.nextDeadlineAt ? formatDate(caseDetail.nextDeadlineAt) : "No deadline recorded",
      tone: getDeadlineTone(caseDetail.nextDeadlineAt),
    },
    {
      label: "Unpaid Balance",
      value: formatGHS(caseDetail.unpaidBalanceGhs),
      subtext: "Outstanding time and filing-related disbursements.",
      tone: caseDetail.unpaidBalanceGhs > 0 ? "warning" : "default",
    },
    {
      label: "Recent Activity",
      value: `${caseDetail.recentActivityCount} updates`,
      subtext: caseDetail.recentActivitySummary,
      tone: "default",
    },
  ];
}

function getActiveTab(pathname: string, caseId: string): CaseTabKey {
  const basePath = `/cases/${caseId}`;

  if (pathname === basePath) {
    return "overview";
  }

  if (pathname.startsWith(`${basePath}/tasks`)) {
    return "tasks";
  }

  if (pathname.startsWith(`${basePath}/calendar`)) {
    return "calendar";
  }

  if (pathname.startsWith(`${basePath}/documents`)) {
    return "documents";
  }

  if (pathname.startsWith(`${basePath}/billing`)) {
    return "billing";
  }

  if (pathname.startsWith(`${basePath}/notes`)) {
    return "notes";
  }

  if (pathname.startsWith(`${basePath}/audit`)) {
    return "audit";
  }

  return "overview";
}

function formatDeadlineCountdown(nextDeadlineAt: string): string {
  const deadline = new Date(nextDeadlineAt);
  const now = new Date();
  const deadlineStart = new Date(
    deadline.getFullYear(),
    deadline.getMonth(),
    deadline.getDate(),
  );
  const nowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.round((deadlineStart.getTime() - nowStart.getTime()) / 86400000);

  if (diffDays < 0) {
    return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? "" : "s"}`;
  }

  if (diffDays === 0) {
    return "Due today";
  }

  if (diffDays === 1) {
    return "1 day left";
  }

  return `${diffDays} days left`;
}

function getDeadlineTone(nextDeadlineAt: string | null): CaseKpi["tone"] {
  if (!nextDeadlineAt) {
    return "default";
  }

  const deadline = new Date(nextDeadlineAt);
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  const diffDays = diff / 86400000;

  if (diffDays <= 1) {
    return "danger";
  }

  if (diffDays <= 5) {
    return "warning";
  }

  return "success";
}

function getActionClassName(variant: ActionConfig["variant"]): string {
  if (variant === "primary") {
    return "btn-primary";
  }

  if (variant === "accent") {
    return "btn-accent";
  }

  return "btn-ghost";
}

function formatStatusLabel(status: CaseStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
