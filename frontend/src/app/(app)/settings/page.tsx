export default function Page() {
  return (
    <section className="placeholder-screen">
      <div className="surface-card placeholder-hero">
        <h2 className="section-title">Workspace Settings</h2>
        <p className="placeholder-copy">
          Firm preferences, user roles, and operational defaults will be configured here.
        </p>
      </div>
      <div className="placeholder-grid">
        <div className="surface-card placeholder-card">
          <h3 className="section-title">Firm Controls</h3>
          <p className="placeholder-copy">
            Billing defaults, reminder settings, and workspace metadata will be managed here.
          </p>
        </div>
        <div className="surface-card placeholder-card">
          <h3 className="section-title">Access &amp; Roles</h3>
          <p className="placeholder-copy">
            Staff permissions and client portal boundaries will be administered here.
          </p>
        </div>
      </div>
    </section>
  );
}
