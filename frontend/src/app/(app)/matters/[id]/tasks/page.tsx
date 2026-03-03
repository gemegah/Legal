export default function Page() {
  return (
    <section className="matter-tab-panel">
      <div className="surface-card matter-tab-card">
        <h2 className="section-title">Matter Tasks</h2>
        <p className="matter-tab-copy">
          Assignees, due dates, and checklist progress for this matter will be managed here.
        </p>
        <div className="empty-state matter-tab-empty">
          Task lists, owner filters, and matter checklists will be added in the task management pass.
        </div>
      </div>
    </section>
  );
}
