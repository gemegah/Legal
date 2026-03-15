import { CasesWorkspaceClient } from "@/features/cases/components/CasesWorkspaceClient";
import { getCaseWorkspace } from "@/features/cases/server/queries";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { cases, stats } = await getCaseWorkspace();

  return <CasesWorkspaceClient initialCases={cases} initialStats={stats} />;
}
