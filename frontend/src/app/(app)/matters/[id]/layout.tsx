import type { ReactNode } from "react";

import { MatterShell } from "@/components/matter/MatterShell";
import { getMatterById } from "@/features/matters/server/queries";

interface LayoutProps {
  children: ReactNode;
  params: {
    id: string;
  };
}

export default async function Layout({ children, params }: LayoutProps) {
  const matter = await getMatterById(params.id);

  return (
    <MatterShell matter={matter} matterId={params.id}>
      {children}
    </MatterShell>
  );
}
