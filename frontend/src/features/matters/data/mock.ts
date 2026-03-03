import type {
  MatterDetail,
  MatterListItem,
  MatterTimelineItem,
  MatterWorkItem,
} from "@/features/matters/types";

const mockMatters: MatterListItem[] = [
  {
    id: "mat-2026-014",
    reference: "MAT-2026-014",
    title: "Asante v. Mensah Industries Ltd",
    clientName: "Asante Holdings Ltd",
    matterType: "Commercial Litigation",
    practiceArea: "Dispute Resolution",
    status: "active",
    leadLawyerName: "Kwame Boateng",
    nextDeadlineAt: "2026-03-06T09:00:00Z",
    unpaidBalanceGhs: 18450,
    assignedToMe: true,
  },
  {
    id: "mat-2026-011",
    reference: "MAT-2026-011",
    title: "Darko Family Estate Administration",
    clientName: "Esi Darko",
    matterType: "Probate",
    practiceArea: "Estates",
    status: "active",
    leadLawyerName: "Ama Osei",
    nextDeadlineAt: "2026-03-09T10:30:00Z",
    unpaidBalanceGhs: 4200,
    assignedToMe: false,
  },
  {
    id: "mat-2026-009",
    reference: "MAT-2026-009",
    title: "Volta Ridge Land Transfer",
    clientName: "Volta Ridge Developers",
    matterType: "Conveyancing",
    practiceArea: "Property",
    status: "active",
    leadLawyerName: "Kweku Biney",
    nextDeadlineAt: "2026-03-05T14:00:00Z",
    unpaidBalanceGhs: 0,
    assignedToMe: true,
  },
  {
    id: "mat-2026-007",
    reference: "MAT-2026-007",
    title: "Ayitey Employment Dispute",
    clientName: "Ayitey Logistics",
    matterType: "Employment",
    practiceArea: "Labour",
    status: "pending",
    leadLawyerName: "Naa Korkor Abbey",
    nextDeadlineAt: "2026-03-04T08:00:00Z",
    unpaidBalanceGhs: 7600,
    assignedToMe: false,
  },
  {
    id: "mat-2026-006",
    reference: "MAT-2026-006",
    title: "CediCore Vendor Debt Recovery",
    clientName: "CediCore Systems",
    matterType: "Debt Recovery",
    practiceArea: "Commercial",
    status: "active",
    leadLawyerName: "Kwame Boateng",
    nextDeadlineAt: "2026-03-07T11:00:00Z",
    unpaidBalanceGhs: 12500,
    assignedToMe: true,
  },
  {
    id: "mat-2026-004",
    reference: "MAT-2026-004",
    title: "Tarkwa Mining Supply Contract Review",
    clientName: "Tarkwa Mining Services",
    matterType: "Contract Advisory",
    practiceArea: "Commercial",
    status: "pending",
    leadLawyerName: "Efua Nkrumah",
    nextDeadlineAt: null,
    unpaidBalanceGhs: 3150,
    assignedToMe: false,
  },
  {
    id: "mat-2025-122",
    reference: "MAT-2025-122",
    title: "Kumasi Retail Lease Portfolio",
    clientName: "Ahenfie Retail Group",
    matterType: "Lease Review",
    practiceArea: "Property",
    status: "closed",
    leadLawyerName: "Kweku Biney",
    nextDeadlineAt: null,
    unpaidBalanceGhs: 0,
    assignedToMe: false,
  },
  {
    id: "mat-2025-117",
    reference: "MAT-2025-117",
    title: "Blue Coast Share Subscription",
    clientName: "Blue Coast Ventures",
    matterType: "Corporate Advisory",
    practiceArea: "Corporate",
    status: "archived",
    leadLawyerName: "Ama Osei",
    nextDeadlineAt: null,
    unpaidBalanceGhs: 0,
    assignedToMe: false,
  },
  {
    id: "mat-2026-003",
    reference: "MAT-2026-003",
    title: "Tema Port Customs Appeal",
    clientName: "Harbourline Imports",
    matterType: "Regulatory Appeal",
    practiceArea: "Regulatory",
    status: "active",
    leadLawyerName: "Naa Korkor Abbey",
    nextDeadlineAt: "2026-03-08T13:00:00Z",
    unpaidBalanceGhs: 9900,
    assignedToMe: true,
  },
  {
    id: "mat-2026-001",
    reference: "MAT-2026-001",
    title: "Adum Market Tenancy Advisory",
    clientName: "Adum Market Traders Union",
    matterType: "Advisory",
    practiceArea: "Property",
    status: "pending",
    leadLawyerName: "Efua Nkrumah",
    nextDeadlineAt: "2026-03-12T09:30:00Z",
    unpaidBalanceGhs: 2650,
    assignedToMe: false,
  },
];

