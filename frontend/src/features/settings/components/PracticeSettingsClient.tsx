"use client";

import { useState } from "react";

import { Badge, Button, Input } from "@/components/ui";
import type { PracticeSettingsData } from "@/features/settings/types";
import { formatGHS } from "@/lib/utils";

export function PracticeSettingsClient({ initialData }: { initialData: PracticeSettingsData }) {
  const [form, setForm] = useState(initialData.practice);
  const [feedback, setFeedback] = useState<string | null>(null);
  const canEdit = initialData.viewer.role === "admin";

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function saveSection(section: string) {
    setFeedback(`${section} saved for ${initialData.firmName}.`);
  }

  return (
    <div className="settings-screen">
      <div className="surface-card settings-screen-hero">
        <div className="settings-screen-copy">
          <p className="eyebrow-label">Practice Settings</p>
          <h3 className="settings-screen-title">Shape how the firm presents itself and how reminders behave.</h3>
          <p className="settings-screen-text">
            This is the administrative layer for office identity, matter reminder cadence, and the billing language
            clients will keep seeing.
          </p>
        </div>

        <div className="settings-screen-badges">
          <Badge tone={canEdit ? "success" : "warning"}>
            {canEdit ? "Admin controls enabled" : "Read-only for your role"}
          </Badge>
          <Badge tone="info">{form.timezone}</Badge>
        </div>
      </div>

      {feedback ? <div className="settings-feedback">{feedback}</div> : null}

      {!canEdit ? (
        <div className="settings-readonly-banner">
          Practice-wide controls are visible to you, but only admins can change firm identity, reminder defaults, and
          payment language.
        </div>
      ) : null}

      <div className="settings-stat-grid">
        <div className="surface-card settings-stat-card">
          <span>Firm seats</span>
          <strong>{initialData.seatCount}</strong>
          <small>Current practitioner capacity for the workspace.</small>
        </div>
        <div className="surface-card settings-stat-card">
          <span>Active matters</span>
          <strong>{initialData.activeMatters}</strong>
          <small>Live work currently affected by reminder and access defaults.</small>
        </div>
        <div className="surface-card settings-stat-card">
          <span>Collections target</span>
          <strong>{formatGHS(initialData.monthlyCollectionsTargetGhs)}</strong>
          <small>Monthly working target for the billing posture behind this workspace.</small>
        </div>
      </div>

      <div className="settings-panel-grid">
        <section className="surface-card settings-panel">
          <div className="settings-panel-head">
            <div>
              <p className="settings-panel-kicker">Firm identity</p>
              <h4 className="settings-panel-title">What practitioners and clients recognize first</h4>
            </div>
            <Button onClick={() => saveSection("Firm identity")} disabled={!canEdit} variant="ghost">
              Save identity
            </Button>
          </div>

          <div className="settings-form-grid">
            <Input
              label="Workspace name"
              name="workspaceName"
              value={form.workspaceName}
              onChange={(event) => updateField("workspaceName", event.target.value)}
              disabled={!canEdit}
            />
            <Input
              label="Legal name"
              name="legalName"
              value={form.legalName}
              onChange={(event) => updateField("legalName", event.target.value)}
              disabled={!canEdit}
            />
            <Input
              label="Primary email"
              name="primaryEmail"
              value={form.primaryEmail}
              onChange={(event) => updateField("primaryEmail", event.target.value)}
              disabled={!canEdit}
            />
            <Input
              label="Primary phone"
              name="primaryPhone"
              value={form.primaryPhone}
              onChange={(event) => updateField("primaryPhone", event.target.value)}
              disabled={!canEdit}
            />
            <label className="ui-field">
              <span className="ui-field-label">Timezone</span>
              <select
                className="settings-select"
                value={form.timezone}
                onChange={(event) => updateField("timezone", event.target.value)}
                disabled={!canEdit}
              >
                <option value="Africa/Accra">Africa/Accra</option>
                <option value="UTC">UTC</option>
              </select>
            </label>
            <label className="ui-field">
              <span className="ui-field-label">Default matter visibility</span>
              <select
                className="settings-select"
                value={form.defaultMatterVisibility}
                onChange={(event) => updateField("defaultMatterVisibility", event.target.value)}
                disabled={!canEdit}
              >
                <option>Assigned team members plus admin oversight</option>
                <option>Assigned team members only</option>
                <option>Firm-wide practitioner visibility</option>
              </select>
            </label>
          </div>
        </section>

        <section className="surface-card settings-panel">
          <div className="settings-panel-head">
            <div>
              <p className="settings-panel-kicker">Reminder defaults</p>
              <h4 className="settings-panel-title">Deadline language tuned for Ghana practice rhythm</h4>
            </div>
            <Button onClick={() => saveSection("Operational defaults")} disabled={!canEdit}>
              Save defaults
            </Button>
          </div>

          <div className="settings-form-grid">
            <Input
              label="Reminder cadence"
              name="reminderCadence"
              hint="Use a human-readable format that maps to filing and hearing reminders."
              value={form.reminderCadence}
              onChange={(event) => updateField("reminderCadence", event.target.value)}
              disabled={!canEdit}
            />
            <label className="ui-field">
              <span className="ui-field-label">Payment reminder mode</span>
              <select
                className="settings-select"
                value={form.paymentReminderMode}
                onChange={(event) => updateField("paymentReminderMode", event.target.value)}
                disabled={!canEdit}
              >
                <option>7d before due date and 3d after due date</option>
                <option>3d before due date and 7d after due date</option>
                <option>Due date only</option>
              </select>
            </label>
          </div>

          <label className="ui-field">
            <span className="ui-field-label">Invoice footer</span>
            <textarea
              className="settings-textarea"
              value={form.invoiceFooter}
              onChange={(event) => updateField("invoiceFooter", event.target.value)}
              disabled={!canEdit}
            />
          </label>

          <div className="settings-footnote-grid">
            <div className="settings-footnote-card">
              <span>Payments</span>
              <strong>GHS only</strong>
              <small>Keep collection language aligned to the product's Ghana-first billing model.</small>
            </div>
            <div className="settings-footnote-card">
              <span>Gateways</span>
              <strong>Hubtel + Paystack</strong>
              <small>Default copy should match the actual payment routes available in the product.</small>
            </div>
          </div>
        </section>

        <section className="surface-card settings-panel">
          <div className="settings-panel-head">
            <div>
              <p className="settings-panel-kicker">Access framing</p>
              <h4 className="settings-panel-title">The line between firm defaults and individual preference</h4>
            </div>
          </div>

          <div className="settings-rule-list">
            <div className="settings-rule-item">
              <strong>Admin-owned</strong>
              <p>Firm identity, reminder cadence, user access, and billing defaults stay inside administrative control.</p>
            </div>
            <div className="settings-rule-item">
              <strong>Practitioner-owned</strong>
              <p>Personal profile, notification posture, and session hygiene live in the account screen.</p>
            </div>
            <div className="settings-rule-item">
              <strong>Firm-safe by default</strong>
              <p>Changes should never depend on a client-supplied firm identifier, and deactivated users keep history intact.</p>
            </div>
          </div>
        </section>

        <section className="surface-card settings-panel settings-panel-accent">
          <p className="settings-panel-kicker">Why this screen matters</p>
          <h4 className="settings-panel-title">The details here become the firm's operating tone.</h4>
          <p className="settings-screen-text">
            If reminder timing is sloppy or collections language drifts, the product starts feeling improvised. This
            screen should stay measured, clear, and visibly administrative.
          </p>
        </section>
      </div>
    </div>
  );
}
