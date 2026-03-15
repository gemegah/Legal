import Link from "next/link";

import { Badge } from "@/components/ui";

export default function Page() {
  return (
    <main className="starter-shell">
      <div className="starter-frame">
        <section className="starter-hero">
          <div className="starter-hero-copy">
            <p className="starter-kicker">Client Portal</p>
            <h1 className="starter-title">A client-facing workspace that reduces status calls.</h1>
            <p className="starter-copy">
              This page now acts as a real portal landing surface with clear navigation, visibility boundaries, and
              expected actions for the next backend integration slice.
            </p>
          </div>
          <Badge tone="info">Preview Mode</Badge>
        </section>

        <section className="starter-grid">
          <article className="starter-card">
            <h2 className="starter-card-title">What clients can do</h2>
            <ul className="starter-list" style={{ marginTop: "14px" }}>
              <li>View case updates that the firm explicitly publishes.</li>
              <li>Download shared documents and see invoice status.</li>
              <li>Pay invoices and upload requested files without calling the office.</li>
            </ul>
            <div className="starter-actions" style={{ marginTop: "18px" }}>
              <Link className="btn btn-primary ui-button-md" href="/portal/cases/CAS-0041">
                Open case preview
              </Link>
              <Link className="btn btn-ghost ui-button-md" href="/portal/invoices/INV-1009">
                Open invoice preview
              </Link>
            </div>
          </article>

          <aside className="starter-card">
            <h2 className="starter-card-title">Visibility rules</h2>
            <div className="starter-stack" style={{ marginTop: "14px" }}>
              <Badge tone="success">Shared only</Badge>
              <p className="starter-card-copy">Internal notes, unshared documents, and other clients' billing stay hidden.</p>
              <Badge tone="warning">Portal auth pending</Badge>
              <p className="starter-card-copy">Login and document actions are ready to connect once auth and storage wiring lands.</p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
