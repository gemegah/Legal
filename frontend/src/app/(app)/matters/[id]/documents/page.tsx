import { DocumentsWorkspaceClient } from "@/features/documents/components/DocumentsWorkspaceClient";
import { getMatterDocumentWorkspace } from "@/features/documents/server/queries";
import { getMatterById } from "@/features/matters/server/queries";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const [matter, data] = await Promise.all([
    getMatterById(params.id),
    getMatterDocumentWorkspace(params.id),
  ]);

  return <DocumentsWorkspaceClient initialData={data} matter={matter} />;
}
