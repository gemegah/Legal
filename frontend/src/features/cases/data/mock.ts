import type {
  CaseDetail,
  CaseListItem,
  CaseTimelineItem,
  CaseWorkItem,
} from "@/features/cases/types";

const mockCases: CaseListItem[] = [
  {
    id: "case-2026-014",
    reference: "CAS-2026-014",
    title: "Asante v. Mensah Industries Ltd",
    clientName: "Asante Holdings Ltd",
    caseType: "Commercial Litigation",
    practiceArea: "Dispute Resolution",
    status: "active",
    leadLawyerName: "Kwame Boateng",
    nextDeadlineAt: "2026-03-06T09:00:00Z",
    unpaidBalanceGhs: 18450,
    assignedToMe: true,
  },
  {
    id: "case-2026-011",
    reference: "CAS-2026-011",
    title: "Darko Family Estate Administration",
    clientName: "Esi Darko",
    caseType: "Probate",
    practiceArea: "Estates",
    status: "active",
    leadLawyerName: "Ama Osei",
    nextDeadlineAt: "2026-03-09T10:30:00Z",
    unpaidBalanceGhs: 4200,
    assignedToMe: false,
  },
  {
    id: "case-2026-009",
    reference: "CAS-2026-009",
    title: "Volta Ridge Land Transfer",
    clientName: "Volta Ridge Developers",
    caseType: "Conveyancing",
    practiceArea: "Property",
    status: "active",
    leadLawyerName: "Kweku Biney",
    nextDeadlineAt: "2026-03-05T14:00:00Z",
    unpaidBalanceGhs: 0,
    assignedToMe: false,
  },
  {
    id: "case-2026-007",
    reference: "CAS-2026-007",
    title: "Ayitey Employment Dispute",
    clientName: "Ayitey Logistics",
    caseType: "Employment",
    practiceArea: "Labour",
    status: "pending",
    leadLawyerName: "Naa Korkor Abbey",
    nextDeadlineAt: "2026-03-04T08:00:00Z",
    unpaidBalanceGhs: 7600,
    assignedToMe: false,
  },
  {
    id: "case-2026-006",
    reference: "CAS-2026-006",
    title: "CediCore Vendor Debt Recovery",
    clientName: "CediCore Systems",
    caseType: "Debt Recovery",
    practiceArea: "Commercial",
    status: "active",
    leadLawyerName: "Kwame Boateng",
    nextDeadlineAt: "2026-03-07T11:00:00Z",
    unpaidBalanceGhs: 12500,
    assignedToMe: true,
  },
  {
    id: "case-2026-004",
    reference: "CAS-2026-004",
    title: "Tarkwa Mining Supply Contract Review",
    clientName: "Tarkwa Mining Services",
    caseType: "Contract Advisory",
    practiceArea: "Commercial",
    status: "pending",
    leadLawyerName: "Efua Nkrumah",
    nextDeadlineAt: null,
    unpaidBalanceGhs: 3150,
    assignedToMe: false,
  },
  {
    id: "case-2025-122",
    reference: "CAS-2025-122",
    title: "Kumasi Retail Lease Portfolio",
    clientName: "Ahenfie Retail Group",
    caseType: "Lease Review",
    practiceArea: "Property",
    status: "closed",
    leadLawyerName: "Kweku Biney",
    nextDeadlineAt: null,
    unpaidBalanceGhs: 0,
    assignedToMe: false,
  },
  {
    id: "case-2025-117",
    reference: "CAS-2025-117",
    title: "Blue Coast Share Subscription",
    clientName: "Blue Coast Ventures",
    caseType: "Corporate Advisory",
    practiceArea: "Corporate",
    status: "archived",
    leadLawyerName: "Ama Osei",
    nextDeadlineAt: null,
    unpaidBalanceGhs: 0,
    assignedToMe: false,
  },
  {
    id: "case-2026-003",
    reference: "CAS-2026-003",
    title: "Tema Port Customs Appeal",
    clientName: "Harbourline Imports",
    caseType: "Regulatory Appeal",
    practiceArea: "Regulatory",
    status: "active",
    leadLawyerName: "Naa Korkor Abbey",
    nextDeadlineAt: "2026-03-08T13:00:00Z",
    unpaidBalanceGhs: 9900,
    assignedToMe: false,
  },
  {
    id: "case-2026-001",
    reference: "CAS-2026-001",
    title: "Adum Market Tenancy Advisory",
    clientName: "Adum Market Traders Union",
    caseType: "Advisory",
    practiceArea: "Property",
    status: "pending",
    leadLawyerName: "Efua Nkrumah",
    nextDeadlineAt: "2026-03-12T09:30:00Z",
    unpaidBalanceGhs: 2650,
    assignedToMe: false,
  },
];

