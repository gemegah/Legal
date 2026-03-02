export default function Page() {
  return (
    <section className="matter-tab-panel">
      <div className="surface-card matter-tab-card">
        <h2 className="section-title">Matter Calendar</h2>
        <p className="matter-tab-copy">
          Matter-linked events, hearing dates, and reminder timing will be coordinated here.
        </p>
        <div className="empty-state matter-tab-empty">
          Hearing schedules, filing deadlines, and AI-extracted reminders will appear here next.
        </div>
      </div>
    </section>
  );
}
