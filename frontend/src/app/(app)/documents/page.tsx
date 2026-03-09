import { DocumentsWorkspaceClient } from "@/features/documents/components/DocumentsWorkspaceClient";
import { getDocumentWorkspace } from "@/features/documents/server/queries";

export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await getDocumentWorkspace();

  return <DocumentsWorkspaceClient initialData={data} />;
}
