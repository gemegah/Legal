"use client";

import { useState } from "react";

export interface AISuggestionPreview {
  id: number;
  category: "deadline" | "invoice" | "summary";
  label: string;
  suggestion: string;
}

interface AISuggestionsWidgetProps {
  items: AISuggestionPreview[];
}

const categoryLabels: Record<AISuggestionPreview["category"], string> = {
  deadline: "Deadline Suggestion",
  invoice: "Invoice Draft",
  summary: "Case Summary",
};

export function AISuggestionsWidget({ items }: AISuggestionsWidgetProps) {
  const [dismissed, setDismissed] = useState<number[]>([]);
  const visibleItems = items.filter((item) => !dismissed.includes(item.id));

  return (
    <section className="surface-card panel-card ai-panel">
      <div className="panel-header">
        <div className="panel-title-with-badge">
          <span className="spark-badge" aria-hidden="true">
            <SparkIcon />
          </span>
          <h2 className="section-title">AI Suggestions</h2>
          {visibleItems.length > 0 ? (
            <span className="count-badge">{visibleItems.length}</span>
          ) : null}
        </div>
      </div>

      {visibleItems.length === 0 ? (
        <div className="empty-state">All suggestions reviewed.</div>
      ) : (
        <div className="stack-list">
          {visibleItems.map((item) => (
            <article className="ai-suggestion-card" key={item.id}>
              <p className="ai-meta">
                {categoryLabels[item.category]} - {item.label}
              </p>
              <p className="ai-text">{item.suggestion}</p>
              <div className="button-row">
                <button className="btn btn-accent" type="button">
                  Accept
                </button>
                <button
                  className="btn btn-subtle"
                  type="button"
                  onClick={() =>
                    setDismissed((current) => [...current, item.id])
                  }
                >
                  Dismiss
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
