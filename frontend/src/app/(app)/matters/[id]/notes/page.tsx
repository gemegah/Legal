import { MatterNotesClient } from "@/features/notes/components/MatterNotesClient";
import { getMatterNotes } from "@/features/notes/server/queries";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const notes = await getMatterNotes(params.id);

  return <MatterNotesClient initialNotes={notes} matterId={params.id} />;
}
