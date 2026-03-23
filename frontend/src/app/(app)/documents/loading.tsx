export default function DocumentsLoading() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
      {/* Toolbar */}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <div className="skeleton" style={{ height: 36, flex: 1, maxWidth: 280, borderRadius: "var(--radius-md)" }} />
        <div className="skeleton" style={{ height: 36, width: 120, borderRadius: "var(--radius-pill)" }} />
        <div className="skeleton" style={{ height: 36, width: 120, borderRadius: "var(--radius-pill)" }} />
        <div className="skeleton" style={{ height: 36, width: 100, borderRadius: "var(--radius-pill)", marginLeft: "auto" }} />
      </div>

      {/* Document row list */}
      <div className="surface-card" style={{ padding: "var(--space-5)", display: "flex", flexDirection: "column", gap: 0 }}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "12px 0",
              borderBottom: i < 7 ? "1px solid var(--color-border)" : "none",
            }}
          >
            <div className="skeleton" style={{ height: 36, width: 36, borderRadius: "var(--radius-md)", flexShrink: 0 }} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
              <div className="skeleton" style={{ height: 14, width: "45%", borderRadius: "var(--radius-sm)" }} />
              <div className="skeleton" style={{ height: 12, width: "25%", borderRadius: "var(--radius-sm)" }} />
            </div>
            <div className="skeleton" style={{ height: 22, width: 64, borderRadius: "var(--radius-pill)" }} />
            <div className="skeleton" style={{ height: 12, width: 80, borderRadius: "var(--radius-sm)" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
