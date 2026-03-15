import { CaseAuditClient } from "@/features/audit/components/CaseAuditClient";
import { getCaseAudit } from "@/features/audit/server/queries";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const data = await getCaseAudit(params.id);

  return <CaseAuditClient initialData={data} />;
}
