export interface DeadlineItem {
  time: string;
  label: string;
  type: "hearing" | "filing" | "meeting" | "billing";
  matter: string;
  urgent?: boolean;
}

const typeLabels: Record<DeadlineItem["type"], string> = {
  hearing: "Hearing",
  filing: "Filing",
  meeting: "Meeting",
  billing: "Billing",
};

interface TodayDeadlinesProps {
  items: DeadlineItem[];
}

export function TodayDeadlines({ items }: TodayDeadlinesProps) {
  return (
    <section className="surface-card panel-card">
      <div className="panel-header">
        <h2 className="section-title">Today's Deadlines</h2>
        <span className="panel-link">View calendar</span>
      </div>

      <div className="stack-list">
        {items.map((item) => (
          <div
            key={`${item.time}-${item.label}`}
            className={`deadline-row${item.urgent ? " is-urgent" : ""}`}
          >
            <div className="deadline-time">{item.time}</div>
            <div className="deadline-body">
              <p className="row-title">{item.label}</p>
              <p className="row-meta">{typeLabels[item.type]}</p>
            </div>
            <span className="matter-chip">{item.matter}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
