export default function BillingLoading() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-4)" }}>
        {[0, 1, 2].map((i) => (
          <div key={i} className="surface-card" style={{ padding: "var(--space-5)", display: "flex", flexDirection: "column", gap: 10 }}>
            <div className="skeleton" style={{ height: 12, width: 90, borderRadius: "var(--radius-sm)" }} />
            <div className="skeleton" style={{ height: 30, width: 120, borderRadius: "var(--radius-sm)" }} />
            <div className="skeleton" style={{ height: 12, width: 70, borderRadius: "var(--radius-sm)" }} />
          </div>
        ))}
      </div>

      {/* Invoice table */}
      <div className="surface-card" style={{ padding: "var(--space-5)", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="skeleton" style={{ height: 20, width: 110, borderRadius: "var(--radius-sm)" }} />
          <div style={{ display: "flex", gap: 8 }}>
            <div className="skeleton" style={{ height: 32, width: 100, borderRadius: "var(--radius-pill)" }} />
            <div className="skeleton" style={{ height: 32, width: 110, borderRadius: "var(--radius-pill)" }} />
          </div>
        </div>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div className="skeleton" style={{ height: 14, width: 90, borderRadius: "var(--radius-sm)" }} />
            <div className="skeleton" style={{ height: 14, width: "30%", borderRadius: "var(--radius-sm)" }} />
            <div className="skeleton" style={{ height: 14, width: 80, borderRadius: "var(--radius-sm)", marginLeft: "auto" }} />
            <div className="skeleton" style={{ height: 22, width: 64, borderRadius: "var(--radius-pill)" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
