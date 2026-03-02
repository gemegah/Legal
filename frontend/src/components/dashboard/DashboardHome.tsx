import {
  AISuggestionsWidget,
  type AISuggestionPreview,
} from "./AISuggestionsWidget";
import { RecentPayments, type RecentPaymentItem } from "./RecentPayments";
import { StatCards, type DashboardStat } from "./StatCards";
import { TodayDeadlines, type DeadlineItem } from "./TodayDeadlines";

interface DashboardMatterRow {
  id: string;
  title: string;
  type: string;
  status: "active" | "pending" | "closed";
  deadline: string;
  lawyer: string;
  unpaid: string;
}

const stats: DashboardStat[] = [
  { label: "Active Matters", value: "12", subtext: "+2 this week", tone: "default" },
  { label: "Due This Week", value: "4", subtext: "2 urgent", tone: "danger" },
  { label: "Outstanding AR", value: "GHS 28,400", subtext: "6 invoices", tone: "warning" },
  { label: "Collected (Feb)", value: "GHS 41,200", subtext: "Up 18% vs Jan", tone: "success" },
];

const deadlines: DeadlineItem[] = [
  {
    time: "09:00",
    label: "Hearing - Asante v. Mensah Industries",
    type: "hearing",
    matter: "M-0041",
    urgent: true,
  },
  {
    time: "12:00",
    label: "Filing deadline - GCB Bank affidavit",
    type: "filing",
    matter: "M-0035",
    urgent: true,
  },
  {
    time: "14:30",
    label: "Client call - Accra Properties Ltd",
    type: "meeting",
    matter: "M-0039",
  },
  {
    time: "16:00",
    label: "Invoice review - Darko brief",
    type: "billing",
    matter: "M-0037",
  },
];

const aiSuggestions: AISuggestionPreview[] = [
  {
    id: 1,
    category: "deadline",
    label: "Court order uploaded to M-0041",
    suggestion:
      "2 new deadlines extracted for review: hearing on Mar 15 and filing on Mar 22.",
  },
  {
    id: 2,
    category: "invoice",
    label: "Invoice draft ready for M-0035",
    suggestion:
      "4 time entries were grouped into a GHS 6,500 draft with a billing narrative.",
  },
];

const recentPayments: RecentPaymentItem[] = [
  {
    client: "Accra Properties Ltd",
    amount: "GHS 12,000",
    method: "MoMo MTN",
    date: "Today",
    status: "confirmed",
  },
  {
    client: "Kwame Darko",
    amount: "GHS 900",
    method: "Card",
    date: "Yesterday",
    status: "confirmed",
  },
  {
    client: "Mensah Industries",
    amount: "GHS 4,200",
    method: "MoMo MTN",
    date: "Feb 24",
    status: "pending",
  },
];

const matters: DashboardMatterRow[] = [
  {
    id: "M-0041",
    title: "Asante v. Mensah Industries Ltd",
    type: "Commercial Litigation",
    status: "active",
    deadline: "Feb 28",
    lawyer: "K. Boateng",
    unpaid: "GHS 4,200",
  },
  {
    id: "M-0039",
    title: "Re: Accra Properties Ltd Acquisition",
    type: "Conveyancing",
    status: "active",
    deadline: "Mar 04",
    lawyer: "A. Owusu",
    unpaid: "GHS 0",
  },
  {
    id: "M-0037",
    title: "Republic v. Kwame Darko",
    type: "Criminal Defence",
    status: "pending",
    deadline: "Mar 12",
    lawyer: "K. Boateng",
    unpaid: "GHS 1,800",
  },
  {
    id: "M-0035",
    title: "GCB Bank Employment Dispute",
    type: "Employment",
    status: "active",
    deadline: "Mar 19",
    lawyer: "E. Nkrumah",
    unpaid: "GHS 6,500",
  },
  {
    id: "M-0033",
    title: "Ofori Family Estate",
    type: "Probate",
    status: "closed",
    deadline: "-",
    lawyer: "A. Owusu",
    unpaid: "GHS 0",
  },
];

export function DashboardHome() {
  return (
    <div className="dashboard-shell">
      <StatCards items={stats} />

      <section className="dashboard-grid">
        <TodayDeadlines items={deadlines} />

        <div className="dashboard-right-column">
          <AISuggestionsWidget items={aiSuggestions} />
          <RecentPayments items={recentPayments} />
        </div>
      </section>

      <ActiveMattersTable items={matters} />
    </div>
  );
}

function ActiveMattersTable({ items }: { items: DashboardMatterRow[] }) {
  return (
    <section className="surface-card table-card">
      <div className="panel-header table-card-header">
        <h2 className="section-title">Active Matters</h2>
        <div className="inline-actions">
          <button className="btn btn-ghost" type="button">
            All Types
          </button>
          <button className="btn btn-primary" type="button">
            + New Matter
          </button>
        </div>
      </div>

      <div className="data-table">
        <div className="table-row table-head">
          <span>Ref</span>
          <span>Matter</span>
          <span>Type</span>
          <span>Status</span>
          <span>Deadline</span>
          <span>Unpaid</span>
          <span aria-hidden="true" />
        </div>

        {items.map((item) => {
          const isUrgent = item.deadline === "Feb 28" || item.deadline === "Mar 04";

          return (
            <div className="table-row table-body" key={item.id}>
              <span className="table-ref">{item.id}</span>
              <div>
                <p className="row-title">{item.title}</p>
                <p className="row-meta">{item.lawyer}</p>
              </div>
              <span className="table-copy">{item.type}</span>
              <span className={`status-pill status-${item.status}`}>{item.status}</span>
              <span className={`table-copy${isUrgent ? " is-urgent" : ""}`}>
                {item.deadline}
              </span>
              <span className="table-copy">{item.unpaid}</span>
              <span className="table-chevron">{">"}</span>
            </div>
          );
        })}
      </div>

      <div className="table-footer">
        <span className="panel-link">View all 12 matters</span>
      </div>
    </section>
  );
}
