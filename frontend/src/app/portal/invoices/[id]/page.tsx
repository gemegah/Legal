import Link from "next/link";

import { Badge, Button } from "@/components/ui";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <main className="starter-shell">
      <div className="starter-frame">
        <section className="starter-hero">
          <div className="starter-hero-copy">
            <p className="starter-kicker">Invoice</p>
            <h1 className="starter-title">{params.id}</h1>
            <p className="starter-copy">
              This invoice route now models the client payment handoff with explicit status, payment channels, and a
              clear next integration target for live payment links.
            </p>
          </div>
          <Badge tone="warning">Payment Link Stub</Badge>
        </section>

        <section className="starter-grid">
          <article className="starter-card">
            <h2 className="starter-card-title">Invoice summary</h2>
            <div className="starter-meta-grid" style={{ marginTop: "14px" }}>
              <div className="starter-meta-card">
                <span>Status</span>
                <strong>Partially Paid</strong>
              </div>
              <div className="starter-meta-card">
                <span>Total</span>
                <strong>GHS 6,500</strong>
              </div>
              <div className="starter-meta-card">
                <span>Balance</span>
                <strong>GHS 1,800</strong>
              </div>
            </div>
          </article>

          <aside className="starter-card">
            <h2 className="starter-card-title">Next payment methods</h2>
            <ul className="starter-list" style={{ marginTop: "14px" }}>
              <li>MoMo collection via Hubtel adapter.</li>
              <li>Card checkout via Paystack link.</li>
              <li>Webhook reconciliation to update invoice status automatically.</li>
            </ul>
            <div className="starter-actions" style={{ marginTop: "18px" }}>
              <Button variant="accent">Send payment link</Button>
              <Link className="btn btn-ghost ui-button-md" href="/portal">
                Return to portal
              </Link>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
