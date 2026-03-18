import { DocumentsWorkspaceClient } from "@/features/documents/components/DocumentsWorkspaceClient";
import { getCaseDocumentWorkspace } from "@/features/documents/server/queries";
import { getCaseById } from "@/features/cases/server/queries";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const [caseDetail, data] = await Promise.all([
    getCaseById(params.id),
    getCaseDocumentWorkspace(params.id),
  ]);

  return <DocumentsWorkspaceClient initialData={data} caseDetail={caseDetail} />;
}
