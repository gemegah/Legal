import Link from "next/link";

import type { CaseListItem } from "@/features/cases/types";
import { formatDate, formatGHS } from "@/lib/utils";

import { StatusBadge } from "./StatusBadge";

export interface CaseTableProps {
  items: CaseListItem[];
}

export function CaseTable({ items }: CaseTableProps) {
  if (items.length === 0) {
    return (
      <div className="surface-card case-list-table-shell">
        <div className="empty-state case-list-empty">
          No cases match your current filters.
        </div>
      </div>
    );
  }

  return (
    <div className="surface-card case-list-table-shell">
      <div className="case-list-table-head">
        <span>Ref</span>
        <span>Case</span>
        <span>Client</span>
        <span>Lead</span>
        <span>Status</span>
        <span>Next Deadline</span>
        <span>Unpaid</span>
        <span aria-hidden="true" />
      </div>

      <div className="case-list-table-body">
        {items.map((item) => (
          <Link className="case-list-table-row" href={`/cases/${item.id}`} key={item.id}>
            <span className="table-ref">{item.reference}</span>
            <div className="case-list-primary">
              <p className="row-title">{item.title}</p>
              <p className="row-meta">{item.caseType}</p>
            </div>
            <span className="table-copy">{item.clientName}</span>
            <span className="table-copy">{item.leadLawyerName}</span>
            <StatusBadge status={item.status} />
            <span className="table-copy">
              {item.nextDeadlineAt ? formatDate(item.nextDeadlineAt) : "--"}
            </span>
            <span className="table-copy">{formatGHS(item.unpaidBalanceGhs)}</span>
            <span className="case-row-affordance" aria-hidden="true">
              {">"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
