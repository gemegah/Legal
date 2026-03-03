import { Badge, Button, Input } from "@/components/ui";

export default function Page() {
  return (
    <section className="dashboard-shell">
      <div className="surface-card starter-hero">
        <div className="starter-hero-copy">
          <p className="starter-kicker">Workspace Settings</p>
          <h2 className="starter-card-title">Operational defaults now have a real starter surface.</h2>
          <p className="starter-copy">
            This screen now communicates the actual inputs we expect to wire next: billing defaults, reminder windows,
            workspace metadata, and role boundaries.
          </p>
        </div>
        <Badge tone="info">Config Stub</Badge>
      </div>

      <div className="starter-grid">
        <div className="surface-card starter-card">
          <h3 className="starter-card-title">Firm Controls</h3>
          <div className="auth-form" style={{ marginTop: "14px" }}>
            <Input label="Workspace name" name="workspaceName" placeholder="LegalOS Ghana Demo" />
            <Input label="Default reminder cadence" name="reminders" placeholder="7d, 3d, 1d, same day" />
            <Button variant="primary">Save defaults</Button>
          </div>
        </div>

        <div className="surface-card starter-card">
          <h3 className="starter-card-title">Access &amp; Roles</h3>
          <div className="starter-stack" style={{ marginTop: "14px" }}>
            <Badge tone="success">Admin</Badge>
            <p className="starter-card-copy">Manage workspace defaults, billing settings, and integration rollout.</p>
            <Badge tone="warning">Lawyer / Staff / Client</Badge>
            <p className="starter-card-copy">Role-scoped views stay aligned with matter membership and portal visibility.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
