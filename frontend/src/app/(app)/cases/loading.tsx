export default function CasesLoading() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
      {/* Filter pill row */}
      <div style={{ display: "flex", gap: 8 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton" style={{ height: 32, width: 72, borderRadius: "var(--radius-pill)" }} />
        ))}
        <div className="skeleton" style={{ height: 32, width: 160, borderRadius: "var(--radius-pill)", marginLeft: "auto" }} />
      </div>

      {/* Case card grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-4)" }}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="surface-card" style={{ padding: "var(--space-5)", display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="skeleton" style={{ height: 22, width: 64, borderRadius: "var(--radius-pill)" }} />
              <div className="skeleton" style={{ height: 22, width: 48, borderRadius: "var(--radius-pill)" }} />
            </div>
            <div className="skeleton" style={{ height: 18, width: "80%", borderRadius: "var(--radius-sm)" }} />
            <div className="skeleton" style={{ height: 14, width: "55%", borderRadius: "var(--radius-sm)" }} />
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <div className="skeleton" style={{ height: 12, width: 80, borderRadius: "var(--radius-sm)" }} />
              <div className="skeleton" style={{ height: 12, width: 80, borderRadius: "var(--radius-sm)" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
