import type { CaseListItem, CaseWorkspaceStats } from "@/features/cases/types";

export function computeCaseWorkspaceStats(cases: CaseListItem[]): CaseWorkspaceStats {
  return {
    activeCount: cases.filter((item) => item.status === "active").length,
    pendingCount: cases.filter((item) => item.status === "pending").length,
    dueThisWeekCount: cases.filter((item) => isDueThisWeek(item.nextDeadlineAt)).length,
    outstandingBalanceGhs: cases.reduce((total, item) => total + item.unpaidBalanceGhs, 0),
  };
}

function isDueThisWeek(nextDeadlineAt: string | null): boolean {
  if (!nextDeadlineAt) {
    return false;
  }

  const now = new Date();
  const deadline = new Date(nextDeadlineAt);
  const diffDays = (deadline.getTime() - now.getTime()) / 86400000;

  return diffDays >= 0 && diffDays <= 7;
}
