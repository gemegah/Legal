import { PracticeSettingsClient } from "@/features/settings/components/PracticeSettingsClient";
import { getPracticeSettingsData } from "@/features/settings/server/queries";

export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await getPracticeSettingsData();

  return <PracticeSettingsClient initialData={data} />;
}
