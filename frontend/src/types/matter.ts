export type MatterStatus = "active" | "pending" | "closed" | "archived";

export type PractitionerRole = "admin" | "lawyer" | "staff";

export type MatterListFilter = "all" | "active" | "pending" | "closed" | "archived";

export type MatterTabKey =
  | "overview"
  | "tasks"
  | "calendar"
  | "documents"
  | "billing"
  | "notes"
  | "audit";

export interface MatterKpi {
  label: string;
  value: string;
  subtext: string;
  tone: "default" | "warning" | "success" | "danger";
}

export interface MatterTimelineItem {
  id: string;
  title: string;
  detail: string;
  at: string;
}

export interface MatterWorkItem {
  id: string;
  title: string;
  owner: string;
  dueLabel: string;
}

export interface MatterListItem {
  id: string;
  reference: string;
  title: string;
  clientName: string;
  matterType: string;
  practiceArea: string;
  status: MatterStatus;
  leadLawyerName: string;
  nextDeadlineAt: string | null;
  unpaidBalanceGhs: number;
  assignedToMe: boolean;
}

export interface MatterWorkspaceStats {
  activeCount: number;
  pendingCount: number;
  dueThisWeekCount: number;
  outstandingBalanceGhs: number;
}

export interface UseMattersResult {
  matters: MatterListItem[];
  stats: MatterWorkspaceStats;
  isLoading: boolean;
  isError: boolean;
}

export interface MatterDetail {
  id: string;
  reference: string;
  title: string;
  clientName: string;
  matterType: string;
  practiceArea: string;
  status: MatterStatus;
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
  recentTimeline: MatterTimelineItem[];
  outstandingWork: MatterWorkItem[];
}
