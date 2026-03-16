export type CaseStatus = "active" | "pending" | "closed" | "archived";

export type PractitionerRole = "admin" | "lawyer" | "staff";

export type CaseListFilter = "all" | "active" | "pending" | "closed" | "archived";

export type CaseTabKey =
  | "overview"
  | "tasks"
  | "calendar"
  | "documents"
  | "billing"
  | "notes"
  | "audit";

export interface CaseKpi {
  label: string;
  value: string;
  subtext: string;
  tone: "default" | "warning" | "success" | "danger";
}

export interface CaseTimelineItem {
  id: string;
  title: string;
  detail: string;
  at: string;
}

export interface CaseWorkItem {
  id: string;
  title: string;
  owner: string;
  dueLabel: string;
}

export interface CaseListItem {
  id: string;
  reference: string;
  title: string;
  clientName: string;
  caseType: string;
  practiceArea: string;
  status: CaseStatus;
  leadLawyerName: string;
  nextDeadlineAt: string | null;
  unpaidBalanceGhs: number;
  assignedToMe: boolean;
}

export interface CaseWorkspaceStats {
  activeCount: number;
  pendingCount: number;
  dueThisWeekCount: number;
  outstandingBalanceGhs: number;
}

export interface CaseDetail {
  id: string;
  reference: string;
  title: string;
  clientName: string;
  caseType: string;
  practiceArea: string;
  status: CaseStatus;
  court: string | null;
  suitNumber: string | null;
  opposingParty: string | null;
  opposingCounsel: string | null;
  leadLawyerName: string | null;
  nextDeadlineAt: string | null;
  openedAt: string;
  unpaidBalanceGhs: number;
  recentActivitySummary: string;
  recentActivityCount: number;
  summary: string;
  focusNote: string;
  recentTimeline: CaseTimelineItem[];
  outstandingWork: CaseWorkItem[];
}
