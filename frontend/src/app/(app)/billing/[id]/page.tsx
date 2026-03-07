import { notFound } from "next/navigation";

import { InvoiceDetailClient } from "@/features/billing/components/InvoiceDetailClient";
import { getInvoiceById } from "@/features/billing/server/queries";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { id: string };
}

export default async function Page({ params }: PageProps) {
  const invoice = await getInvoiceById(params.id);

  if (!invoice) {
    notFound();
  }

  return <InvoiceDetailClient invoice={invoice} />;
}
