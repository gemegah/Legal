export default function Page() {
  return (
    <section className="placeholder-screen">
      <div className="surface-card placeholder-hero">
        <h2 className="section-title">Message Center</h2>
        <p className="placeholder-copy">
          Internal and client-facing communication threads will be coordinated here.
        </p>
      </div>
      <div className="placeholder-grid">
        <div className="surface-card placeholder-card">
          <h3 className="section-title">Client Updates</h3>
          <p className="placeholder-copy">
            Portal-safe updates and AI-assisted client drafts will be queued here.
          </p>
        </div>
        <div className="surface-card placeholder-card">
          <h3 className="section-title">Team Threads</h3>
          <p className="placeholder-copy">
            Matter-linked conversations will keep context attached to the file.
          </p>
        </div>
      </div>
    </section>
  );
}
