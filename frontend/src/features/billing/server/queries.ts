import "server-only";

import { cache } from "react";

import type { BillingWorkspaceData, Invoice, CaseBillingData } from "@/features/billing/types";

import { billingRepository } from "./repository";

export const getInvoiceById = cache(async (id: string): Promise<Invoice | null> => {
  if (!id) {
    return null;
  }

  return billingRepository.getInvoiceById(id);
});

export const getBillingWorkspace = cache(async (): Promise<BillingWorkspaceData> => {
  const [invoices, timeEntries] = await Promise.all([
    billingRepository.listInvoices(),
    billingRepository.listTimeEntries(),
  ]);

  return { invoices, timeEntries };
});

export const getCaseBilling = cache(async (caseId: string): Promise<CaseBillingData> => {
  if (!caseId) {
    return { invoices: [], timeEntries: [] };
  }

  const [invoices, timeEntries] = await Promise.all([
    billingRepository.listInvoicesByCase(caseId),
    billingRepository.listTimeEntriesByCase(caseId),
  ]);

  return { invoices, timeEntries };
});
