import { MatterAuditClient } from "@/features/audit/components/MatterAuditClient";
import { getMatterAudit } from "@/features/audit/server/queries";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const data = await getMatterAudit(params.id);

  return <MatterAuditClient initialData={data} />;
}
