export default function Page() {
  return (
    <section className="placeholder-screen">
      <div className="surface-card placeholder-hero">
        <h2 className="section-title">Matter Workspace</h2>
        <p className="placeholder-copy">
          Matter workspace will surface matter list, filters, and quick actions.
        </p>
      </div>
      <div className="placeholder-grid">
        <div className="surface-card placeholder-card">
          <h3 className="section-title">Matter Pipeline</h3>
          <p className="placeholder-copy">
            Open, pending, and archived matters will be grouped for fast review.
          </p>
        </div>
        <div className="surface-card placeholder-card">
          <h3 className="section-title">Task Context</h3>
          <p className="placeholder-copy">
            Matter-level tasks stay nested here so lawyers can work from one case context.
          </p>
        </div>
      </div>
    </section>
  );
}
