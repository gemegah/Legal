export type InvoiceStatus =
  | "draft"
  | "reviewed"
  | "sent"
  | "paid"
  | "partially_paid"
  | "overdue"
  | "void";

export type PaymentMethod = "momo" | "card" | "bank_transfer";
export type PaymentStatus = "pending" | "confirmed" | "failed";
export type LineItemType = "time" | "expense" | "flat_fee";
export type BillingStatusFilter = "all" | InvoiceStatus;

export interface InvoiceLineItem {
  id: string;
  type: LineItemType;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  date: string;
  addedBy: string;
  timeEntryId: string | null;
}

export interface InvoicePayment {
  id: string;
  invoiceId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  reference: string;
  paidAt: string;
  recordedAt: string;
  recordedBy: string;
}

export interface Invoice {
  id: string;
  reference: string;
  matterId: string;
  matterReference: string;
  matterTitle: string;
  clientName: string;
  status: InvoiceStatus;
  total: number;
  paid: number;
  balance: number;
  issuedAt: string;
  dueAt: string;
  sentAt: string | null;
  lineItems: InvoiceLineItem[];
  payments: InvoicePayment[];
}

export interface TimeEntry {
  id: string;
  matterId: string;
  matterReference: string;
  matterTitle: string;
  clientName: string;
  description: string;
  hours: number;
  rate: number;
  amount: number;
  date: string;
  addedBy: string;
  invoiceId: string | null;
}

export interface BillingWorkspaceData {
  invoices: Invoice[];
  timeEntries: TimeEntry[];
}

export interface MatterBillingData {
  invoices: Invoice[];
  timeEntries: TimeEntry[];
}

export interface MatterOption {
  id: string;
  reference: string;
  title: string;
  clientName: string;
}

export interface TimeEntryFormValues {
  matterId: string;
  description: string;
  hours: string;
  rate: string;
  date: string;
  addedBy: string;
}

export interface PaymentFormValues {
  amount: string;
  method: PaymentMethod;
  reference: string;
  paidAt: string;
}
