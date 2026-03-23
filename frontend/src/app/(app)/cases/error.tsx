"use client";

export default function CasesError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
      <div className="surface-card" style={{ padding: "var(--space-7)", maxWidth: 420, textAlign: "center", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <p className="eyebrow-label">Cases</p>
        <h2 className="section-title" style={{ fontSize: "var(--text-lg)" }}>
          Could not load cases
        </h2>
        <p className="starter-copy" style={{ color: "var(--color-ink-mid)" }}>
          {error.message || "Failed to retrieve case data. Check your connection and try again."}
        </p>
        <button className="btn btn-primary" onClick={reset} type="button">
          Try again
        </button>
      </div>
    </div>
  );
}
