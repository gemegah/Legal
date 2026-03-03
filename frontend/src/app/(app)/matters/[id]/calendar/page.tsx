import { MatterCalendarClient } from "@/features/calendar/components/CalendarWorkspace";
import { getEventsByMatter } from "@/features/calendar/server/queries";
import { getMatterById } from "@/features/matters/server/queries";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const [{ events }, matter] = await Promise.all([getEventsByMatter(params.id), getMatterById(params.id)]);

  return <MatterCalendarClient initialEvents={events} matterTitle={matter?.title} />;
}
