import { SharedCalendarClient } from "@/features/calendar/components/CalendarWorkspace";
import { getCalendarWorkspace } from "@/features/calendar/server/queries";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { events } = await getCalendarWorkspace();

  return <SharedCalendarClient initialEvents={events} />;
}
