import { getCaseById } from "@/features/cases/server/queries";
import { formatDate, formatDateTime, formatGHS } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const caseDetail = await getCaseById(params.id);

  if (!caseDetail) {
    return (
      <section className="case-tab-panel">
        <div className="surface-card case-tab-card">
          <h2 className="section-title">Case Summary</h2>
          <div className="empty-state case-tab-empty">
            Case context could not be loaded for this overview.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="case-overview">
      <div className="case-overview-grid">
        <div className="surface-card case-overview-card case-summary-card">
          <div className="panel-header">
            <h2 className="section-title">Case Summary</h2>
            <span className="case-inline-note">Live brief</span>
          </div>
          <p className="case-summary-copy">{caseDetail.summary}</p>
          <p className="case-summary-copy">{caseDetail.focusNote}</p>
        </div>

        <div className="surface-card case-overview-card">
          <div className="panel-header">
            <h2 className="section-title">Key Facts</h2>
            <span className="case-inline-note">Case context</span>
          </div>
          <dl className="case-facts-list">
            <div className="case-fact-row">
              <dt>Client</dt>
              <dd>{caseDetail.clientName}</dd>
            </div>
            <div className="case-fact-row">
              <dt>Lead Lawyer</dt>
              <dd>{caseDetail.leadLawyerName ?? "--"}</dd>
            </div>
            <div className="case-fact-row">
              <dt>Practice Area</dt>
              <dd>{caseDetail.practiceArea}</dd>
            </div>
            <div className="case-fact-row">
              <dt>Opened</dt>
              <dd>{formatDate(caseDetail.openedAt)}</dd>
            </div>
            <div className="case-fact-row">
              <dt>Outstanding Balance</dt>
              <dd>{formatGHS(caseDetail.unpaidBalanceGhs)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="case-overview-grid">
        <div className="surface-card case-overview-card">
          <div className="panel-header">
            <h2 className="section-title">Recent Activity</h2>
            <span className="case-inline-note">{caseDetail.recentActivityCount} updates</span>
          </div>
          <div className="case-timeline">
            {caseDetail.recentTimeline.map((item) => (
              <div className="case-timeline-item" key={item.id}>
                <div className="case-timeline-marker" aria-hidden="true" />
                <div className="case-timeline-body">
                  <p className="row-title">{item.title}</p>
                  <p className="row-meta">{item.detail}</p>
                </div>
                <p className="case-timeline-date">{formatDateTime(item.at)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-card case-overview-card">
          <div className="panel-header">
            <h2 className="section-title">Outstanding Work</h2>
            <span className="case-inline-note">Next actions</span>
          </div>
          <div className="case-work-list">
            {caseDetail.outstandingWork.map((item) => (
              <div className="case-work-item" key={item.id}>
                <div>
                  <p className="row-title">{item.title}</p>
                  <p className="row-meta">{item.owner}</p>
                </div>
                <span className="case-work-due">{item.dueLabel}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
