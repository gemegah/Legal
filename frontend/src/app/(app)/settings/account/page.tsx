import { AccountSettingsClient } from "@/features/settings/components/AccountSettingsClient";
import { getAccountSettingsData } from "@/features/settings/server/queries";

export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await getAccountSettingsData();

  return <AccountSettingsClient initialData={data} />;
}
