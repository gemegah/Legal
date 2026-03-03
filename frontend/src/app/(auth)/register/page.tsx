import Link from "next/link";

import { Badge, Button, Input } from "@/components/ui";

export default function Page() {
  return (
    <main className="auth-shell">
      <section className="auth-panel auth-panel-primary">
        <p className="auth-brand">LegalOS</p>
        <div className="starter-stack">
          <Badge tone="info">Workspace Bootstrap</Badge>
          <h1 className="auth-title">Set up a firm-ready workspace in one pass.</h1>
          <p className="starter-copy">
            The registration flow now exposes the inputs we expect for tenant bootstrap, instead of a dead-end page.
          </p>
        </div>
        <div className="starter-meta-grid">
          <div className="starter-meta-card">
            <span>Market</span>
            <strong>Ghana-first</strong>
          </div>
          <div className="starter-meta-card">
            <span>Payments</span>
            <strong>MoMo + Card</strong>
          </div>
          <div className="starter-meta-card">
            <span>Mode</span>
            <strong>Review-first AI</strong>
          </div>
        </div>
      </section>

      <section className="auth-panel auth-panel-secondary">
        <div className="auth-card">
          <div className="starter-stack">
            <p className="starter-kicker">Firm Registration</p>
            <h2 className="starter-card-title">Create a LegalOS workspace</h2>
          </div>

          <form className="auth-form">
            <Input label="Firm name" name="firmName" placeholder="Akosua & Co." />
            <Input label="Workspace slug" name="slug" placeholder="akosua-law" />
            <Input label="Admin email" name="email" placeholder="admin@akosialaw.com" type="email" />
            <Input label="Password" name="password" placeholder="Choose a secure password" type="password" />
            <Button variant="accent">Create workspace</Button>
          </form>

          <Link className="btn btn-ghost ui-button-md" href="/login">
            Back to sign in
          </Link>
        </div>
      </section>
    </main>
  );
}
