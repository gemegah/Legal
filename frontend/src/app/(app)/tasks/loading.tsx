export default function TasksLoading() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
      {/* Toolbar */}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <div className="skeleton" style={{ height: 36, flex: 1, maxWidth: 260, borderRadius: "var(--radius-md)" }} />
        <div className="skeleton" style={{ height: 36, width: 100, borderRadius: "var(--radius-pill)" }} />
        <div className="skeleton" style={{ height: 36, width: 120, borderRadius: "var(--radius-pill)", marginLeft: "auto" }} />
      </div>

      {/* 3-column board */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-4)", alignItems: "start" }}>
        {[0, 1, 2].map((col) => (
          <div key={col} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Column header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" }}>
              <div className="skeleton" style={{ height: 16, width: 80, borderRadius: "var(--radius-sm)" }} />
              <div className="skeleton" style={{ height: 22, width: 28, borderRadius: "var(--radius-pill)" }} />
            </div>
            {/* Task cards */}
            {[0, 1, 2, 3].slice(0, 4 - col).map((i) => (
              <div key={i} className="surface-card" style={{ padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: 8 }}>
                <div className="skeleton" style={{ height: 14, width: "85%", borderRadius: "var(--radius-sm)" }} />
                <div className="skeleton" style={{ height: 12, width: "55%", borderRadius: "var(--radius-sm)" }} />
                <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                  <div className="skeleton" style={{ height: 20, width: 56, borderRadius: "var(--radius-pill)" }} />
                  <div className="skeleton" style={{ height: 20, width: 56, borderRadius: "var(--radius-pill)" }} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
