export default function Page() {
  return (
    <section className="placeholder-screen">
      <div className="surface-card placeholder-hero">
        <h2 className="section-title">Billing Operations</h2>
        <p className="placeholder-copy">
          Invoices, AR, and payment workflows will live here.
        </p>
      </div>
      <div className="placeholder-grid">
        <div className="surface-card placeholder-card">
          <h3 className="section-title">Invoice Queue</h3>
          <p className="placeholder-copy">
            Draft, reviewed, sent, and overdue invoices will be managed from this view.
          </p>
        </div>
        <div className="surface-card placeholder-card">
          <h3 className="section-title">Collections</h3>
          <p className="placeholder-copy">
            MoMo, card, and reconciliation statuses will be visible at a glance.
          </p>
        </div>
      </div>
    </section>
  );
}
