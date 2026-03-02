export default function Page() {
  return (
    <section className="matter-tab-panel">
      <div className="surface-card matter-tab-card">
        <h2 className="section-title">Matter Documents</h2>
        <p className="matter-tab-copy">
          Uploads, versions, OCR status, and sharing controls for this matter will appear here.
        </p>
        <div className="empty-state matter-tab-empty">
          Document versions, OCR state, and client-sharing controls will be added in the documents pass.
        </div>
      </div>
    </section>
  );
}
