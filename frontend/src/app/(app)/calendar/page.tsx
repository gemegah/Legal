import dynamicImport from "next/dynamic";
import { getCalendarWorkspace } from "@/features/calendar/server/queries";
import CalendarLoading from "./loading";

const SharedCalendarClient = dynamicImport(
  () => import("@/features/calendar/components/CalendarWorkspace").then((m) => m.SharedCalendarClient),
  { ssr: false, loading: () => <CalendarLoading /> }
);

export const dynamic = "force-dynamic";

export default async function Page() {
  const { events } = await getCalendarWorkspace();

  return <SharedCalendarClient initialEvents={events} />;
}
