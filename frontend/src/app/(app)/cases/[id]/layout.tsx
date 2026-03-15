import type { ReactNode } from "react";

import { CaseShell } from "@/components/case/CaseShell";
import { getCaseById } from "@/features/cases/server/queries";

export const dynamic = "force-dynamic";

interface LayoutProps {
  children: ReactNode;
  params: {
    id: string;
  };
}

export default async function Layout({ children, params }: LayoutProps) {
  const caseDetail = await getCaseById(params.id);

  return (
    <CaseShell caseDetail={caseDetail} caseId={params.id}>
      {children}
    </CaseShell>
  );
}