const matterNarratives: Partial<
  Record<
    string,
    Pick<
      MatterDetail,
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
  "mat-2026-014": {
    court: "Commercial Division, High Court - Accra",
    suitNumber: "HRCM/142/26",
    opposingParty: "Mensah Industries Ltd",
    opposingCounsel: "Adu-Boahen Chambers",
    summary:
      "This matter remains active before the Commercial Division of the High Court in Accra. Pleadings are settled, the claimant's affidavit bundle has been reviewed internally, and the team is now focused on filing preparation ahead of the next court date.",
    focusNote:
      "The immediate priority is to file the revised affidavit bundle, confirm service timing, and keep the client briefed on the hearing sequence expected this week.",
    recentActivitySummary: "Affidavit review completed and hearing bundle is awaiting filing.",
  },
};

export function listMockMatters(): MatterListItem[] {
  return mockMatters.map((matter) => ({ ...matter }));
}

export function getMockMatterById(id: string): MatterDetail | null {
  const matter = mockMatters.find((item) => item.id === id);

  if (!matter) {
    return null;
  }

  const narrative = matterNarratives[id];
  const recentTimeline = buildRecentTimeline(matter);
  const outstandingWork = buildOutstandingWork(matter);

  return {
    id: matter.id,
    reference: matter.reference,
    title: matter.title,
    clientName: matter.clientName,
    matterType: matter.matterType,
    practiceArea: matter.practiceArea,
    status: matter.status,
    court: narrative?.court ?? `${matter.practiceArea} Division, High Court - Accra`,
    suitNumber: narrative?.suitNumber ?? `HRCM/${matter.id.slice(-3)}/26`,
    opposingParty: narrative?.opposingParty ?? `Respondent in ${matter.practiceArea.toLowerCase()} dispute`,
    opposingCounsel: narrative?.opposingCounsel ?? "External counsel on record",
    leadLawyerName: matter.leadLawyerName,
    nextDeadlineAt: matter.nextDeadlineAt,
    openedAt: "2026-01-14T10:30:00Z",
    unpaidBalanceGhs: matter.unpaidBalanceGhs,
    recentActivitySummary:
      narrative?.recentActivitySummary ??
      `${matter.practiceArea} workstream is active and awaiting the next filing sequence.`,
    recentActivityCount: recentTimeline.length + outstandingWork.length,
    summary:
      narrative?.summary ??
      `${matter.title} is being tracked in the matter workspace with active coordination across ${matter.practiceArea.toLowerCase()} tasks and client reporting.`,
    focusNote:
      narrative?.focusNote ??
      `Prioritize the next action for ${matter.clientName} and keep ${matter.leadLawyerName} aligned on deadlines and deliverables.`,
    recentTimeline,
    outstandingWork,
  };
}

function buildRecentTimeline(matter: MatterListItem): MatterTimelineItem[] {
  return [
    {
      id: `${matter.id}-activity-1`,
      title: "Case note updated",
      detail: `${matter.leadLawyerName} reviewed the latest ${matter.practiceArea.toLowerCase()} work and shared next steps.`,
      at: "2026-03-01T16:20:00Z",
    },
    {
      id: `${matter.id}-activity-2`,
      title: "Client update prepared",
      detail: `A status update for ${matter.clientName} is ready for review and release.`,
      at: "2026-02-28T11:10:00Z",
    },
    {
      id: `${matter.id}-activity-3`,
      title: "Billing review completed",
      detail: `Time entries tied to ${matter.matterType.toLowerCase()} work were checked for invoice readiness.`,
      at: "2026-02-27T14:45:00Z",
    },
  ];
}

function buildOutstandingWork(matter: MatterListItem): MatterWorkItem[] {
  const lead = matter.leadLawyerName;

  return [
    {
      id: `${matter.id}-work-1`,
      title: `Finalize next ${matter.matterType.toLowerCase()} action`,
      owner: lead,
      dueLabel: matter.nextDeadlineAt ? `Due ${formatShortDate(matter.nextDeadlineAt)}` : "No due date set",
    },
    {
      id: `${matter.id}-work-2`,
      title: "Confirm client update and supporting documents",
      owner: "Operations Desk",
      dueLabel: "Due 5 Mar 2026",
    },
    {
      id: `${matter.id}-work-3`,
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
