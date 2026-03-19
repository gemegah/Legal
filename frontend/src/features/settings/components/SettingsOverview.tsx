import Link from "next/link";

import type { SettingsWorkspaceData } from "@/features/settings/types";

export function SettingsOverview({ workspace }: { workspace: SettingsWorkspaceData }) {
  const pendingInvites = workspace.team.members.filter((member) => member.inviteStatus === "pending").length;
  const activeSeats = workspace.team.members.filter((member) => member.isActive).length;
  const adminCoverage = workspace.team.members.filter((member) => member.role === "admin" && member.isActive).length;
  const enabledPreferences = workspace.account.preferences.filter((preference) => preference.enabled).length;

  const cards = [
    {
      href: "/settings/practice",
      step: "01",
      label: "Practice",
      title: "Shape the firm defaults practitioners and clients keep feeling.",
      text: "Use this room for identity, reminder cadence, visibility defaults, and billing language that must stay consistent.",
      metrics: [
        { label: "Timezone", value: workspace.practice.practice.timezone },
        { label: "Reminder cadence", value: workspace.practice.practice.reminderCadence },
        { label: "Case visibility", value: workspace.practice.practice.defaultCaseVisibility },
      ],
    },
    {
      href: "/settings/team",
      step: "02",
      label: "Team",
      title: "Keep the roster precise and the permission story obvious.",
      text: "Move here when you need to invite, deactivate, or review who can touch billing and firm-wide controls.",
      metrics: [
        { label: "Active seats", value: String(activeSeats) },
        { label: "Pending invites", value: String(pendingInvites) },
        { label: "Active admins", value: String(adminCoverage) },
      ],
    },
    {
      href: "/settings/account",
      step: "03",
      label: "Account",
      title: "Finish with your own posture, sessions, and notification signal.",
      text: "This is the personal layer for profile edits, MFA posture, active devices, and how much operational noise reaches you.",
      metrics: [
        { label: "Role", value: workspace.account.viewer.role },
        { label: "MFA", value: workspace.account.security.mfaEnabled ? "Enabled" : "Off" },
        { label: "Preferences on", value: String(enabledPreferences) },
      ],
    },
  ];

  return (
    <div className="settings-screen settings-screen-optimized settings-overview">
      <div className="settings-overview-intro">
        <div className="surface-card settings-overview-brief">
          <p className="settings-panel-kicker">Suggested order</p>
          <h4 className="settings-panel-title">Practice sets the rules. Team applies them. Account personalizes the signal.</h4>
          <p className="settings-screen-text">
            Use the overview when you need context, then open a single room and make changes there. It keeps each
            decision focused without losing the bigger governance picture.
          </p>
        </div>
      </div>

      <div className="settings-overview-grid">
        {cards.map((card) => (
          <Link className="surface-card settings-overview-card" href={card.href} key={card.href}>
            <div className="settings-overview-card-top">
              <span className="settings-overview-step">{card.step}</span>
              <span className="settings-overview-open">Open room</span>
            </div>

            <div className="settings-overview-card-copy">
              <p className="settings-panel-kicker">{card.label}</p>
              <h4 className="settings-panel-title">{card.title}</h4>
              <p className="settings-screen-text">{card.text}</p>
            </div>

            <div className="settings-overview-metric-list">
              {card.metrics.map((metric) => (
                <div className="settings-overview-metric" key={metric.label}>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                </div>
              ))}
            </div>
          </Link>
        ))}
      </div>

      <div className="settings-overview-detail-grid">
        <section className="surface-card settings-panel">
          <div className="settings-panel-head">
            <div>
              <p className="settings-panel-kicker">Signed in as</p>
              <h4 className="settings-panel-title">{workspace.viewer.fullName}</h4>
            </div>
          </div>

          <div className="settings-rule-list">
            <div className="settings-rule-item">
              <strong>{workspace.viewer.title}</strong>
              <p>{workspace.viewer.email}</p>
            </div>
            <div className="settings-rule-item">
              <strong>Role posture</strong>
              <p>
                {workspace.viewer.role === "admin"
                  ? "You can move across practice, team, and personal controls."
                  : "Some rooms will remain read-only because firm-wide controls stay admin-owned."}
              </p>
            </div>
            <div className="settings-rule-item">
              <strong>Current scope</strong>
              <p>Settings changes stay inside the practitioner workspace and never borrow client-side identifiers.</p>
            </div>
          </div>
        </section>

        <section className="surface-card settings-panel settings-panel-accent">
          <div className="settings-panel-head">
            <div>
              <p className="settings-panel-kicker">Governance guardrails</p>
              <h4 className="settings-panel-title">The screen should stay honest about what each room can change.</h4>
            </div>
          </div>

          <div className="settings-rule-list">
            <div className="settings-rule-item">
              <strong>Practice</strong>
              <p>Firm identity, reminders, and payment language are operational defaults that affect live work.</p>
            </div>
            <div className="settings-rule-item">
              <strong>Team</strong>
              <p>Invites and role changes control access without erasing audit, billing, or case history.</p>
            </div>
            <div className="settings-rule-item">
              <strong>Account</strong>
              <p>Sessions, MFA, and preferences belong to the practitioner and should never masquerade as firm policy.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
