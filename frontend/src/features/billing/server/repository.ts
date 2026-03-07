import "server-only";

import {
  getMockInvoiceById,
  listMockInvoices,
  listMockInvoicesByMatter,
  listMockTimeEntries,
  listMockTimeEntriesByMatter,
} from "@/features/billing/data/mock";
import type { Invoice, TimeEntry } from "@/features/billing/types";
import { getDataSource } from "@/lib/data-source";

export interface BillingRepository {
  getInvoiceById(id: string): Promise<Invoice | null>;
  listInvoices(): Promise<Invoice[]>;
  listInvoicesByMatter(matterId: string): Promise<Invoice[]>;
  listTimeEntries(): Promise<TimeEntry[]>;
  listTimeEntriesByMatter(matterId: string): Promise<TimeEntry[]>;
}

export const mockBillingRepository: BillingRepository = {
  async getInvoiceById(id) {
    return getMockInvoiceById(id);
  },
  async listInvoices() {
    return listMockInvoices();
  },
  async listInvoicesByMatter(matterId) {
    return listMockInvoicesByMatter(matterId);
  },
  async listTimeEntries() {
    return listMockTimeEntries();
  },
  async listTimeEntriesByMatter(matterId) {
    return listMockTimeEntriesByMatter(matterId);
  },
};

export const apiBillingRepository: BillingRepository = {
  async getInvoiceById() {
    throw new Error('Billing API repository is not wired yet. Use DATA_SOURCE="mock" until the backend slice is implemented.');
  },
  async listInvoices() {
    throw new Error('Billing API repository is not wired yet. Use DATA_SOURCE="mock" until the backend slice is implemented.');
  },
  async listInvoicesByMatter() {
    throw new Error('Billing API repository is not wired yet. Use DATA_SOURCE="mock" until the backend slice is implemented.');
  },
  async listTimeEntries() {
    throw new Error('Billing API repository is not wired yet. Use DATA_SOURCE="mock" until the backend slice is implemented.');
  },
  async listTimeEntriesByMatter() {
    throw new Error('Billing API repository is not wired yet. Use DATA_SOURCE="mock" until the backend slice is implemented.');
  },
};

function createBillingRepository(): BillingRepository {
  return getDataSource() === "api" ? apiBillingRepository : mockBillingRepository;
}

export const billingRepository: BillingRepository = createBillingRepository();
