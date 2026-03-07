import { BillingWorkspaceClient } from "@/features/billing/components/BillingWorkspace";
import { getBillingWorkspace } from "@/features/billing/server/queries";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { invoices, timeEntries } = await getBillingWorkspace();

  return (
    <BillingWorkspaceClient
      initialInvoices={invoices}
      initialTimeEntries={timeEntries}
    />
  );
}