const caseNarratives: Partial<
  Record<
    string,
    Pick<
      CaseDetail,
      | "court"
      | "suitNumber"
      | "opposingParty"
      | "opposingCounsel"
      | "summary"
      | "focusNote"
      | "recentActivitySummary"
    >
  >
> = {
  "case-2026-014": {
    court: "Commercial Division, High Court - Accra",
    suitNumber: "HRCM/142/26",
    opposingParty: "Mensah Industries Ltd",
    opposingCounsel: "Adu-Boahen Chambers",
    summary:
      "This case remains active before the Commercial Division of the High Court in Accra. Pleadings are settled, the claimant's affidavit bundle has been reviewed internally, and the team is now focused on filing preparation ahead of the next court date.",
    focusNote:
      "The immediate priority is to file the revised affidavit bundle, confirm service timing, and keep the client briefed on the hearing sequence expected this week.",
    recentActivitySummary: "Affidavit review completed and hearing bundle is awaiting filing.",
  },
};

export function listMockCases(): CaseListItem[] {
  return mockCases.map((item) => ({ ...item }));
}

export function getMockCaseById(id: string): CaseDetail | null {
  const caseItem = mockCases.find((item) => item.id === id);

  if (!caseItem) {
    return null;
  }

  const narrative = caseNarratives[id];
  const recentTimeline = buildRecentTimeline(caseItem);
  const outstandingWork = buildOutstandingWork(caseItem);

  return {
    id: caseItem.id,
    reference: caseItem.reference,
    title: caseItem.title,
    clientName: caseItem.clientName,
    caseType: caseItem.caseType,
    practiceArea: caseItem.practiceArea,
    status: caseItem.status,
    court: narrative?.court ?? `${caseItem.practiceArea} Division, High Court - Accra`,
    suitNumber: narrative?.suitNumber ?? `HRCM/${caseItem.id.slice(-3)}/26`,
    opposingParty: narrative?.opposingParty ?? `Respondent in ${caseItem.practiceArea.toLowerCase()} dispute`,
    opposingCounsel: narrative?.opposingCounsel ?? "External counsel on record",
    leadLawyerName: caseItem.leadLawyerName,
    nextDeadlineAt: caseItem.nextDeadlineAt,
    openedAt: "2026-01-14T10:30:00Z",
    unpaidBalanceGhs: caseItem.unpaidBalanceGhs,
    recentActivitySummary:
      narrative?.recentActivitySummary ??
      `${caseItem.practiceArea} workstream is active and awaiting the next filing sequence.`,
    recentActivityCount: recentTimeline.length + outstandingWork.length,
    summary:
      narrative?.summary ??
      `${caseItem.title} is being tracked in the case workspace with active coordination across ${caseItem.practiceArea.toLowerCase()} tasks and client reporting.`,
    focusNote:
      narrative?.focusNote ??
      `Prioritize the next action for ${caseItem.clientName} and keep ${caseItem.leadLawyerName} aligned on deadlines and deliverables.`,
    recentTimeline,
    outstandingWork,
  };
}

function buildRecentTimeline(caseItem: CaseListItem): CaseTimelineItem[] {
  return [
    {
      id: `${caseItem.id}-activity-1`,
      title: "Case note updated",
      detail: `${caseItem.leadLawyerName} reviewed the latest ${caseItem.practiceArea.toLowerCase()} work and shared next steps.`,
      at: "2026-03-01T16:20:00Z",
    },
    {
      id: `${caseItem.id}-activity-2`,
      title: "Client update prepared",
      detail: `A status update for ${caseItem.clientName} is ready for review and release.`,
      at: "2026-02-28T11:10:00Z",
    },
    {
      id: `${caseItem.id}-activity-3`,
      title: "Billing review completed",
      detail: `Time entries tied to ${caseItem.caseType.toLowerCase()} work were checked for invoice readiness.`,
      at: "2026-02-27T14:45:00Z",
    },
  ];
}

function buildOutstandingWork(caseItem: CaseListItem): CaseWorkItem[] {
  const lead = caseItem.leadLawyerName;

  return [
    {
      id: `${caseItem.id}-work-1`,
      title: `Finalize next ${caseItem.caseType.toLowerCase()} action`,
      owner: lead,
      dueLabel: caseItem.nextDeadlineAt ? `Due ${formatShortDate(caseItem.nextDeadlineAt)}` : "No due date set",
    },
    {
      id: `${caseItem.id}-work-2`,
      title: "Confirm client update and supporting documents",
      owner: "Operations Desk",
      dueLabel: "Due 5 Mar 2026",
    },
    {
      id: `${caseItem.id}-work-3`,
      title: "Prepare partner review note",
      owner: lead,
      dueLabel: "Due 7 Mar 2026",
    },
  ];
}

function formatShortDate(value: string): string {
  const date = new Date(value);
  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return formatter.format(date);
}
