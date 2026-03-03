import { getMatterById } from "@/features/matters/server/queries";
import { formatDate, formatDateTime, formatGHS } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const matter = await getMatterById(params.id);

  if (!matter) {
    return (
      <section className="matter-tab-panel">
        <div className="surface-card matter-tab-card">
          <h2 className="section-title">Matter Summary</h2>
          <div className="empty-state matter-tab-empty">
            Matter context could not be loaded for this overview.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="matter-overview">
      <div className="matter-overview-grid">
        <div className="surface-card matter-overview-card matter-summary-card">
          <div className="panel-header">
            <h2 className="section-title">Matter Summary</h2>
            <span className="matter-inline-note">Live brief</span>
          </div>
          <p className="matter-summary-copy">{matter.summary}</p>
          <p className="matter-summary-copy">{matter.focusNote}</p>
        </div>

        <div className="surface-card matter-overview-card">
          <div className="panel-header">
            <h2 className="section-title">Key Facts</h2>
            <span className="matter-inline-note">Matter context</span>
          </div>
          <dl className="matter-facts-list">
            <div className="matter-fact-row">
              <dt>Client</dt>
              <dd>{matter.clientName}</dd>
            </div>
            <div className="matter-fact-row">
              <dt>Lead Lawyer</dt>
              <dd>{matter.leadLawyerName ?? "--"}</dd>
            </div>
            <div className="matter-fact-row">
              <dt>Practice Area</dt>
              <dd>{matter.practiceArea}</dd>
            </div>
            <div className="matter-fact-row">
              <dt>Opened</dt>
              <dd>{formatDate(matter.openedAt)}</dd>
            </div>
            <div className="matter-fact-row">
              <dt>Outstanding Balance</dt>
              <dd>{formatGHS(matter.unpaidBalanceGhs)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="matter-overview-grid">
        <div className="surface-card matter-overview-card">
          <div className="panel-header">
            <h2 className="section-title">Recent Activity</h2>
            <span className="matter-inline-note">{matter.recentActivityCount} updates</span>
          </div>
          <div className="matter-timeline">
            {matter.recentTimeline.map((item) => (
              <div className="matter-timeline-item" key={item.id}>
                <div className="matter-timeline-marker" aria-hidden="true" />
                <div className="matter-timeline-body">
                  <p className="row-title">{item.title}</p>
                  <p className="row-meta">{item.detail}</p>
                </div>
                <p className="matter-timeline-date">{formatDateTime(item.at)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-card matter-overview-card">
          <div className="panel-header">
            <h2 className="section-title">Outstanding Work</h2>
            <span className="matter-inline-note">Next actions</span>
          </div>
          <div className="matter-work-list">
            {matter.outstandingWork.map((item) => (
              <div className="matter-work-item" key={item.id}>
                <div>
                  <p className="row-title">{item.title}</p>
                  <p className="row-meta">{item.owner}</p>
                </div>
                <span className="matter-work-due">{item.dueLabel}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
