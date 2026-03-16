"use client";

import { useDeferredValue, useState } from "react";

import { Badge, Button, Input, Modal } from "@/components/ui";
import type { InviteStatus, PractitionerRole, TeamMember, TeamSettingsData } from "@/features/settings/types";
import { formatDateTime, formatRelativeDate } from "@/lib/utils";

type StatusFilter = "all" | "active" | "inactive" | "pending";

const roleOptions: PractitionerRole[] = ["admin", "lawyer", "staff"];

export function TeamSettingsClient({ initialData }: { initialData: TeamSettingsData }) {
  const [members, setMembers] = useState(initialData.members);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<PractitionerRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<PractitionerRole>("staff");
  const deferredQuery = useDeferredValue(query);
  const canManage = initialData.viewer.role === "admin";

  const filteredMembers = members.filter((member) => {
    if (roleFilter !== "all" && member.role !== roleFilter) return false;
    if (statusFilter === "active" && !member.isActive) return false;
    if (statusFilter === "inactive" && member.isActive) return false;
    if (statusFilter === "pending" && member.inviteStatus !== "pending") return false;
    if (!deferredQuery.trim()) return true;

    const value = deferredQuery.toLowerCase();
    return [member.fullName, member.email, member.title, member.caseAccessSummary].some((item) =>
      item.toLowerCase().includes(value),
    );
  });

  const activeCount = members.filter((member) => member.isActive).length;
  const pendingCount = members.filter((member) => member.inviteStatus === "pending").length;
  const adminCount = members.filter((member) => member.role === "admin" && member.isActive).length;

  function updateMemberRole(memberId: string, role: PractitionerRole) {
    setMembers((current) =>
      current.map((member) => (member.id === memberId ? { ...member, role } : member)),
    );
    setFeedback("Role coverage updated.");
  }

  function toggleMemberStatus(memberId: string) {
    setMembers((current) =>
      current.map((member) =>
        member.id === memberId
          ? {
              ...member,
              isActive: !member.isActive,
            }
          : member,
      ),
    );
    setFeedback("Access status updated. Historical work remains intact.");
  }

  function handleInvite() {
    if (!inviteName.trim() || !inviteEmail.trim()) {
      setFeedback("Add a name and email before sending an invite.");
      return;
    }

    const next: TeamMember = {
      id: `usr-${Math.random().toString(36).slice(2, 8)}`,
      fullName: inviteName.trim(),
      email: inviteEmail.trim(),
      title: inviteRole === "lawyer" ? "Associate" : inviteRole === "admin" ? "Practice Administrator" : "Staff Member",
      role: inviteRole,
      isActive: true,
      inviteStatus: "pending",
      lastLoginAt: null,
      caseAccessSummary: inviteRole === "staff" ? "Assigned cases only" : "Role coverage pending review",
      billingAccess: inviteRole === "staff" ? "none" : "limited",
    };

    setMembers((current) => [next, ...current]);
    setInviteName("");
    setInviteEmail("");
    setInviteRole("staff");
    setInviteOpen(false);
    setFeedback(`Invitation queued for ${next.fullName}.`);
  }

  return (
    <div className="settings-screen">
      <div className="surface-card settings-screen-hero">
        <div className="settings-screen-copy">
          <p className="eyebrow-label">Team</p>
          <h3 className="settings-screen-title">Keep the roster disciplined and the permission story obvious.</h3>
          <p className="settings-screen-text">
            The team screen should explain who has access, who is still pending, and where billing authority is more
            sensitive than ordinary case collaboration.
          </p>
        </div>

        <div className="settings-screen-badges">
          <Badge tone={canManage ? "success" : "warning"}>
            {canManage ? "Admin management enabled" : "Read-only roster"}
          </Badge>
          <Badge tone="info">{initialData.seatCount} seats planned</Badge>
        </div>
      </div>

      {feedback ? <div className="settings-feedback">{feedback}</div> : null}

      {!canManage ? (
        <div className="settings-readonly-banner">
          You can inspect who is in the workspace, but only admins can invite, deactivate, or adjust role coverage.
        </div>
      ) : null}

      <div className="settings-stat-grid">
        <div className="surface-card settings-stat-card">
          <span>Active seats</span>
          <strong>{activeCount}</strong>
          <small>People currently able to enter the practitioner workspace.</small>
        </div>
        <div className="surface-card settings-stat-card">
          <span>Pending invites</span>
          <strong>{pendingCount}</strong>
          <small>Seats that still need acceptance before they become fully active.</small>
        </div>
        <div className="surface-card settings-stat-card">
          <span>Admin coverage</span>
          <strong>{adminCount}</strong>
          <small>Keep at least one active admin responsible for firm-wide controls.</small>
        </div>
      </div>

      <div className="surface-card settings-panel">
        <div className="settings-panel-head">
          <div>
            <p className="settings-panel-kicker">Roster controls</p>
            <h4 className="settings-panel-title">Search, filter, and adjust the people layer of the workspace</h4>
          </div>
          <Button onClick={() => setInviteOpen(true)} disabled={!canManage}>
            Invite team member
          </Button>
        </div>

        <div className="settings-toolbar-grid">
          <Input
            label="Search team"
            name="query"
            placeholder="Search name, email, title..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <label className="ui-field">
            <span className="ui-field-label">Role</span>
            <select
              className="settings-select"
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value as PractitionerRole | "all")}
            >
              <option value="all">All roles</option>
              <option value="admin">Admin</option>
              <option value="lawyer">Lawyer</option>
              <option value="staff">Staff</option>
            </select>
          </label>
          <label className="ui-field">
            <span className="ui-field-label">Status</span>
            <select
              className="settings-select"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending invite</option>
            </select>
          </label>
        </div>

        {filteredMembers.length === 0 ? (
          <div className="settings-empty-state">
            <p className="section-title">No team members match these filters.</p>
            <p className="placeholder-copy">Adjust the roster filters or clear search to restore the full team view.</p>
          </div>
        ) : (
          <>
            <div className="settings-team-table">
              <div className="settings-team-head">
                <span>Team member</span>
                <span>Role</span>
                <span>Access</span>
                <span>Billing</span>
                <span>Last login</span>
                <span>Action</span>
              </div>

              <div className="settings-team-body">
                {filteredMembers.map((member) => (
                  <div className="settings-team-row" key={member.id}>
                    <div className="settings-team-identity">
                      <strong>{member.fullName}</strong>
                      <small>
                        {member.email} - {member.title}
                      </small>
                      <div className="settings-team-tags">
                        <Badge tone={badgeToneForInvite(member.inviteStatus)}>
                          {labelForInvite(member.inviteStatus)}
                        </Badge>
                        <Badge tone={member.isActive ? "success" : "warning"}>
                          {member.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>

                    <span>
                      {canManage ? (
                        <select
                          className="settings-select settings-inline-select"
                          value={member.role}
                          onChange={(event) => updateMemberRole(member.id, event.target.value as PractitionerRole)}
                        >
                          {roleOptions.map((role) => (
                            <option key={role} value={role}>
                              {role[0].toUpperCase() + role.slice(1)}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <strong className="settings-inline-copy">{member.role}</strong>
                      )}
                    </span>

                    <span className="settings-inline-copy">{member.caseAccessSummary}</span>
                    <span className="settings-inline-copy">{labelForBillingAccess(member.billingAccess)}</span>
                    <span className="settings-inline-copy">
                      {member.lastLoginAt
                        ? `${formatRelativeDate(member.lastLoginAt)} - ${formatDateTime(member.lastLoginAt)}`
                        : "Invite not yet accepted"}
                    </span>

                    <span className="settings-action-cell">
                      <Button
                        onClick={() => toggleMemberStatus(member.id)}
                        disabled={!canManage}
                        size="sm"
                        variant={member.isActive ? "ghost" : "subtle"}
                      >
                        {member.isActive ? "Deactivate" : "Reactivate"}
                      </Button>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="settings-team-card-stack">
              {filteredMembers.map((member) => (
                <article className="surface-card settings-team-card" key={member.id}>
                  <div className="settings-team-card-head">
                    <div>
                      <h5>{member.fullName}</h5>
                      <p>{member.title}</p>
                    </div>
                    <Badge tone={member.isActive ? "success" : "warning"}>
                      {member.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="placeholder-copy">{member.email}</p>
                  <p className="settings-inline-copy">{member.caseAccessSummary}</p>
                  <div className="settings-team-tags">
                    <Badge tone={badgeToneForInvite(member.inviteStatus)}>
                      {labelForInvite(member.inviteStatus)}
                    </Badge>
                    <Badge tone="info">{labelForBillingAccess(member.billingAccess)}</Badge>
                  </div>
                  <div className="settings-team-card-actions">
                    <label className="ui-field">
                      <span className="ui-field-label">Role</span>
                      <select
                        className="settings-select"
                        value={member.role}
                        onChange={(event) => updateMemberRole(member.id, event.target.value as PractitionerRole)}
                        disabled={!canManage}
                      >
                        {roleOptions.map((role) => (
                          <option key={role} value={role}>
                            {role[0].toUpperCase() + role.slice(1)}
                          </option>
                        ))}
                      </select>
                    </label>
                    <Button onClick={() => toggleMemberStatus(member.id)} disabled={!canManage} variant="ghost">
                      {member.isActive ? "Deactivate" : "Reactivate"}
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="settings-panel-grid">
        <section className="surface-card settings-panel">
          <div className="settings-panel-head">
            <div>
              <p className="settings-panel-kicker">Role logic</p>
              <h4 className="settings-panel-title">Keep access language crisp</h4>
            </div>
          </div>

          <div className="settings-rule-list">
            <div className="settings-rule-item">
              <strong>Admin</strong>
              <p>Controls firm defaults, user lifecycle, and the sensitive financial posture of the workspace.</p>
            </div>
            <div className="settings-rule-item">
              <strong>Lawyer</strong>
              <p>Works the legal case surface directly, but should not implicitly inherit every administrative power.</p>
            </div>
            <div className="settings-rule-item">
              <strong>Staff</strong>
              <p>Supports operations, filing, or finance according to assigned scope, without accidental oversharing.</p>
            </div>
          </div>
        </section>

        <section className="surface-card settings-panel settings-panel-accent">
          <p className="settings-panel-kicker">Deactivation policy</p>
          <h4 className="settings-panel-title">Access stops. History stays.</h4>
          <p className="settings-screen-text">
            The workspace should make it plain that turning off a seat removes access while preserving audit, note,
            message, and billing history already attached to that user.
          </p>
        </section>
      </div>

      <Modal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Invite team member"
        footer={
          <>
            <Button variant="ghost" onClick={() => setInviteOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInvite}>Send invite</Button>
          </>
        }
      >
        <div className="settings-modal-grid">
          <Input label="Full name" name="inviteName" value={inviteName} onChange={(event) => setInviteName(event.target.value)} />
          <Input label="Email" name="inviteEmail" type="email" value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} />
          <label className="ui-field">
            <span className="ui-field-label">Role</span>
            <select className="settings-select" value={inviteRole} onChange={(event) => setInviteRole(event.target.value as PractitionerRole)}>
              <option value="staff">Staff</option>
              <option value="lawyer">Lawyer</option>
              <option value="admin">Admin</option>
            </select>
          </label>
        </div>
      </Modal>
    </div>
  );
}

function labelForInvite(status: InviteStatus) {
  if (status === "accepted") return "Accepted";
  if (status === "expired") return "Expired";
  return "Pending invite";
}

function badgeToneForInvite(status: InviteStatus): "success" | "warning" | "danger" {
  if (status === "accepted") return "success";
  if (status === "expired") return "danger";
  return "warning";
}

function labelForBillingAccess(access: TeamMember["billingAccess"]) {
  if (access === "full") return "Full billing access";
  if (access === "limited") return "Limited billing access";
  return "No billing access";
}
