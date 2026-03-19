export default function SettingsLoading() {
  return (
    <div className="settings-screen settings-screen-optimized settings-overview">
      <div className="settings-overview-grid">
        {[0, 1, 2].map((i) => (
          <div key={i} className="surface-card settings-overview-card" style={{ gap: "var(--space-4)" }}>
            <div className="settings-overview-card-top">
              <div className="skeleton" style={{ height: 32, width: 48, borderRadius: "var(--radius-pill)" }} />
              <div className="skeleton" style={{ height: 32, width: 84, borderRadius: "var(--radius-pill)" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div className="skeleton" style={{ height: 12, width: 64, borderRadius: "var(--radius-sm)" }} />
              <div className="skeleton" style={{ height: 20, width: "90%", borderRadius: "var(--radius-sm)" }} />
              <div className="skeleton" style={{ height: 14, width: "100%", borderRadius: "var(--radius-sm)" }} />
              <div className="skeleton" style={{ height: 14, width: "75%", borderRadius: "var(--radius-sm)" }} />
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              {[0, 1, 2].map((j) => (
                <div
                  key={j}
                  className="skeleton"
                  style={{ height: 60, borderRadius: "var(--radius-md)" }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="settings-overview-detail-grid">
        <div className="surface-card settings-panel" style={{ gap: "var(--space-4)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div className="skeleton" style={{ height: 12, width: 80, borderRadius: "var(--radius-sm)" }} />
            <div className="skeleton" style={{ height: 22, width: 180, borderRadius: "var(--radius-sm)" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[0, 1, 2].map((k) => (
              <div key={k} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div className="skeleton" style={{ height: 14, width: 120, borderRadius: "var(--radius-sm)" }} />
                <div className="skeleton" style={{ height: 14, width: "85%", borderRadius: "var(--radius-sm)" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
