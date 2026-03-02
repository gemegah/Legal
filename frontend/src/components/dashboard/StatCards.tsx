export interface DashboardStat {
  label: string;
  value: string;
  subtext: string;
  tone: "default" | "danger" | "warning" | "success";
}

const toneClassMap: Record<DashboardStat["tone"], string> = {
  default: "stat-value-default",
  danger: "stat-value-danger",
  warning: "stat-value-warning",
  success: "stat-value-success",
};

interface StatCardsProps {
  items: DashboardStat[];
}

export function StatCards({ items }: StatCardsProps) {
  return (
    <section className="stat-grid" aria-label="Dashboard summary">
      {items.map((item) => (
        <article className="surface-card stat-card" key={item.label}>
          <p className="eyebrow-label">{item.label}</p>
          <p className={`stat-value ${toneClassMap[item.tone]}`}>{item.value}</p>
          <p className="muted-copy">{item.subtext}</p>
        </article>
      ))}
    </section>
  );
}
