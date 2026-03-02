export default function Page() {
  return (
    <section className="matter-tab-panel">
      <div className="surface-card matter-tab-card">
        <h2 className="section-title">Matter Billing</h2>
        <p className="matter-tab-copy">
          Time entries, expenses, and invoice generation for this matter will be managed here.
        </p>
        <div className="empty-state matter-tab-empty">
          Time logs, disbursements, and invoice drafting controls will land here in the billing pass.
        </div>
      </div>
    </section>
  );
}
