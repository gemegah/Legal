import { CaseNotesClient } from "@/features/notes/components/CaseNotesClient";
import { getCaseNotes } from "@/features/notes/server/queries";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const notes = await getCaseNotes(params.id);

  return <CaseNotesClient initialNotes={notes} caseId={params.id} />;
}
