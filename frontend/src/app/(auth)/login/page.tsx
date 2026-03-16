import Link from "next/link";

import { Badge, Button, Input } from "@/components/ui";

export default function Page() {
  return (
    <main className="auth-shell">
      <section className="auth-panel auth-panel-primary">
        <p className="auth-brand">LegalOS</p>
        <div className="starter-stack">
          <Badge tone="warning">Starter Surface Ready</Badge>
          <h1 className="auth-title">Run the firm from one case-centric workspace.</h1>
          <p className="starter-copy">
            LegalOS brings deadlines, billing, documents, and client updates into one Ghana-first operating system.
            This starter login screen is now a real integration surface instead of placeholder copy.
          </p>
        </div>
        <ul className="starter-list">
          <li>Deadline reminders stay visible across cases and the shared calendar.</li>
          <li>AI drafts remain review-first and clearly separated from saved records.</li>
          <li>Client billing and document access stay tied to the same case audit trail.</li>
        </ul>
      </section>

      <section className="auth-panel auth-panel-secondary">
        <div className="auth-card">
          <div className="starter-stack">
            <p className="starter-kicker">Staff Sign In</p>
            <h2 className="starter-card-title">Access your firm workspace</h2>
            <p className="starter-card-copy">
              Authentication wiring comes next. This form now reflects the expected fields and state transitions.
            </p>
          </div>

          <form className="auth-form">
            <Input autoComplete="email" label="Work email" name="email" placeholder="partner@akosialaw.com" type="email" />
            <Input
              autoComplete="current-password"
              hint="Production auth will validate firm membership and role."
              label="Password"
              name="password"
              placeholder="Enter your password"
              type="password"
            />
            <Button variant="primary">Continue to dashboard</Button>
          </form>

          <div className="starter-actions">
            <Link className="btn btn-ghost ui-button-md" href="/register">
              Create a workspace
            </Link>
            <Link className="btn btn-subtle ui-button-md" href="/portal">
              Client portal preview
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
