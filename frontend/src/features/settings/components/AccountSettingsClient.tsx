"use client";

import type { KeyboardEvent } from "react";
import { useId, useRef, useState } from "react";

import { Badge, Button, Input, Modal } from "@/components/ui";
import type { AccountSettingsData } from "@/features/settings/types";
import { cn, formatDateTime, formatRelativeDate } from "@/lib/utils";

type AccountTab = "profile" | "security" | "preferences";

const accountTabs: Array<{ id: AccountTab; label: string }> = [
  { id: "profile", label: "Profile" },
  { id: "security", label: "Security" },
  { id: "preferences", label: "Preferences" },
];

export function AccountSettingsClient({ initialData }: { initialData: AccountSettingsData }) {
  const tabsId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [activeTab, setActiveTab] = useState<AccountTab>("profile");
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

  function togglePreference(id: string) {
    setPreferences((current) =>
      current.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item)),
    );
  }

  function toggleMfa() {
    const nextValue = !security.mfaEnabled;
    setSecurity((current) => ({ ...current, mfaEnabled: nextValue }));
    setFeedback(
      nextValue
        ? "Multi-factor authentication was enabled in this local preview."
        : "Multi-factor authentication was disabled in this local preview.",
    );
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
    setFeedback("Password rotation was staged locally in this preview.");
  }

  function resetActiveTab() {
    if (activeTab === "profile") {
      setProfile(initialData.profile);
      setFeedback("Profile changes were reset to the current preview state.");
      return;
    }

    if (activeTab === "security") {
      setSecurity(initialData.security);
      setPasswordDraft({ current: "", next: "", confirm: "" });
      setFeedback("Security posture was reset to the current preview state.");
      return;
    }

    setPreferences(initialData.preferences);
    setFeedback("Preference changes were reset to the current preview state.");
  }

  function saveActiveTab() {
    if (activeTab === "profile") {
      setFeedback("Profile changes were staged locally in this preview.");
      return;
    }

    if (activeTab === "security") {
      setFeedback("Security changes were staged locally in this preview.");
      return;
    }

    setFeedback("Preference changes were staged locally in this preview.");
  }

  function focusTab(index: number) {
    const target = accountTabs[index];
    if (!target) return;
    setActiveTab(target.id);
    tabRefs.current[index]?.focus();
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusTab((index + 1) % accountTabs.length);
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusTab((index - 1 + accountTabs.length) % accountTabs.length);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      focusTab(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      focusTab(accountTabs.length - 1);
    }
  }

  const notificationPrefs = preferences.filter((item) => item.group === "notifications");
  const workflowPrefs = preferences.filter((item) => item.group === "workflow");
  const initials = getInitials(profile.fullName);
  const enabledPreferenceCount = preferences.filter((item) => item.enabled).length;
  const activeTabPanelId = `${tabsId}-${activeTab}-panel`;
  const activeTabButtonId = `${tabsId}-${activeTab}-tab`;

  return (
    <div className="settings-screen settings-account-screen">
      {feedback ? <div className="settings-feedback">{feedback}</div> : null}

      <div className="settings-practice-nav">
        <div aria-label="Account sections" className="settings-account-tabs" role="tablist">
          {accountTabs.map((tab, index) => (
            <button
              aria-controls={`${tabsId}-${tab.id}-panel`}
              aria-selected={activeTab === tab.id}
              className={cn("settings-account-tab", activeTab === tab.id && "is-active")}
              id={`${tabsId}-${tab.id}-tab`}
              key={tab.id}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              onClick={() => setActiveTab(tab.id)}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              role="tab"
              tabIndex={activeTab === tab.id ? 0 : -1}
              type="button"
            >
              <strong>{tab.label}</strong>
            </button>
          ))}
        </div>
        <div className="settings-screen-badges">
          <Badge tone="success">{initialData.viewer.role}</Badge>
          <Badge tone={security.mfaEnabled ? "success" : "warning"}>
            {security.mfaEnabled ? "MFA on" : "MFA off"}
          </Badge>
        </div>
      </div>

      <div className="settings-account-shell">
        <div
          aria-labelledby={activeTabButtonId}
          className="settings-account-stage"
          id={activeTabPanelId}
          role="tabpanel"
          tabIndex={0}
        >
          {activeTab === "profile" ? (
            <div className="settings-account-pane">
              <div className="settings-account-pane-intro">
                <div className="settings-account-avatar">
                  <div aria-hidden="true" className="settings-account-avatar-badge">
                    {initials}
                  </div>
                  <div>
                    <h4 className="settings-account-pane-title">Profile identity</h4>
                    <p className="settings-screen-text">
                      These details appear across case collaboration, billing ownership, and internal attribution.
                    </p>
                  </div>
                </div>

                <div className="settings-account-pane-meta">
                  <div className="settings-account-mini-stat">
                    <span>Timezone</span>
                    <strong>{profile.timezone}</strong>
                  </div>
                  <div className="settings-account-mini-stat">
                    <span>Title</span>
                    <strong>{profile.title}</strong>
                  </div>
                </div>
              </div>

              <div className="settings-account-form-card">
                <div className="settings-account-form-grid">
                  <Input
                    label="Full name"
                    name="fullName"
                    value={profile.fullName}
                    onChange={(event) => updateProfile("fullName", event.target.value)}
                  />
                  <Input
                    label="Title"
                    name="title"
                    value={profile.title}
                    onChange={(event) => updateProfile("title", event.target.value)}
                  />
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={(event) => updateProfile("email", event.target.value)}
                  />
                  <Input
                    label="Phone"
                    name="phone"
                    value={profile.phone}
                    onChange={(event) => updateProfile("phone", event.target.value)}
                  />
                  <label className="ui-field">
                    <span className="ui-field-label">Timezone</span>
                    <select
                      className="settings-select"
                      value={profile.timezone}
                      onChange={(event) => updateProfile("timezone", event.target.value)}
                    >
                      <option value="Africa/Accra">Africa/Accra</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </label>
                </div>

                <div className="settings-account-danger-zone">
                  <p className="settings-panel-kicker">Account boundary</p>
                  <p className="settings-screen-text">
                    Personal account edits stay separate from firm-wide policy and never change tenant scope.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === "security" ? (
            <div className="settings-account-pane">
              <div className="settings-account-security-grid">
                <section className="settings-account-section-card">
                  <div className="settings-panel-head">
                    <div>
                      <p className="settings-panel-kicker">Password posture</p>
                      <h4 className="settings-account-pane-title">Keep sign-in confidence visible.</h4>
                    </div>
                    <Button variant="ghost" onClick={() => setPasswordModalOpen(true)}>
                      Change password
                    </Button>
                  </div>

                  <div className="settings-account-stat-row">
                    <div className="settings-account-mini-stat">
                      <span>Last updated</span>
                      <strong>{formatRelativeDate(security.passwordUpdatedAt)}</strong>
                      <small>{formatDateTime(security.passwordUpdatedAt)}</small>
                    </div>
                    <div className="settings-account-mini-stat">
                      <span>Recovery email</span>
                      <strong>{security.recoveryEmail}</strong>
                    </div>
                  </div>
                </section>

                <section className="settings-account-section-card">
                  <div className="settings-panel-head">
                    <div>
                      <p className="settings-panel-kicker">Multi-factor authentication</p>
                      <h4 className="settings-account-pane-title">Use stronger proof for sensitive workspace access.</h4>
                    </div>
                    <Button variant={security.mfaEnabled ? "subtle" : "primary"} onClick={toggleMfa}>
                      {security.mfaEnabled ? "Disable MFA" : "Enable MFA"}
                    </Button>
                  </div>

                  <div className="settings-account-stat-row">
                    <div className="settings-account-mini-stat">
                      <span>Status</span>
                      <strong>{security.mfaEnabled ? "Enabled" : "Disabled"}</strong>
                    </div>
                    <div className="settings-account-mini-stat">
                      <span>Open sessions</span>
                      <strong>{security.sessions.length}</strong>
                    </div>
                  </div>
                </section>
              </div>

              <section className="settings-account-section-card">
                <div className="settings-panel-head">
                  <div>
                    <p className="settings-panel-kicker">Recent device access</p>
                    <h4 className="settings-account-pane-title">Review where your practitioner session has been active.</h4>
                  </div>
                </div>

                <div className="settings-session-list settings-account-session-stack">
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
          ) : null}

          {activeTab === "preferences" ? (
            <div className="settings-account-pane">
              <div className="settings-account-preference-summary">
                <div className="settings-account-mini-stat">
                  <span>Enabled preferences</span>
                  <strong>{enabledPreferenceCount}</strong>
                </div>
                <div className="settings-account-mini-stat">
                  <span>Notification rules</span>
                  <strong>{notificationPrefs.length}</strong>
                </div>
                <div className="settings-account-mini-stat">
                  <span>Workflow choices</span>
                  <strong>{workflowPrefs.length}</strong>
                </div>
              </div>

              <div className="settings-account-preference-grid">
                <section className="settings-account-section-card">
                  <div className="settings-panel-head">
                    <div>
                      <p className="settings-panel-kicker">Notifications</p>
                      <h4 className="settings-account-pane-title">Tune signal without dulling urgent reminders.</h4>
                    </div>
                  </div>

                  <div className="settings-preference-list">
                    {notificationPrefs.map((item) => (
                      <label className="settings-preference-item" key={item.id}>
                        <input checked={item.enabled} onChange={() => togglePreference(item.id)} type="checkbox" />
                        <div>
                          <strong>{item.label}</strong>
                          <p>{item.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </section>

                <section className="settings-account-section-card">
                  <div className="settings-panel-head">
                    <div>
                      <p className="settings-panel-kicker">Workflow ergonomics</p>
                      <h4 className="settings-account-pane-title">Small defaults that make the workspace feel like yours.</h4>
                    </div>
                  </div>

                  <div className="settings-preference-list">
                    {workflowPrefs.map((item) => (
                      <label className="settings-preference-item" key={item.id}>
                        <input checked={item.enabled} onChange={() => togglePreference(item.id)} type="checkbox" />
                        <div>
                          <strong>{item.label}</strong>
                          <p>{item.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          ) : null}
        </div>

        <div className="settings-account-action-row">
          <Button variant="ghost" onClick={resetActiveTab}>
            Cancel
          </Button>
          <Button onClick={saveActiveTab}>Stage changes</Button>
        </div>
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
            <Button onClick={updatePassword}>Stage password change</Button>
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

function getInitials(fullName: string) {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
