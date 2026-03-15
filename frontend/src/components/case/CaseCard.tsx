import Link from "next/link";

import type { CaseListItem } from "@/features/cases/types";
import { formatDate, formatGHS } from "@/lib/utils";

import { StatusBadge } from "./StatusBadge";

export interface CaseCardProps {
  item: CaseListItem;
}

export function CaseCard({ item }: CaseCardProps) {
  return (
    <Link className="surface-card case-list-card" href={`/cases/${item.id}`}>
      <div className="case-list-card-header">
        <div>
          <p className="table-ref">{item.reference}</p>
          <h3 className="section-title">{item.title}</h3>
        </div>
        <StatusBadge status={item.status} />
      </div>

      <div className="case-list-card-grid">
        <CardMeta label="Client" value={item.clientName} />
        <CardMeta label="Lead" value={item.leadLawyerName} />
        <CardMeta
          label="Next Deadline"
          value={item.nextDeadlineAt ? formatDate(item.nextDeadlineAt) : "--"}
        />
        <CardMeta label="Unpaid" value={formatGHS(item.unpaidBalanceGhs)} />
      </div>

      <div className="case-list-card-footer">
        <span className="case-detail-chip">{item.practiceArea}</span>
        <span className="case-row-affordance">Open case</span>
      </div>
    </Link>
  );
}

function CardMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="case-list-card-meta">
      <p>{label}</p>
      <span>{value}</span>
    </div>
  );
}
