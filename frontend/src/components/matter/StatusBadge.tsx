import type { MatterStatus } from "@/features/matters/types";
import { cn } from "@/lib/utils";

export interface StatusBadgeProps {
  status: MatterStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={cn("matter-status-pill", `is-${status}`)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
