import { CaseCalendarClient } from "@/features/calendar/components/CalendarWorkspace";
import { getEventsByCase } from "@/features/calendar/server/queries";
import { getCaseById } from "@/features/cases/server/queries";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const [{ events }, caseDetail] = await Promise.all([getEventsByCase(params.id), getCaseById(params.id)]);

  return <CaseCalendarClient initialEvents={events} caseTitle={caseDetail?.title} />;
}
