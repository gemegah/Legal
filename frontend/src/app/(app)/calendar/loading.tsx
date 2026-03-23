export default function CalendarLoading() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
      {/* Toolbar */}
      <div className="surface-card" style={{ padding: "var(--space-5)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div className="skeleton" style={{ height: 22, width: 160, borderRadius: "var(--radius-sm)" }} />
          <div style={{ display: "flex", gap: 8 }}>
            <div className="skeleton" style={{ height: 32, width: 72, borderRadius: "var(--radius-pill)" }} />
            <div className="skeleton" style={{ height: 32, width: 32, borderRadius: "var(--radius-md)" }} />
          </div>
        </div>

        {/* Week grid */}
        <div style={{ display: "grid", gridTemplateColumns: "56px repeat(7, 1fr)", gap: 2 }}>
          {/* Day header row */}
          <div />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "8px 0" }}>
              <div className="skeleton" style={{ height: 12, width: 24, borderRadius: "var(--radius-sm)" }} />
              <div className="skeleton" style={{ height: 28, width: 28, borderRadius: "50%" }} />
            </div>
          ))}

          {/* Time rail + day columns */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((row) => (
            <>
              <div key={`time-${row}`} className="skeleton" style={{ height: 48, borderRadius: "var(--radius-sm)", margin: "2px 4px" }} />
              {[0, 1, 2, 3, 4, 5, 6].map((col) => (
                <div key={`cell-${row}-${col}`} className="skeleton" style={{ height: 48, borderRadius: "var(--radius-sm)", margin: 2, opacity: 0.4 }} />
              ))}
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
