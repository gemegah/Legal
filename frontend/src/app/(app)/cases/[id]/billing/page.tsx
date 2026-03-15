import { CaseBillingClient } from "@/features/billing/components/CaseBillingClient";
import { getCaseBilling } from "@/features/billing/server/queries";
import { getCaseById } from "@/features/cases/server/queries";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { id: string };
}

export default async function Page({ params }: PageProps) {
  const [caseDetail, { invoices, timeEntries }] = await Promise.all([
    getCaseById(params.id),
    getCaseBilling(params.id),
  ]);

  return (
    <CaseBillingClient
      initialInvoices={invoices}
      initialTimeEntries={timeEntries}
      caseId={params.id}
      caseTitle={caseDetail?.title ?? "This Case"}
    />
  );
}
