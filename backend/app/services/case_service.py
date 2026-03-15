"""Starter read-only case service.

This keeps one backend vertical slice real while the database-backed services are
still being built.
"""

from app.schemas.case import CaseDetail, CaseListItem, CaseTimelineItem, CaseWorkItem

_MATTERS: list[CaseDetail] = [
    CaseDetail(
        id="case-0041",
        reference="CAS-0041",
        title="Asante v. Mensah Industries Ltd",
        clientName="Akosua Asante",
        caseType="Commercial Litigation",
        practiceArea="Litigation",
        status="active",
        leadLawyerName="K. Boateng",
        nextDeadlineAt="2026-03-15T09:00:00Z",
        unpaidBalanceGhs=4200,
        assignedToMe=True,
        court="High Court, Accra",
        suitNumber="HC/458/25",
        opposingParty="Mensah Industries Ltd",
        opposingCounsel="Adjei Mensimah",
        openedAt="2025-11-04T08:30:00Z",
        recentActivitySummary="Draft affidavit reviewed and filing prep is underway.",
        recentActivityCount=6,
        summary="Case is active with a hearing and follow-up filing both due in March.",
        focusNote="Confirm supporting exhibits before filing.",
        recentTimeline=[
            CaseTimelineItem(
                id="timeline-1",
                title="Draft affidavit reviewed",
                detail="The litigation team completed first-pass review.",
                at="2026-03-01T13:30:00Z",
            ),
            CaseTimelineItem(
                id="timeline-2",
                title="Client update prepared",
                detail="A client-facing update draft is ready for approval.",
                at="2026-02-28T16:00:00Z",
            ),
        ],
        outstandingWork=[
            CaseWorkItem(
                id="work-1",
                title="Finalize filing bundle",
                owner="K. Boateng",
                dueLabel="15 Mar",
            ),
            CaseWorkItem(
                id="work-2",
                title="Confirm witness statement",
                owner="E. Nkrumah",
                dueLabel="12 Mar",
            ),
        ],
    ),
    CaseDetail(
        id="case-0039",
        reference="CAS-0039",
        title="Re: Accra Properties Ltd Acquisition",
        clientName="Accra Properties Ltd",
        caseType="Conveyancing",
        practiceArea="Real Estate",
        status="active",
        leadLawyerName="A. Owusu",
        nextDeadlineAt="2026-03-04T14:30:00Z",
        unpaidBalanceGhs=0,
        assignedToMe=False,
        court=None,
        suitNumber=None,
        opposingParty=None,
        opposingCounsel=None,
        openedAt="2025-10-19T09:00:00Z",
        recentActivitySummary="Title search review is complete and closing steps are aligned.",
        recentActivityCount=4,
        summary="Conveyancing case is in final closing coordination with no outstanding balance.",
        focusNote="Await signature pack from the client.",
        recentTimeline=[
            CaseTimelineItem(
                id="timeline-3",
                title="Title search completed",
                detail="No blocking title defects found.",
                at="2026-02-27T11:15:00Z",
            )
        ],
        outstandingWork=[
            CaseWorkItem(
                id="work-3",
                title="Collect signed transfer documents",
                owner="A. Owusu",
                dueLabel="04 Mar",
            )
        ],
    ),
]


def list_cases() -> list[CaseListItem]:
    return [CaseListItem.model_validate(case.model_dump()) for case in _MATTERS]


def get_case(case_id: str) -> CaseDetail | None:
    return next((case for case in _MATTERS if case.id == case_id or case.reference == case_id), None)
