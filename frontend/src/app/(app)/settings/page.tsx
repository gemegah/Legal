import { SettingsOverview } from "@/features/settings/components/SettingsOverview";
import { getSettingsWorkspace } from "@/features/settings/server/queries";

export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await getSettingsWorkspace();

  return <SettingsOverview workspace={data} />;
}
