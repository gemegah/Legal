export default function Page() {
  return (
    <section className="matter-tab-panel">
      <div className="surface-card matter-tab-card">
        <h2 className="section-title">Matter Notes</h2>
        <p className="matter-tab-copy">
          Working notes, pinned highlights, and authored updates for this matter will live here.
        </p>
        <div className="empty-state matter-tab-empty">
          Note threads, pinned guidance, and authored updates will be added in the notes pass.
        </div>
      </div>
    </section>
  );
}
