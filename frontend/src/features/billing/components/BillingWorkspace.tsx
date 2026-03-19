"use client";

import Link from "next/link";
import { useDeferredValue, useState, type FormEvent } from "react";

import type {
  BillingStatusFilter,
  Invoice,
  InvoiceStatus,
  CaseOption,
  TimeEntry,
} from "@/features/billing/types";
import { cn, formatDate, formatGHS, formatRelativeDate } from "@/lib/utils";

interface BillingWorkspaceProps {
  initialInvoices: Invoice[];
  initialTimeEntries: TimeEntry[];
}

export function BillingWorkspaceClient({
  initialInvoices,
  initialTimeEntries,
}: BillingWorkspaceProps) {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [statusFilter, setStatusFilter] = useState<BillingStatusFilter>("all");
  const [search, setSearch] = useState("");
  const [caseFilter, setCaseFilter] = useState("");
  const [creatingInvoice, setCreatingInvoice] = useState(false);
  const deferredSearch = useDeferredValue(search);

  const caseOptions = getCaseOptions(invoices, initialTimeEntries);

  const filtered = invoices.filter((inv) => {
    if (statusFilter !== "all" && inv.status !== statusFilter) return false;
    if (caseFilter && inv.caseId !== caseFilter) return false;
    if (deferredSearch) {
      const q = deferredSearch.toLowerCase();
      if (
        !inv.reference.toLowerCase().includes(q) &&
        !inv.clientName.toLowerCase().includes(q) &&
        !inv.caseTitle.toLowerCase().includes(q) &&
        !inv.caseReference.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  function handleAdvanceStatus(invoiceId: string) {
    setInvoices((current) =>
      current.map((inv) => {
        if (inv.id !== invoiceId) return inv;
        const next = getNextStatus(inv.status);
        if (!next) return inv;
        return {
          ...inv,
          status: next,
          sentAt: next === "sent" ? new Date().toISOString() : inv.sentAt,
        };
      }),
    );
  }

  function handleCreateInvoice(caseId: string, dueAt: string) {
    const option = caseOptions.find((m) => m.id === caseId);
    if (!option) return;

    const ref = `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, "0")}`;
    const now = new Date().toISOString();

    setInvoices((current) => [
      {
        id: `inv-${Math.random().toString(36).slice(2, 10)}`,
        reference: ref,
        caseId: option.id,
        caseReference: option.reference,
        caseTitle: option.title,
        clientName: option.clientName,
        status: "draft",
        total: 0,
        paid: 0,
        balance: 0,
        issuedAt: now,
        dueAt: dueAt ? new Date(dueAt).toISOString() : now,
        sentAt: null,
        lineItems: [],
        payments: [],
      },
      ...current,
    ]);
    setCreatingInvoice(false);
  }

  return (
    <section className="billing-workspace">
      <div className="surface-card billing-panel">
        <div className="billing-panel-header">
          <div className="billing-panel-copy">
            <p className="eyebrow-label">Billing Operations</p>
            <h2 className="case-title">Billing</h2>
            <p className="billing-panel-subcopy">
              Manage invoices, AR, and payment collection workflows.
            </p>
          </div>
          <div className="billing-panel-header-actions">
            <button
              className="btn btn-primary"
              onClick={() => setCreatingInvoice(true)}
              type="button"
            >
              + New Invoice
            </button>
          </div>
        </div>

        <div className="billing-toolbar-shell">
          <div className="billing-status-tabs" role="tablist" aria-label="Filter by invoice status">
            {statusTabs.map((tab) => (
              <button
                aria-pressed={statusFilter === tab.value}
                className={cn("billing-status-tab", statusFilter === tab.value && "is-active")}
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="billing-toolbar-filters">
            <label className="case-search-field billing-search-field" aria-label="Search invoices">
              <SearchIcon />
              <input
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search invoices, clients, cases..."
                type="search"
                value={search}
              />
            </label>

            <label className="task-inline-select">
              <FilterIcon />
              <span>Case</span>
              <select onChange={(e) => setCaseFilter(e.target.value)} value={caseFilter}>
                <option value="">All cases</option>
                {caseOptions.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.reference}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="billing-empty-state">
            <p className="section-title">No invoices match the current filters.</p>
            <p className="placeholder-copy">
              Adjust the filters or create a new invoice to populate the queue.
            </p>
          </div>
        ) : (
          <InvoiceTable invoices={filtered} onAdvanceStatus={handleAdvanceStatus} />
        )}
      </div>

      {creatingInvoice ? (
        <NewInvoiceModal
          caseOptions={caseOptions}
          onClose={() => setCreatingInvoice(false)}
          onSave={handleCreateInvoice}
        />
      ) : null}
    </section>
  );
}

function InvoiceTable({
  invoices,
  onAdvanceStatus,
}: {
  invoices: Invoice[];
  onAdvanceStatus: (id: string) => void;
}) {
  return (
    <>
      <div className="invoice-table-shell">
        <div className="invoice-table-head">
          <span>Invoice</span>
          <span>Client / Case</span>
          <span>Status</span>
          <span>Total</span>
          <span>Balance</span>
          <span>Due</span>
          <span>Action</span>
        </div>
        <div className="invoice-table-body">
          {invoices.map((inv) => (
            <InvoiceRow key={inv.id} invoice={inv} onAdvanceStatus={onAdvanceStatus} />
          ))}
        </div>
      </div>

      <div className="invoice-card-stack">
        {invoices.map((inv) => (
          <InvoiceMobileCard key={inv.id} invoice={inv} onAdvanceStatus={onAdvanceStatus} />
        ))}
      </div>
    </>
  );
}

function InvoiceRow({
  invoice,
  onAdvanceStatus,
}: {
  invoice: Invoice;
  onAdvanceStatus: (id: string) => void;
}) {
  const nextAction = getNextAction(invoice.status);
  const dueTone = getDueTone(invoice);

  return (
    <div className="invoice-table-row">
      <div className="invoice-table-primary">
        <Link className="task-inline-link" href={`/billing/${invoice.id}`}>
          {invoice.reference}
        </Link>
        <p className="row-meta">{invoice.caseReference}</p>
      </div>

      <div>
        <p className="table-copy">{invoice.clientName}</p>
        <p className="row-meta">{invoice.caseTitle}</p>
      </div>

      <InvoiceStatusBadge status={invoice.status} />

      <span className="table-copy billing-amount" aria-label={`Total: ${formatGHS(invoice.total)}`}>
        {formatGHS(invoice.total)}
      </span>

      <span
        className={cn("table-copy billing-amount", invoice.balance > 0 && invoice.status === "overdue" && "is-danger")}
        aria-label={`Balance: ${formatGHS(invoice.balance)}`}
      >
        {formatGHS(invoice.balance)}
      </span>

      <div>
        <span className={cn("task-due-label", `is-${dueTone}`)}>
          {formatRelativeDate(invoice.dueAt)}
        </span>
        <p className="row-meta">{formatDate(invoice.dueAt)}</p>
      </div>

      <div className="invoice-row-actions">
        <Link className="task-action-link" href={`/billing/${invoice.id}`}>
          View
        </Link>
        {nextAction ? (
          <button
            className="task-action-link is-accent"
            onClick={() => onAdvanceStatus(invoice.id)}
            type="button"
          >
            {nextAction}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function InvoiceMobileCard({
  invoice,
  onAdvanceStatus,
}: {
  invoice: Invoice;
  onAdvanceStatus: (id: string) => void;
}) {
  const nextAction = getNextAction(invoice.status);

  return (
    <div className="surface-card invoice-mobile-card">
      <div className="invoice-mobile-card-head">
        <div>
          <p className="table-ref">{invoice.reference}</p>
          <p className="table-copy">{invoice.clientName}</p>
        </div>
        <InvoiceStatusBadge status={invoice.status} />
      </div>
      <p className="row-meta">{invoice.caseTitle}</p>
      <div className="invoice-mobile-card-grid">
        <div className="task-card-meta">
          <p>Total</p>
          <span>{formatGHS(invoice.total)}</span>
        </div>
        <div className="task-card-meta">
          <p>Balance</p>
          <span>{formatGHS(invoice.balance)}</span>
        </div>
        <div className="task-card-meta">
          <p>Due</p>
          <span>{formatDate(invoice.dueAt)}</span>
        </div>
        <div className="task-card-meta">
          <p>Issued</p>
          <span>{formatDate(invoice.issuedAt)}</span>
        </div>
      </div>
      <div className="task-mobile-card-actions">
        <Link className="btn btn-ghost" href={`/billing/${invoice.id}`}>
          View
        </Link>
        {nextAction ? (
          <button
            className="btn btn-accent"
            onClick={() => onAdvanceStatus(invoice.id)}
            type="button"
          >
            {nextAction}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <span className={cn("invoice-status-badge", `is-${status}`)}>
      {getStatusLabel(status)}
    </span>
  );
}

function NewInvoiceModal({
  caseOptions,
  onClose,
  onSave,
}: {
  caseOptions: CaseOption[];
  onClose: () => void;
  onSave: (caseId: string, dueAt: string) => void;
}) {
  const [caseId, setCaseId] = useState(caseOptions[0]?.id ?? "");
  const [dueAt, setDueAt] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!caseId) {
      setError("Please select a case.");
      return;
    }
    if (!dueAt) {
      setError("Please set a due date.");
      return;
    }
    onSave(caseId, dueAt);
  }

  return (
    <div className="task-modal-backdrop" role="presentation">
      <div aria-modal="true" className="task-modal" role="dialog" aria-labelledby="new-invoice-title">
        <div className="task-modal-head">
          <div>
            <p className="eyebrow-label">New Invoice</p>
            <h3 className="case-title task-modal-title" id="new-invoice-title">
              Create Invoice
            </h3>
          </div>
          <button className="task-modal-close" onClick={onClose} type="button" aria-label="Close">
            x
          </button>
        </div>

        <form className="task-form" onSubmit={handleSubmit}>
          <label className="task-form-field">
            <span>Case</span>
            <select onChange={(e) => setCaseId(e.target.value)} value={caseId}>
              {caseOptions.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.reference}  -  {m.title}
                </option>
              ))}
            </select>
          </label>

          <label className="task-form-field">
            <span>Due date</span>
            <input
              onChange={(e) => setDueAt(e.target.value)}
              type="date"
              value={dueAt}
            />
          </label>

          {error ? <p className="billing-form-error" role="alert">{error}</p> : null}

          <div className="task-form-actions">
            <button className="btn btn-ghost" onClick={onClose} type="button">
              Cancel
            </button>
            <button className="btn btn-primary" type="submit">
              Create Draft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const statusTabs: Array<{ value: BillingStatusFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "reviewed", label: "Reviewed" },
  { value: "sent", label: "Sent" },
  { value: "partially_paid", label: "Part Paid" },
  { value: "overdue", label: "Overdue" },
  { value: "paid", label: "Paid" },
];

export function getStatusLabel(status: InvoiceStatus): string {
  const labels: Record<InvoiceStatus, string> = {
    draft: "Draft",
    reviewed: "Reviewed",
    sent: "Sent",
    paid: "Paid",
    partially_paid: "Part Paid",
    overdue: "Overdue",
    void: "Void",
  };
  return labels[status];
}

function getNextStatus(status: InvoiceStatus): InvoiceStatus | null {
  const map: Partial<Record<InvoiceStatus, InvoiceStatus>> = {
    draft: "reviewed",
    reviewed: "sent",
  };
  return map[status] ?? null;
}

function getNextAction(status: InvoiceStatus): string | null {
  const map: Partial<Record<InvoiceStatus, string>> = {
    draft: "Mark Reviewed",
    reviewed: "Send",
  };
  return map[status] ?? null;
}

function getDueTone(invoice: Invoice): "default" | "warning" | "danger" | "success" {
  if (invoice.status === "paid") return "success";
  if (invoice.status === "void") return "default";

  const now = new Date();
  const due = new Date(invoice.dueAt);
  const diffDays = Math.round((due.getTime() - now.getTime()) / 86400000);

  if (diffDays < 0) return "danger";
  if (diffDays <= 3) return "warning";
  return "default";
}

function getCaseOptions(invoices: Invoice[], timeEntries: TimeEntry[]): CaseOption[] {
  const map = new Map<string, CaseOption>();

  invoices.forEach((inv) => {
    if (!map.has(inv.caseId)) {
      map.set(inv.caseId, {
        id: inv.caseId,
        reference: inv.caseReference,
        title: inv.caseTitle,
        clientName: inv.clientName,
      });
    }
  });

  timeEntries.forEach((te) => {
    if (!map.has(te.caseId)) {
      map.set(te.caseId, {
        id: te.caseId,
        reference: te.caseReference,
        title: te.caseTitle,
        clientName: te.clientName,
      });
    }
  });

  return Array.from(map.values());
}

function FilterIcon() {
  return (
    <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" viewBox="0 0 16 16">
      <line x1="2" x2="14" y1="4" y2="4" />
      <line x1="4" x2="12" y1="8" y2="8" />
      <line x1="6" x2="10" y1="12" y2="12" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" x2="16.65" y1="21" y2="16.65" />
    </svg>
  );
}
