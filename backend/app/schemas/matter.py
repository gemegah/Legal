"""Pydantic schemas for the starter read-only matter endpoints."""

from pydantic import BaseModel


class MatterTimelineItem(BaseModel):
    id: str
    title: str
    detail: str
    at: str


class MatterWorkItem(BaseModel):
    id: str
    title: str
    owner: str
    dueLabel: str


class MatterListItem(BaseModel):
    id: str
    reference: str
    title: str
    clientName: str
    matterType: str
    practiceArea: str
    status: str
    leadLawyerName: str
    nextDeadlineAt: str | None
    unpaidBalanceGhs: float
    assignedToMe: bool


class MatterDetail(MatterListItem):
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
    recentTimeline: list[MatterTimelineItem]
    outstandingWork: list[MatterWorkItem]
