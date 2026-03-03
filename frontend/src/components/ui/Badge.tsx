import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface BadgeProps {
  children: ReactNode;
  className?: string;
  tone?: "default" | "success" | "warning" | "danger" | "info";
}

export function Badge({ children, className, tone = "default" }: BadgeProps) {
  return <span className={cn("ui-badge", `ui-badge-${tone}`, className)}>{children}</span>;
}
