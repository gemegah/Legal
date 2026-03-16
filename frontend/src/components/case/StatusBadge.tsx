import type { CaseStatus } from "@/features/cases/types";
import { cn } from "@/lib/utils";

export interface StatusBadgeProps {
  status: CaseStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={cn("case-status-pill", `is-${status}`)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
