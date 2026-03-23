export default function MessagesLoading() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "var(--space-4)", height: "calc(100vh - 120px)" }}>
      {/* Thread list panel */}
      <div className="surface-card" style={{ padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: 10, overflow: "hidden" }}>
        <div className="skeleton" style={{ height: 36, borderRadius: "var(--radius-md)" }} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--color-border)" }}>
            <div className="skeleton" style={{ height: 36, width: 36, borderRadius: "50%", flexShrink: 0 }} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
              <div className="skeleton" style={{ height: 13, width: "70%", borderRadius: "var(--radius-sm)" }} />
              <div className="skeleton" style={{ height: 11, width: "90%", borderRadius: "var(--radius-sm)" }} />
            </div>
          </div>
        ))}
      </div>

      {/* Message area */}
      <div className="surface-card" style={{ padding: "var(--space-5)", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Header */}
        <div style={{ display: "flex", gap: 12, alignItems: "center", paddingBottom: 16, borderBottom: "1px solid var(--color-border)" }}>
          <div className="skeleton" style={{ height: 40, width: 40, borderRadius: "50%" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div className="skeleton" style={{ height: 16, width: 140, borderRadius: "var(--radius-sm)" }} />
            <div className="skeleton" style={{ height: 12, width: 80, borderRadius: "var(--radius-sm)" }} />
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ display: "flex", gap: 10, justifyContent: i % 2 === 0 ? "flex-start" : "flex-end" }}>
              {i % 2 === 0 && <div className="skeleton" style={{ height: 32, width: 32, borderRadius: "50%", flexShrink: 0 }} />}
              <div className="skeleton" style={{ height: 48, width: `${40 + (i * 10)}%`, borderRadius: "var(--radius-lg)" }} />
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="skeleton" style={{ height: 48, borderRadius: "var(--radius-md)" }} />
      </div>
    </div>
  );
}
