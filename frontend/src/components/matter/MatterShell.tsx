"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import type {
  MatterDetail,
  MatterKpi,
  MatterStatus,
  MatterTabKey,
  PractitionerRole,
} from "@/features/matters/types";
import { cn, formatDate, formatGHS } from "@/lib/utils";

export interface MatterShellProps {
  matterId: string;
  matter: MatterDetail | null;
  children: ReactNode;
  showOverviewKpis?: boolean;
}

interface MatterTab {
  key: MatterTabKey;
  label: string;
  href: string;
}

interface ActionConfig {
  label: string;
  variant: "primary" | "accent" | "ghost";
}

const currentUserRole: PractitionerRole = "admin";

function buildTabs(matterId: string): MatterTab[] {
  const basePath = `/matters/${matterId}`;

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
    { label: "Edit Matter", variant: "primary" },
    { label: "Add Task", variant: "ghost" },
    { label: "Log Time", variant: "ghost" },
    { label: "Upload Document", variant: "ghost" },
    { label: "Request AI Summary", variant: "ghost" },
    { label: "Archive Matter", variant: "accent" },
  ],
  lawyer: [
    { label: "Edit Matter", variant: "primary" },
    { label: "Add Task", variant: "ghost" },
    { label: "Log Time", variant: "ghost" },
    { label: "Upload Document", variant: "ghost" },
    { label: "Request AI Summary", variant: "accent" },
  ],
  staff: [
    { label: "Add Task", variant: "primary" },
    { label: "Log Time", variant: "ghost" },
    { label: "Upload Document", variant: "ghost" },
    { label: "View Billing", variant: "ghost" },
  ],
};

export function MatterShell({
  matterId,
  matter,
  children,
  showOverviewKpis,
}: MatterShellProps) {
  const pathname = usePathname();

  const tabs = buildTabs(matterId);
  const activeTab = getActiveTab(pathname, matterId);
  const shouldShowOverviewKpis = showOverviewKpis ?? activeTab === "overview";

  if (!matter) {
    return (
      <section className="matter-shell">
        <div className="surface-card matter-feedback-card">
          <p className="eyebrow-label">Matter Workspace</p>
          <h2 className="section-title">Matter unavailable</h2>
          <p className="placeholder-copy">
            This matter could not be loaded. Check the route context or reconnect the data source.
          </p>
          <Link className="panel-link" href="/matters">
            Return to matters
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="matter-shell">
      <div className="surface-card matter-shell-card">
        <div className="matter-breadcrumb">
          <Link href="/matters">Matters</Link>
          <span>/</span>
          <span>{matter.title}</span>
        </div>

        <div className="matter-shell-header">
          <div className="matter-title-group">
            <p className="eyebrow-label">{matter.reference}</p>
            <h2 className="matter-title">{matter.title}</h2>
            <div className="matter-chip-row">
              <span className={cn("matter-status-pill", `is-${matter.status}`)}>
                {formatStatusLabel(matter.status)}
              </span>
              <span className="matter-detail-chip">{matter.matterType}</span>
              <span className="matter-detail-chip">{matter.practiceArea}</span>
            </div>
          </div>

          <div className="matter-shell-controls">
            <div className="matter-action-row">
              {roleActions[currentUserRole].map((action) => (
                <button
                  className={cn("btn", getActionClassName(action.variant), "matter-action-button")}
                  key={action.label}
                  type="button"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <dl className="matter-meta-grid">
          <MetaItem label="Client" value={matter.clientName} />
          <MetaItem label="Lead Lawyer" value={matter.leadLawyerName} />
          <MetaItem label="Court" value={matter.court} />
          <MetaItem label="Suit Number" value={matter.suitNumber} />
          <MetaItem
            label="Next Deadline"
            value={matter.nextDeadlineAt ? formatDate(matter.nextDeadlineAt) : null}
            auxiliary={
              matter.nextDeadlineAt ? `(${formatDeadlineCountdown(matter.nextDeadlineAt)})` : undefined
            }
          />
          <MetaItem label="Opened" value={formatDate(matter.openedAt)} />
          <MetaItem label="Opposing Party" value={matter.opposingParty} />
          <MetaItem label="Opposing Counsel" value={matter.opposingCounsel} />
        </dl>

        <nav aria-label="Matter sections" className="matter-tab-nav">
          {tabs.map((tab) => (
            <Link
              className={cn("matter-tab-link", activeTab === tab.key && "is-active")}
              href={tab.href}
              key={tab.key}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>

      {shouldShowOverviewKpis ? (
        <div className="matter-kpi-grid">
          {buildMatterKpis(matter).map((item) => (
            <div className="surface-card matter-kpi-card" key={item.label}>
              <p className="eyebrow-label">{item.label}</p>
              <p className={cn("matter-kpi-value", `is-${item.tone}`)}>{item.value}</p>
              <p className="matter-kpi-copy">{item.subtext}</p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="matter-shell-body">{children}</div>
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
    <div className="matter-meta-item">
      <dt>{label}</dt>
      <dd>
        {value ?? "--"}
        {auxiliary ? <span>{` ${auxiliary}`}</span> : null}
      </dd>
    </div>
  );
}

function buildMatterKpis(matter: MatterDetail): MatterKpi[] {
  return [
    {
      label: "Status",
      value: formatStatusLabel(matter.status),
      subtext: "Pleadings settled and filing sequence is in progress.",
      tone: "success",
    },
    {
      label: "Next Deadline",
      value: matter.nextDeadlineAt ? formatDeadlineCountdown(matter.nextDeadlineAt) : "--",
      subtext: matter.nextDeadlineAt ? formatDate(matter.nextDeadlineAt) : "No deadline recorded",
      tone: getDeadlineTone(matter.nextDeadlineAt),
    },
    {
      label: "Unpaid Balance",
      value: formatGHS(matter.unpaidBalanceGhs),
      subtext: "Outstanding time and filing-related disbursements.",
      tone: matter.unpaidBalanceGhs > 0 ? "warning" : "default",
    },
    {
      label: "Recent Activity",
      value: `${matter.recentActivityCount} updates`,
      subtext: matter.recentActivitySummary,
      tone: "default",
    },
  ];
}

function getActiveTab(pathname: string, matterId: string): MatterTabKey {
  const basePath = `/matters/${matterId}`;

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

function getDeadlineTone(nextDeadlineAt: string | null): MatterKpi["tone"] {
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

function formatStatusLabel(status: MatterStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
