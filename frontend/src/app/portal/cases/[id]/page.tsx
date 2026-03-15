import Link from "next/link";

import { Badge } from "@/components/ui";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <main className="starter-shell">
      <div className="starter-frame">
        <section className="starter-hero">
          <div className="starter-hero-copy">
            <p className="starter-kicker">Case Timeline</p>
            <h1 className="starter-title">Case {params.id}</h1>
            <p className="starter-copy">
              Client-visible updates, shared documents, and next actions will appear here. This route now communicates
              real portal structure instead of a placeholder response.
            </p>
          </div>
          <Badge tone="success">Client Visible</Badge>
        </section>

        <section className="starter-grid">
          <article className="starter-card">
            <h2 className="starter-card-title">Recent shared updates</h2>
            <ul className="starter-list" style={{ marginTop: "14px" }}>
              <li>Status updated after today's hearing review.</li>
              <li>Affidavit draft shared for client reference.</li>
              <li>Next filing reminder scheduled for 15 March 2026.</li>
            </ul>
          </article>

          <aside className="starter-card">
            <h2 className="starter-card-title">Next actions</h2>
            <div className="starter-stack" style={{ marginTop: "14px" }}>
              <Badge tone="info">Awaiting upload</Badge>
              <p className="starter-card-copy">Client can upload requested source documents once storage integration is wired.</p>
              <Link className="btn btn-ghost ui-button-md" href="/portal">
                Back to portal home
              </Link>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
