"""Pydantic schemas for the starter read-only case endpoints."""

from pydantic import BaseModel


class CaseTimelineItem(BaseModel):
    id: str
    title: str
    detail: str
    at: str


class CaseWorkItem(BaseModel):
    id: str
    title: str
    owner: str
    dueLabel: str


class CaseListItem(BaseModel):
    id: str
    reference: str
    title: str
    clientName: str
    caseType: str
    practiceArea: str
    status: str
    leadLawyerName: str
    nextDeadlineAt: str | None
    unpaidBalanceGhs: float
    assignedToMe: bool


class CaseDetail(CaseListItem):
    court: str | None
    suitNumber: str | None
    opposingParty: str | None
    opposingCounsel: str | None
    leadLawyerName: str | None
    openedAt: str
    recentActivitySummary: str
    recentActivityCount: int
    summary: str
    focusNote: str
    recentTimeline: list[CaseTimelineItem]
    outstandingWork: list[CaseWorkItem]
