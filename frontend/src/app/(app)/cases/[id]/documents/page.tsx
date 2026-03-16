import { DocumentsWorkspaceClient } from "@/features/documents/components/DocumentsWorkspaceClient";
import { getCaseDocumentWorkspace } from "@/features/documents/server/queries";
import { getCaseById } from "@/features/cases/server/queries";
import { getApiBaseUrl, getDataSource } from "@/lib/data-source";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const dataSource = getDataSource();
  const [caseDetail, data] = await Promise.all([
    getCaseById(params.id),
    getCaseDocumentWorkspace(params.id),
  ]);

  return (
    <DocumentsWorkspaceClient
      apiBaseUrl={dataSource === "api" ? getApiBaseUrl() : null}
      caseDetail={caseDetail}
      dataSource={dataSource}
      initialData={data}
    />
  );
}
