import type { MatterListItem, MatterWorkspaceStats } from "@/features/matters/types";

export function computeMatterWorkspaceStats(matters: MatterListItem[]): MatterWorkspaceStats {
  return {
    activeCount: matters.filter((matter) => matter.status === "active").length,
    pendingCount: matters.filter((matter) => matter.status === "pending").length,
    dueThisWeekCount: matters.filter((matter) => isDueThisWeek(matter.nextDeadlineAt)).length,
    outstandingBalanceGhs: matters.reduce((total, matter) => total + matter.unpaidBalanceGhs, 0),
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
