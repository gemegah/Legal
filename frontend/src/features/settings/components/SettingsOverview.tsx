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
        { label: "Reminder", value: workspace.practice.practice.reminderCadence },
        { label: "visibility", value: workspace.practice.practice.defaultCaseVisibility },
      ],
    },
    {
      href: "/settings/team",
      step: "02",
      label: "Team",
      title: "Keep the roster precise and the permission story obvious.",
      text: "Move here when you need to invite, deactivate, or review who can touch billing and firm-wide controls.",
      metrics: [
        { label: "Seats", value: String(activeSeats) },
        { label: "Invites", value: String(pendingInvites) },
        { label: "Admins", value: String(adminCoverage) },
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
        { label: "Preferences", value: String(enabledPreferences) },
      ],
    },
  ];

  return (
    <div className="settings-screen settings-screen-optimized settings-overview">
      <div className="settings-overview-header">
        <div className="settings-overview-header-copy">
          {/* <p className="settings-panel-kicker">Settings</p> */}
          <h2 className="settings-overview-header-title">Practice, team, and account governed in one workspace.</h2>
        </div>
        <div className="settings-overview-viewer">
          <strong className="settings-overview-viewer-name">{workspace.viewer.fullName}</strong>
          <span className="settings-overview-viewer-role">{workspace.viewer.role}</span>
          {/* <span className="settings-overview-viewer-scope">
            {workspace.viewer.role === "admin"
              ? "Full access across practice, team, and account controls."
              : "Firm-wide controls are read-only. Account and personal preferences remain editable."}
          </span> */}
        </div>
      </div>

      <div className="settings-overview-grid">
        {cards.map((card) => (
          <Link aria-label={`${card.label} settings`} className="surface-card settings-overview-card" href={card.href} key={card.href}>
            <div className="settings-overview-card-top">
              <span className="settings-overview-step">{card.step}</span>
              <span className="settings-overview-open">Open room</span>
            </div>

            <div className="settings-overview-card-copy">
              <p className="settings-panel-kicker" >{card.label}</p>
              <h4 className="settings-panel-title">{card.title}</h4>
              <p className="settings-screen-text">{card.text}</p>
            </div>

            <div className="settings-overview-metric-list">
              {card.metrics.map((metric) => (
                <div className="settings-overview-metric" key={metric.label} >
                  <span>{metric.label}</span>
                  <strong style={{maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{metric.value}</strong>
                </div>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
