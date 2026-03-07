"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { getStatusLabel } from "@/features/billing/components/BillingWorkspace";
import type {
  Invoice,
  InvoicePayment,
  InvoiceStatus,
  PaymentFormValues,
  PaymentMethod,
} from "@/features/billing/types";
import { cn, formatDate, formatDateTime, formatGHS } from "@/lib/utils";

interface InvoiceDetailClientProps {
  invoice: Invoice;
}

export function InvoiceDetailClient({ invoice: initialInvoice }: InvoiceDetailClientProps) {
  const [invoice, setInvoice] = useState(initialInvoice);
  const [recordingPayment, setRecordingPayment] = useState(false);
  const [confirmingVoid, setConfirmingVoid] = useState(false);

  function handleAdvanceStatus() {
    setInvoice((current) => {
      const next = getNextStatus(current.status);
      if (!next) return current;
      return {
        ...current,
        status: next,
        sentAt: next === "sent" ? new Date().toISOString() : current.sentAt,
      };
    });
  }

  function handleRecordPayment(values: PaymentFormValues) {
    const amount = parseFloat(values.amount);
    if (isNaN(amount) || amount <= 0 || amount > invoice.balance) return;

    const now = new Date().toISOString();
    const newPayment: InvoicePayment = {
      id: `pay-${Math.random().toString(36).slice(2, 10)}`,
      invoiceId: invoice.id,
      amount,
      method: values.method,
      status: "confirmed",
      reference: values.reference.trim(),
      paidAt: values.paidAt ? new Date(values.paidAt).toISOString() : now,
      recordedAt: now,
      recordedBy: "Kwame Boateng",
    };

    setInvoice((current) => {
      const newPaid = parseFloat((current.paid + amount).toFixed(2));
      const newBalance = parseFloat((current.total - newPaid).toFixed(2));
      const newStatus: InvoiceStatus =
        newBalance <= 0 ? "paid" : current.status === "overdue" ? "overdue" : "partially_paid";

      return {
        ...current,
        paid: newPaid,
        balance: newBalance < 0 ? 0 : newBalance,
        status: newStatus,
        payments: [...current.payments, newPayment],
      };
    });

    setRecordingPayment(false);
  }

  function handleVoid() {
    setInvoice((current) => ({ ...current, status: "void" }));
    setConfirmingVoid(false);
  }

  const nextAction = getNextAction(invoice.status);
  const canRecordPayment =
    invoice.status === "sent" ||
    invoice.status === "partially_paid" ||
    invoice.status === "overdue";

  return (
    <article className="invoice-detail-workspace">
      <div className="surface-card invoice-detail-header">
        <div className="invoice-detail-breadcrumb">
          <Link className="task-action-link" href="/billing">
            Billing
          </Link>
          <span aria-hidden="true">·</span>
          <span className="row-meta">{invoice.reference}</span>
        </div>

        <div className="invoice-detail-title-row">
          <div>
            <h1 className="matter-title">{invoice.reference}</h1>
            <div className="invoice-detail-badges">
              <span className={cn("invoice-status-badge is-lg", `is-${invoice.status}`)}>
                {getStatusLabel(invoice.status)}
              </span>
              <Link className="invoice-matter-badge" href={`/matters/${invoice.matterId}`}>
                {invoice.matterReference}
              </Link>
            </div>
          </div>

          <div className="invoice-detail-actions">
            {nextAction ? (
              <button
                className="btn btn-primary"
                onClick={handleAdvanceStatus}
                type="button"
              >
                {nextAction}
              </button>
            ) : null}
            {canRecordPayment ? (
              <button
                className="btn btn-accent"
                onClick={() => setRecordingPayment(true)}
                type="button"
              >
                Record Payment
              </button>
            ) : null}
            {invoice.status !== "void" && invoice.status !== "paid" ? (
              <button
                className="btn btn-ghost billing-void-btn"
                onClick={() => setConfirmingVoid(true)}
                type="button"
              >
                Void
              </button>
            ) : null}
          </div>
        </div>

        <div className="invoice-detail-meta">
          <div className="invoice-meta-field">
            <p className="eyebrow-label">Client</p>
            <p className="table-copy">{invoice.clientName}</p>
          </div>
          <div className="invoice-meta-field">
            <p className="eyebrow-label">Matter</p>
            <p className="table-copy">{invoice.matterTitle}</p>
          </div>
          <div className="invoice-meta-field">
            <p className="eyebrow-label">Issued</p>
            <p className="table-copy">{formatDate(invoice.issuedAt)}</p>
          </div>
          <div className="invoice-meta-field">
            <p className="eyebrow-label">Due</p>
            <p className="table-copy">{formatDate(invoice.dueAt)}</p>
          </div>
          {invoice.sentAt ? (
            <div className="invoice-meta-field">
              <p className="eyebrow-label">Sent</p>
              <p className="table-copy">{formatDate(invoice.sentAt)}</p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="invoice-detail-stats-row">
        <InvoiceStatCard
          label="Total"
          value={formatGHS(invoice.total)}
          tone="default"
        />
        <InvoiceStatCard
          label="Paid"
          value={formatGHS(invoice.paid)}
          tone={invoice.paid > 0 ? "success" : "default"}
        />
        <InvoiceStatCard
          label="Balance Due"
          value={formatGHS(invoice.balance)}
          tone={invoice.balance > 0 && invoice.status === "overdue" ? "danger" : "default"}
        />
      </div>

      <div className="surface-card invoice-section">
        <h2 className="invoice-section-title">Line Items</h2>
        {invoice.lineItems.length === 0 ? (
          <div className="matter-tab-empty billing-empty">
            No line items yet. Add time entries or expenses to this invoice.
          </div>
        ) : (
          <div className="line-items-table">
            <div className="line-items-head">
              <span>Description</span>
              <span>Type</span>
              <span>Qty / Hours</span>
              <span>Rate</span>
              <span>Amount</span>
            </div>
            <div className="line-items-body">
              {invoice.lineItems.map((item) => (
                <div className="line-item-row" key={item.id}>
                  <div className="line-item-primary">
                    <p className="table-copy">{item.description}</p>
                    <p className="row-meta">
                      {formatDate(item.date)} · {item.addedBy}
                    </p>
                  </div>
                  <span className={cn("line-item-type-badge", `is-${item.type}`)}>
                    {getLineItemLabel(item.type)}
                  </span>
                  <span className="table-copy">{item.quantity}</span>
                  <span className="table-copy">{formatGHS(item.rate)}</span>
                  <span
                    className="billing-amount table-copy"
                    aria-label={`Amount: ${formatGHS(item.amount)}`}
                  >
                    {formatGHS(item.amount)}
                  </span>
                </div>
              ))}
            </div>
            <div className="line-items-total-row">
              <span className="eyebrow-label">Total</span>
              <span
                className="billing-amount section-title"
                aria-label={`Invoice total: ${formatGHS(invoice.total)}`}
              >
                {formatGHS(invoice.total)}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="surface-card invoice-section">
        <h2 className="invoice-section-title">Payment History</h2>
        {invoice.payments.length === 0 ? (
          <div className="matter-tab-empty billing-empty">
            No payments recorded yet.
          </div>
        ) : (
          <div className="payments-list">
            {invoice.payments.map((payment) => (
              <PaymentEntry key={payment.id} payment={payment} />
            ))}
          </div>
        )}
      </div>

      {recordingPayment ? (
        <RecordPaymentModal
          balance={invoice.balance}
          invoiceReference={invoice.reference}
          onClose={() => setRecordingPayment(false)}
          onSave={handleRecordPayment}
        />
      ) : null}

      {confirmingVoid ? (
        <VoidConfirmModal
          invoiceReference={invoice.reference}
          onCancel={() => setConfirmingVoid(false)}
          onConfirm={handleVoid}
        />
      ) : null}
    </article>
  );
}

function InvoiceStatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "default" | "danger" | "success";
}) {
  return (
    <div className={cn("surface-card billing-stat-card", `is-${tone}`)}>
      <p className="billing-stat-label">{label}</p>
      <p className="billing-stat-value" aria-label={`${label}: ${value}`}>
        {value}
      </p>
    </div>
  );
}

function PaymentEntry({ payment }: { payment: InvoicePayment }) {
  return (
    <div className="payment-row">
      <div>
        <p className="table-copy">{formatGHS(payment.amount)}</p>
        <p className="row-meta">
          {getMethodLabel(payment.method)} · Ref: {payment.reference}
        </p>
      </div>
      <div className="payment-value">
        <p className="row-meta">{formatDateTime(payment.paidAt)}</p>
        <p className={cn("payment-status", payment.status === "confirmed" && "is-confirmed")}>
          {payment.status}
        </p>
      </div>
    </div>
  );
}

function RecordPaymentModal({
  balance,
  invoiceReference,
  onClose,
  onSave,
}: {
  balance: number;
  invoiceReference: string;
  onClose: () => void;
  onSave: (values: PaymentFormValues) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [values, setValues] = useState<PaymentFormValues>({
    amount: balance.toFixed(2),
    method: "momo",
    reference: "",
    paidAt: today,
  });
  const [error, setError] = useState("");

  function update<K extends keyof PaymentFormValues>(key: K, value: PaymentFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const amount = parseFloat(values.amount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid payment amount greater than 0.");
      return;
    }
    if (amount > balance) {
      setError(`Amount cannot exceed the outstanding balance of ${formatGHS(balance)}.`);
      return;
    }
    if (!values.reference.trim()) {
      setError("Please enter a payment reference or transaction ID.");
      return;
    }
    setError("");
    onSave(values);
  }

  const amountValue = parseFloat(values.amount);
  const isFullPayment = !isNaN(amountValue) && Math.abs(amountValue - balance) < 0.01;

  return (
    <div className="task-modal-backdrop" role="presentation">
      <div
        aria-modal="true"
        className="task-modal"
        role="dialog"
        aria-labelledby="record-payment-title"
      >
        <div className="task-modal-head">
          <div>
            <p className="eyebrow-label">Record Payment</p>
            <h3 className="matter-title task-modal-title" id="record-payment-title">
              {invoiceReference}
            </h3>
          </div>
          <button
            aria-label="Close"
            className="task-modal-close"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <form className="task-form" onSubmit={handleSubmit}>
          <div className="billing-payment-balance">
            <span className="billing-stat-label">Outstanding balance</span>
            <span className="billing-stat-value" aria-label={`Outstanding balance: ${formatGHS(balance)}`}>
              {formatGHS(balance)}
            </span>
          </div>

          <label className="task-form-field">
            <span>Amount (GHS)</span>
            <input
              inputMode="decimal"
              min="0.01"
              max={balance.toFixed(2)}
              onChange={(e) => update("amount", e.target.value)}
              placeholder={balance.toFixed(2)}
              step="0.01"
              type="number"
              value={values.amount}
            />
          </label>

          {isFullPayment ? (
            <p className="billing-form-preview">This will mark the invoice as fully paid.</p>
          ) : !isNaN(amountValue) && amountValue > 0 ? (
            <p className="billing-form-preview">
              Remaining balance after payment:{" "}
              {formatGHS(parseFloat((balance - amountValue).toFixed(2)))}
            </p>
          ) : null}

          <label className="task-form-field">
            <span>Payment method</span>
            <select
              onChange={(e) => update("method", e.target.value as PaymentMethod)}
              value={values.method}
            >
              <option value="momo">MoMo (Mobile Money)</option>
              <option value="card">Card (Paystack)</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </label>

          <div className="task-form-grid">
            <label className="task-form-field">
              <span>Reference / Transaction ID</span>
              <input
                onChange={(e) => update("reference", e.target.value)}
                placeholder="MOB-2026-XXXX or PSK-XXXX"
                value={values.reference}
              />
            </label>
            <label className="task-form-field">
              <span>Payment date</span>
              <input
                onChange={(e) => update("paidAt", e.target.value)}
                type="date"
                value={values.paidAt}
              />
            </label>
          </div>

          {error ? <p className="billing-form-error" role="alert">{error}</p> : null}

          <div className="task-form-actions">
            <button className="btn btn-ghost" onClick={onClose} type="button">
              Cancel
            </button>
            <button className="btn btn-primary" type="submit">
              Confirm Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function VoidConfirmModal({
  invoiceReference,
  onCancel,
  onConfirm,
}: {
  invoiceReference: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="task-modal-backdrop" role="presentation">
      <div
        aria-modal="true"
        className="task-modal billing-confirm-modal"
        role="dialog"
        aria-labelledby="void-confirm-title"
      >
        <div className="task-modal-head">
          <div>
            <p className="eyebrow-label">Confirm Action</p>
            <h3 className="matter-title task-modal-title" id="void-confirm-title">
              Void {invoiceReference}?
            </h3>
          </div>
        </div>
        <p className="billing-confirm-copy">
          Voiding this invoice is irreversible. It will be removed from AR and marked as void.
          Any payments already recorded will remain in the payment history.
        </p>
        <div className="task-form-actions">
          <button className="btn btn-ghost" onClick={onCancel} type="button">
            Cancel
          </button>
          <button className="btn billing-void-confirm-btn" onClick={onConfirm} type="button">
            Void Invoice
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────

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
    reviewed: "Send Invoice",
  };
  return map[status] ?? null;
}

function getLineItemLabel(type: string): string {
  const labels: Record<string, string> = {
    time: "Time",
    expense: "Expense",
    flat_fee: "Flat Fee",
  };
  return labels[type] ?? type;
}

function getMethodLabel(method: PaymentMethod): string {
  const labels: Record<PaymentMethod, string> = {
    momo: "MoMo",
    card: "Card",
    bank_transfer: "Bank Transfer",
  };
  return labels[method];
}
