import Link from "next/link";

import { formatDate, formatGHS } from "@/lib/utils";
import type { MatterListItem } from "@/types/matter";

import { StatusBadge } from "./StatusBadge";

export interface MatterTableProps {
  items: MatterListItem[];
}

export function MatterTable({ items }: MatterTableProps) {
  if (items.length === 0) {
    return (
      <div className="surface-card matter-list-table-shell">
        <div className="empty-state matter-list-empty">
          No matters match your current filters.
        </div>
      </div>
    );
  }

  return (
    <div className="surface-card matter-list-table-shell">
      <div className="matter-list-table-head">
        <span>Ref</span>
        <span>Matter</span>
        <span>Client</span>
        <span>Lead</span>
        <span>Status</span>
        <span>Next Deadline</span>
        <span>Unpaid</span>
        <span aria-hidden="true" />
      </div>

      <div className="matter-list-table-body">
        {items.map((item) => (
          <Link className="matter-list-table-row" href={`/matters/${item.id}`} key={item.id}>
            <span className="table-ref">{item.reference}</span>
            <div className="matter-list-primary">
              <p className="row-title">{item.title}</p>
              <p className="row-meta">{item.matterType}</p>
            </div>
            <span className="table-copy">{item.clientName}</span>
            <span className="table-copy">{item.leadLawyerName}</span>
            <StatusBadge status={item.status} />
            <span className="table-copy">
              {item.nextDeadlineAt ? formatDate(item.nextDeadlineAt) : "--"}
            </span>
            <span className="table-copy">{formatGHS(item.unpaidBalanceGhs)}</span>
            <span className="matter-row-affordance" aria-hidden="true">
              {">"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
