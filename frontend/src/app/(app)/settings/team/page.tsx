import { TeamSettingsClient } from "@/features/settings/components/TeamSettingsClient";
import { getTeamSettingsData } from "@/features/settings/server/queries";

export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await getTeamSettingsData();

  return <TeamSettingsClient initialData={data} />;
}
