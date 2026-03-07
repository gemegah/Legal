"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { getStatusLabel } from "@/features/billing/components/BillingWorkspace";
import type {
  Invoice,
  TimeEntry,
  TimeEntryFormValues,
} from "@/features/billing/types";
import { cn, formatDate, formatGHS } from "@/lib/utils";

interface MatterBillingClientProps {
  matterId: string;
  matterTitle: string;
  initialInvoices: Invoice[];
  initialTimeEntries: TimeEntry[];
}

export function MatterBillingClient({
  matterId,
  matterTitle,
  initialInvoices,
  initialTimeEntries,
}: MatterBillingClientProps) {
  const [timeEntries, setTimeEntries] = useState(initialTimeEntries);
  const [invoices] = useState(initialInvoices);
  const [loggingTime, setLoggingTime] = useState(false);

  const unbilled = timeEntries.filter((te) => te.invoiceId === null);
  const unbilledTotal = unbilled.reduce((sum, te) => sum + te.amount, 0);

  function handleLogTime(values: TimeEntryFormValues) {
    const hours = parseFloat(values.hours);
    const rate = parseFloat(values.rate);

    if (isNaN(hours) || hours <= 0 || isNaN(rate) || rate <= 0) return;

    const now = new Date().toISOString();
    setTimeEntries((current) => [
      {
        id: `te-${Math.random().toString(36).slice(2, 10)}`,
        matterId,
        matterReference: current[0]?.matterReference ?? "MAT-NEW",
        matterTitle,
        clientName: current[0]?.clientName ?? "",
        description: values.description.trim(),
        hours,
        rate,
        amount: parseFloat((hours * rate).toFixed(2)),
        date: values.date ? new Date(values.date).toISOString() : now,
        addedBy: values.addedBy.trim() || "Kwame Boateng",
        invoiceId: null,
      },
      ...current,
    ]);
    setLoggingTime(false);
  }

  return (
    <section className="matter-billing-workspace">
      <div className="surface-card matter-billing-panel">
        <div className="matter-billing-header">
          <div>
            <p className="eyebrow-label">Matter Billing</p>
            <h2 className="section-title">Time &amp; Invoices</h2>
            <p className="matter-tab-copy">
              Time entries, expenses, and invoice generation for {matterTitle}.
            </p>
          </div>
          <div className="matter-billing-actions">
            <button
              className="btn btn-ghost"
              onClick={() => setLoggingTime(true)}
              type="button"
            >
              Log Time
            </button>
          </div>
        </div>

        {unbilled.length > 0 ? (
          <div className="matter-billing-unbilled-banner">
            <div>
              <p className="billing-stat-label">Unbilled time</p>
              <p className="billing-stat-value" aria-label={`Unbilled total: ${formatGHS(unbilledTotal)}`}>
                {formatGHS(unbilledTotal)}
              </p>
            </div>
            <Link
              className="btn btn-accent"
              href={`/billing?matter_id=${matterId}`}
            >
              Draft Invoice
            </Link>
          </div>
        ) : null}

        <div className="matter-billing-section">
          <h3 className="matter-billing-section-title">
            Time Entries
            {unbilled.length > 0 ? (
              <span className="billing-unbilled-count">{unbilled.length} unbilled</span>
            ) : null}
          </h3>

          {timeEntries.length === 0 ? (
            <div className="matter-tab-empty billing-empty">
              No time entries yet. Log time to start tracking billable hours for this matter.
            </div>
          ) : (
            <div className="time-entry-table">
              <div className="time-entry-table-head">
                <span>Description</span>
                <span>Date</span>
                <span>Hours</span>
                <span>Rate</span>
                <span>Amount</span>
                <span>Status</span>
              </div>
              <div className="time-entry-table-body">
                {timeEntries.map((te) => (
                  <TimeEntryRow key={te.id} entry={te} />
                ))}
              </div>
            </div>
          )}
        </div>

        {invoices.length > 0 ? (
          <div className="matter-billing-section">
            <h3 className="matter-billing-section-title">Invoices</h3>
            <div className="matter-invoice-list">
              {invoices.map((inv) => (
                <MatterInvoiceRow key={inv.id} invoice={inv} />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {loggingTime ? (
        <TimeEntryModal
          matterId={matterId}
          onClose={() => setLoggingTime(false)}
          onSave={handleLogTime}
        />
      ) : null}
    </section>
  );
}

function TimeEntryRow({ entry }: { entry: TimeEntry }) {
  return (
    <div className={cn("time-entry-row", entry.invoiceId === null && "is-unbilled")}>
      <div className="time-entry-primary">
        <p className="table-copy">{entry.description}</p>
        <p className="row-meta">Added by {entry.addedBy}</p>
      </div>
      <span className="row-meta">{formatDate(entry.date)}</span>
      <span className="table-copy">{entry.hours}h</span>
      <span className="table-copy">{formatGHS(entry.rate)}/h</span>
      <span
        className="table-copy billing-amount"
        aria-label={`Amount: ${formatGHS(entry.amount)}`}
      >
        {formatGHS(entry.amount)}
      </span>
      <span className={cn("time-entry-status", entry.invoiceId ? "is-billed" : "is-unbilled")}>
        {entry.invoiceId ? "Billed" : "Unbilled"}
      </span>
    </div>
  );
}

function MatterInvoiceRow({ invoice }: { invoice: Invoice }) {
  return (
    <Link className="matter-invoice-row" href={`/billing/${invoice.id}`}>
      <div>
        <p className="table-ref">{invoice.reference}</p>
        <p className="row-meta">{formatDate(invoice.issuedAt)}</p>
      </div>
      <span className={cn("invoice-status-badge", `is-${invoice.status}`)}>
        {getStatusLabel(invoice.status)}
      </span>
      <div className="matter-invoice-amounts">
        <span
          className="billing-amount table-copy"
          aria-label={`Total: ${formatGHS(invoice.total)}`}
        >
          {formatGHS(invoice.total)}
        </span>
        {invoice.balance > 0 ? (
          <span className="row-meta">Balance: {formatGHS(invoice.balance)}</span>
        ) : null}
      </div>
    </Link>
  );
}

function TimeEntryModal({
  matterId,
  onClose,
  onSave,
}: {
  matterId: string;
  onClose: () => void;
  onSave: (values: TimeEntryFormValues) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [values, setValues] = useState<TimeEntryFormValues>({
    matterId,
    description: "",
    hours: "",
    rate: "2500",
    date: today,
    addedBy: "Kwame Boateng",
  });
  const [error, setError] = useState("");

  function update<K extends keyof TimeEntryFormValues>(key: K, value: TimeEntryFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!values.description.trim()) {
      setError("Please enter a description.");
      return;
    }
    const hours = parseFloat(values.hours);
    const rate = parseFloat(values.rate);
    if (isNaN(hours) || hours <= 0) {
      setError("Please enter valid hours greater than 0.");
      return;
    }
    if (isNaN(rate) || rate <= 0) {
      setError("Please enter a valid hourly rate greater than 0.");
      return;
    }
    setError("");
    onSave(values);
  }

  return (
    <div className="task-modal-backdrop" role="presentation">
      <div
        aria-modal="true"
        className="task-modal"
        role="dialog"
        aria-labelledby="time-entry-modal-title"
      >
        <div className="task-modal-head">
          <div>
            <p className="eyebrow-label">Log Time</p>
            <h3 className="matter-title task-modal-title" id="time-entry-modal-title">
              New Time Entry
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
          <label className="task-form-field">
            <span>Description</span>
            <input
              onChange={(e) => update("description", e.target.value)}
              placeholder="Court attendance, document review, client call…"
              value={values.description}
            />
          </label>

          <div className="task-form-grid">
            <label className="task-form-field">
              <span>Hours</span>
              <input
                inputMode="decimal"
                min="0.25"
                onChange={(e) => update("hours", e.target.value)}
                placeholder="e.g. 2.5"
                step="0.25"
                type="number"
                value={values.hours}
              />
            </label>

            <label className="task-form-field">
              <span>Rate (GHS/hour)</span>
              <input
                inputMode="decimal"
                min="0"
                onChange={(e) => update("rate", e.target.value)}
                placeholder="e.g. 2500"
                step="50"
                type="number"
                value={values.rate}
              />
            </label>
          </div>

          <div className="task-form-grid">
            <label className="task-form-field">
              <span>Date</span>
              <input
                onChange={(e) => update("date", e.target.value)}
                type="date"
                value={values.date}
              />
            </label>

            <label className="task-form-field">
              <span>Added by</span>
              <input
                onChange={(e) => update("addedBy", e.target.value)}
                placeholder="Kwame Boateng"
                value={values.addedBy}
              />
            </label>
          </div>

          {values.hours && values.rate && !isNaN(parseFloat(values.hours)) && !isNaN(parseFloat(values.rate)) ? (
            <div className="billing-form-preview">
              Amount: {formatGHS(parseFloat(values.hours) * parseFloat(values.rate))}
            </div>
          ) : null}

          {error ? <p className="billing-form-error" role="alert">{error}</p> : null}

          <div className="task-form-actions">
            <button className="btn btn-ghost" onClick={onClose} type="button">
              Cancel
            </button>
            <button className="btn btn-primary" type="submit">
              Log Time
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
