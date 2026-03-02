import type { ReactNode } from "react";

import { MatterShell } from "@/components/matter/MatterShell";

interface LayoutProps {
  children: ReactNode;
  params: {
    id: string;
  };
}

export default function Layout({ children, params }: LayoutProps) {
  return <MatterShell matterId={params.id}>{children}</MatterShell>;
}
