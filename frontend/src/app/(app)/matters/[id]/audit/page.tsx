export default function Page() {
  return (
    <section className="matter-tab-panel">
      <div className="surface-card matter-tab-card">
        <h2 className="section-title">Matter Audit Trail</h2>
        <p className="matter-tab-copy">
          Immutable activity history for changes, views, and client actions will be visible here.
        </p>
        <div className="empty-state matter-tab-empty">
          Policy-controlled audit events and change diffs will be added in the audit pass.
        </div>
      </div>
    </section>
  );
}
