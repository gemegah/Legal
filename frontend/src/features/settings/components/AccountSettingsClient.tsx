"use client";

import { useState } from "react";

import { Badge, Button, Input, Modal } from "@/components/ui";
import type { AccountSettingsData } from "@/features/settings/types";
import { formatDateTime, formatRelativeDate } from "@/lib/utils";

export function AccountSettingsClient({ initialData }: { initialData: AccountSettingsData }) {
  const [profile, setProfile] = useState(initialData.profile);
  const [preferences, setPreferences] = useState(initialData.preferences);
  const [security, setSecurity] = useState(initialData.security);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordDraft, setPasswordDraft] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  function updateProfile<K extends keyof typeof profile>(key: K, value: (typeof profile)[K]) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  function saveProfile() {
    setFeedback("Profile details saved.");
  }

  function togglePreference(id: string) {
    setPreferences((current) =>
      current.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item)),
    );
  }

  function savePreferences() {
    setFeedback("Notification and workflow preferences saved.");
  }

  function toggleMfa() {
    const nextValue = !security.mfaEnabled;
    setSecurity((current) => ({ ...current, mfaEnabled: nextValue }));
    setFeedback(nextValue ? "Multi-factor authentication enabled in the staged UI." : "Multi-factor authentication disabled in the staged UI.");
  }

  function updatePassword() {
    if (!passwordDraft.current || !passwordDraft.next || !passwordDraft.confirm) {
      setFeedback("Fill all password fields before confirming the rotation.");
      return;
    }

    if (passwordDraft.next !== passwordDraft.confirm) {
      setFeedback("New password confirmation does not match.");
      return;
    }

    setSecurity((current) => ({
      ...current,
      passwordUpdatedAt: new Date().toISOString(),
    }));
    setPasswordDraft({ current: "", next: "", confirm: "" });
    setPasswordModalOpen(false);
    setFeedback("Password rotation staged successfully.");
  }

  const notificationPrefs = preferences.filter((item) => item.group === "notifications");
  const workflowPrefs = preferences.filter((item) => item.group === "workflow");

  return (
    <div className="settings-screen">
      <div className="surface-card settings-screen-hero">
        <div className="settings-screen-copy">
          <p className="eyebrow-label">Account</p>
          <h3 className="settings-screen-title">Personal controls should feel precise, not buried in administration.</h3>
          <p className="settings-screen-text">
            This surface is about your own profile, your session posture, and the signal you want from reminders and
            notifications.
          </p>
        </div>

        <div className="settings-screen-badges">
          <Badge tone="success">{initialData.viewer.role}</Badge>
          <Badge tone={security.mfaEnabled ? "success" : "warning"}>
            {security.mfaEnabled ? "MFA on" : "MFA off"}
          </Badge>
        </div>
      </div>

      {feedback ? <div className="settings-feedback">{feedback}</div> : null}

      <div className="settings-stat-grid">
        <div className="surface-card settings-stat-card">
          <span>Password updated</span>
          <strong>{formatRelativeDate(security.passwordUpdatedAt)}</strong>
          <small>{formatDateTime(security.passwordUpdatedAt)}</small>
        </div>
        <div className="surface-card settings-stat-card">
          <span>Open sessions</span>
          <strong>{security.sessions.length}</strong>
          <small>Review recent device access without leaving the workspace.</small>
        </div>
        <div className="surface-card settings-stat-card">
          <span>Enabled preferences</span>
          <strong>{preferences.filter((item) => item.enabled).length}</strong>
          <small>Notification and workflow choices currently shaping your day.</small>
        </div>
      </div>

      <div className="settings-account-grid">
        <section className="surface-card settings-panel">
          <div className="settings-panel-head">
            <div>
              <p className="settings-panel-kicker">Profile</p>
              <h4 className="settings-panel-title">Personal details shown across the practitioner workspace</h4>
            </div>
            <Button onClick={saveProfile}>Save profile</Button>
          </div>

          <div className="settings-form-grid">
            <Input label="Full name" name="fullName" value={profile.fullName} onChange={(event) => updateProfile("fullName", event.target.value)} />
            <Input label="Email" name="email" type="email" value={profile.email} onChange={(event) => updateProfile("email", event.target.value)} />
            <Input label="Title" name="title" value={profile.title} onChange={(event) => updateProfile("title", event.target.value)} />
            <Input label="Phone" name="phone" value={profile.phone} onChange={(event) => updateProfile("phone", event.target.value)} />
            <label className="ui-field">
              <span className="ui-field-label">Timezone</span>
              <select className="settings-select" value={profile.timezone} onChange={(event) => updateProfile("timezone", event.target.value)}>
                <option value="Africa/Accra">Africa/Accra</option>
                <option value="UTC">UTC</option>
              </select>
            </label>
          </div>
        </section>

        <section className="surface-card settings-panel">
          <div className="settings-panel-head">
            <div>
              <p className="settings-panel-kicker">Security posture</p>
              <h4 className="settings-panel-title">Keep sign-in confidence visible and simple</h4>
            </div>
            <div className="settings-inline-actions">
              <Button variant="ghost" onClick={() => setPasswordModalOpen(true)}>
                Change password
              </Button>
              <Button variant={security.mfaEnabled ? "subtle" : "primary"} onClick={toggleMfa}>
                {security.mfaEnabled ? "Disable MFA" : "Enable MFA"}
              </Button>
            </div>
          </div>

          <div className="settings-security-grid">
            <div className="settings-footnote-card">
              <span>MFA status</span>
              <strong>{security.mfaEnabled ? "Enabled" : "Disabled"}</strong>
              <small>Use a second factor for practitioner access, especially on finance and message-heavy roles.</small>
            </div>
            <div className="settings-footnote-card">
              <span>Recovery email</span>
              <strong>{security.recoveryEmail}</strong>
              <small>Fallback communication channel for account recovery and policy notices.</small>
            </div>
          </div>

          <div className="settings-session-list">
            {security.sessions.map((session) => (
              <div className="settings-session-item" key={session.id}>
                <div>
                  <strong>{session.deviceLabel}</strong>
                  <p>{session.locationLabel}</p>
                </div>
                <div className="settings-session-meta">
                  <Badge tone={session.status === "current" ? "success" : session.status === "recent" ? "info" : "warning"}>
                    {session.status}
                  </Badge>
                  <span>{formatRelativeDate(session.lastSeenAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="settings-panel-grid">
        <section className="surface-card settings-panel">
          <div className="settings-panel-head">
            <div>
              <p className="settings-panel-kicker">Notifications</p>
              <h4 className="settings-panel-title">Tune signal without losing the important deadlines</h4>
            </div>
            <Button variant="ghost" onClick={savePreferences}>
              Save preferences
            </Button>
          </div>

          <div className="settings-preference-list">
            {notificationPrefs.map((item) => (
              <label className="settings-preference-item" key={item.id}>
                <input
                  type="checkbox"
                  checked={item.enabled}
                  onChange={() => togglePreference(item.id)}
                />
                <div>
                  <strong>{item.label}</strong>
                  <p>{item.description}</p>
                </div>
              </label>
            ))}
          </div>
        </section>

        <section className="surface-card settings-panel">
          <div className="settings-panel-head">
            <div>
              <p className="settings-panel-kicker">Workflow preferences</p>
              <h4 className="settings-panel-title">A small layer of personal ergonomics</h4>
            </div>
          </div>

          <div className="settings-preference-list">
            {workflowPrefs.map((item) => (
              <label className="settings-preference-item" key={item.id}>
                <input
                  type="checkbox"
                  checked={item.enabled}
                  onChange={() => togglePreference(item.id)}
                />
                <div>
                  <strong>{item.label}</strong>
                  <p>{item.description}</p>
                </div>
              </label>
            ))}
          </div>
        </section>
      </div>

      <Modal
        open={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        title="Rotate password"
        footer={
          <>
            <Button variant="ghost" onClick={() => setPasswordModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={updatePassword}>Confirm change</Button>
          </>
        }
      >
        <div className="settings-modal-grid">
          <Input
            label="Current password"
            name="currentPassword"
            type="password"
            value={passwordDraft.current}
            onChange={(event) => setPasswordDraft((current) => ({ ...current, current: event.target.value }))}
          />
          <Input
            label="New password"
            name="newPassword"
            type="password"
            value={passwordDraft.next}
            onChange={(event) => setPasswordDraft((current) => ({ ...current, next: event.target.value }))}
          />
          <Input
            label="Confirm new password"
            name="confirmPassword"
            type="password"
            value={passwordDraft.confirm}
            onChange={(event) => setPasswordDraft((current) => ({ ...current, confirm: event.target.value }))}
          />
        </div>
      </Modal>
    </div>
  );
}
