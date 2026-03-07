import { MatterBillingClient } from "@/features/billing/components/MatterBillingClient";
import { getMatterBilling } from "@/features/billing/server/queries";
import { getMatterById } from "@/features/matters/server/queries";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { id: string };
}

export default async function Page({ params }: PageProps) {
  const [matter, { invoices, timeEntries }] = await Promise.all([
    getMatterById(params.id),
    getMatterBilling(params.id),
  ]);

  return (
    <MatterBillingClient
      initialInvoices={invoices}
      initialTimeEntries={timeEntries}
      matterId={params.id}
      matterTitle={matter?.title ?? "This Matter"}
    />
  );
}
