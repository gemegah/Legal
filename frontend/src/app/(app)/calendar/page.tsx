export default function Page() {
  return (
    <section className="placeholder-screen">
      <div className="surface-card placeholder-hero">
        <h2 className="section-title">Shared Calendar</h2>
        <p className="placeholder-copy">
          Hearings, filing deadlines, meetings, and reminders will land here.
        </p>
      </div>
      <div className="placeholder-grid">
        <div className="surface-card placeholder-card">
          <h3 className="section-title">Upcoming Events</h3>
          <p className="placeholder-copy">
            This view will prioritize urgent deadlines and AI-reviewed date entries.
          </p>
        </div>
        <div className="surface-card placeholder-card">
          <h3 className="section-title">Reminder Rules</h3>
          <p className="placeholder-copy">
            Automatic reminder scheduling will be surfaced alongside each event.
          </p>
        </div>
      </div>
    </section>
  );
}
