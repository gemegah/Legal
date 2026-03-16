import "server-only";

import {
  getMockInvoiceById,
  listMockInvoices,
  listMockInvoicesByCase,
  listMockTimeEntries,
  listMockTimeEntriesByCase,
} from "@/features/billing/data/mock";
import type { Invoice, TimeEntry } from "@/features/billing/types";
import { getDataSource } from "@/lib/data-source";

export interface BillingRepository {
  getInvoiceById(id: string): Promise<Invoice | null>;
  listInvoices(): Promise<Invoice[]>;
  listInvoicesByCase(caseId: string): Promise<Invoice[]>;
  listTimeEntries(): Promise<TimeEntry[]>;
  listTimeEntriesByCase(caseId: string): Promise<TimeEntry[]>;
}

export const mockBillingRepository: BillingRepository = {
  async getInvoiceById(id) {
    return getMockInvoiceById(id);
  },
  async listInvoices() {
    return listMockInvoices();
  },
  async listInvoicesByCase(caseId) {
    return listMockInvoicesByCase(caseId);
  },
  async listTimeEntries() {
    return listMockTimeEntries();
  },
  async listTimeEntriesByCase(caseId) {
    return listMockTimeEntriesByCase(caseId);
  },
};

export const apiBillingRepository: BillingRepository = {
  async getInvoiceById() {
    throw new Error('Billing API repository is not wired yet. Use DATA_SOURCE="mock" until the backend slice is implemented.');
  },
  async listInvoices() {
    throw new Error('Billing API repository is not wired yet. Use DATA_SOURCE="mock" until the backend slice is implemented.');
  },
  async listInvoicesByCase() {
    throw new Error('Billing API repository is not wired yet. Use DATA_SOURCE="mock" until the backend slice is implemented.');
  },
  async listTimeEntries() {
    throw new Error('Billing API repository is not wired yet. Use DATA_SOURCE="mock" until the backend slice is implemented.');
  },
  async listTimeEntriesByCase() {
    throw new Error('Billing API repository is not wired yet. Use DATA_SOURCE="mock" until the backend slice is implemented.');
  },
};

function createBillingRepository(): BillingRepository {
  return getDataSource() === "api" ? apiBillingRepository : mockBillingRepository;
}

export const billingRepository: BillingRepository = createBillingRepository();
