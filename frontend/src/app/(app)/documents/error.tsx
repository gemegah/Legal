"use client";

export default function DocumentsError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
      <div className="surface-card" style={{ padding: "var(--space-7)", maxWidth: 420, textAlign: "center", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <p className="eyebrow-label">Documents</p>
        <h2 className="section-title" style={{ fontSize: "var(--text-lg)" }}>
          Could not load documents
        </h2>
        <p className="starter-copy" style={{ color: "var(--color-ink-mid)" }}>
          {error.message || "Failed to retrieve documents. Check your connection and try again."}
        </p>
        <button className="btn btn-primary" onClick={reset} type="button">
          Try again
        </button>
      </div>
    </div>
  );
}
