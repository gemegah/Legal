import Link from "next/link";

import type { MatterListItem } from "@/features/matters/types";
import { formatDate, formatGHS } from "@/lib/utils";

import { StatusBadge } from "./StatusBadge";

export interface MatterCardProps {
  item: MatterListItem;
}

export function MatterCard({ item }: MatterCardProps) {
  return (
    <Link className="surface-card matter-list-card" href={`/matters/${item.id}`}>
      <div className="matter-list-card-header">
        <div>
          <p className="table-ref">{item.reference}</p>
          <h3 className="section-title">{item.title}</h3>
        </div>
        <StatusBadge status={item.status} />
      </div>

      <div className="matter-list-card-grid">
        <CardMeta label="Client" value={item.clientName} />
        <CardMeta label="Lead" value={item.leadLawyerName} />
        <CardMeta
          label="Next Deadline"
          value={item.nextDeadlineAt ? formatDate(item.nextDeadlineAt) : "--"}
        />
        <CardMeta label="Unpaid" value={formatGHS(item.unpaidBalanceGhs)} />
      </div>

      <div className="matter-list-card-footer">
        <span className="matter-detail-chip">{item.practiceArea}</span>
        <span className="matter-row-affordance">Open matter</span>
      </div>
    </Link>
  );
}

function CardMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="matter-list-card-meta">
      <p>{label}</p>
      <span>{value}</span>
    </div>
  );
}
