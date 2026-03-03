import { MattersWorkspaceClient } from "@/features/matters/components/MattersWorkspaceClient";
import { getMatterWorkspace } from "@/features/matters/server/queries";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { matters, stats } = await getMatterWorkspace();

  return <MattersWorkspaceClient initialMatters={matters} initialStats={stats} />;
}
