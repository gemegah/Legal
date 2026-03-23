export default function DashboardLoading() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
      {/* Stat cards row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-4)" }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="surface-card" style={{ padding: "var(--space-5)", display: "flex", flexDirection: "column", gap: 10 }}>
            <div className="skeleton" style={{ height: 12, width: 80, borderRadius: "var(--radius-sm)" }} />
            <div className="skeleton" style={{ height: 28, width: 100, borderRadius: "var(--radius-sm)" }} />
            <div className="skeleton" style={{ height: 12, width: 60, borderRadius: "var(--radius-sm)" }} />
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="surface-card" style={{ padding: "var(--space-5)", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="skeleton" style={{ height: 20, width: 120, borderRadius: "var(--radius-sm)" }} />
          <div className="skeleton" style={{ height: 32, width: 100, borderRadius: "var(--radius-pill)" }} />
        </div>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div className="skeleton" style={{ height: 14, width: "30%", borderRadius: "var(--radius-sm)" }} />
            <div className="skeleton" style={{ height: 14, width: "20%", borderRadius: "var(--radius-sm)" }} />
            <div className="skeleton" style={{ height: 14, width: "15%", borderRadius: "var(--radius-sm)" }} />
            <div className="skeleton" style={{ height: 22, width: 64, borderRadius: "var(--radius-pill)", marginLeft: "auto" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
