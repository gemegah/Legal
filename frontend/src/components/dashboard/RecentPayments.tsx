export interface RecentPaymentItem {
  client: string;
  amount: string;
  method: string;
  date: string;
  status: "confirmed" | "pending";
}

interface RecentPaymentsProps {
  items: RecentPaymentItem[];
}

export function RecentPayments({ items }: RecentPaymentsProps) {
  return (
    <section className="surface-card panel-card">
      <div className="panel-header">
        <h2 className="section-title">Recent Payments</h2>
        <span className="panel-link">AR report</span>
      </div>

      <div className="payments-list">
        {items.map((item) => (
          <div className="payment-row" key={`${item.client}-${item.date}`}>
            <div>
              <p className="row-title">{item.client}</p>
              <p className="row-meta">
                {item.method} - {item.date}
              </p>
            </div>
            <div className="payment-value">
              <p className="payment-amount">{item.amount}</p>
              <p
                className={`payment-status${
                  item.status === "confirmed" ? " is-confirmed" : ""
                }`}
              >
                {item.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
