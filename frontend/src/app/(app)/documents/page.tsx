import { DocumentsWorkspaceClient } from "@/features/documents/components/DocumentsWorkspaceClient";
import { getDocumentWorkspace } from "@/features/documents/server/queries";
import { getApiBaseUrl, getDataSource } from "@/lib/data-source";

export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await getDocumentWorkspace();
  const dataSource = getDataSource();

  return (
    <DocumentsWorkspaceClient
      apiBaseUrl={dataSource === "api" ? getApiBaseUrl() : null}
      dataSource={dataSource}
      initialData={data}
    />
  );
}
