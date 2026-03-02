import type { MatterListItem, MatterWorkspaceStats, UseMattersResult } from "@/types/matter";

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

const mockStats: MatterWorkspaceStats = {
  activeCount: mockMatters.filter((matter) => matter.status === "active").length,
  pendingCount: mockMatters.filter((matter) => matter.status === "pending").length,
  dueThisWeekCount: mockMatters.filter((matter) => isDueThisWeek(matter.nextDeadlineAt)).length,
  outstandingBalanceGhs: mockMatters.reduce(
    (total, matter) => total + matter.unpaidBalanceGhs,
    0,
  ),
};

export function useMatters(): UseMattersResult {
  return {
    matters: mockMatters,
    stats: mockStats,
    isLoading: false,
    isError: false,
  };
}

function isDueThisWeek(nextDeadlineAt: string | null): boolean {
  if (!nextDeadlineAt) {
    return false;
  }

  const now = new Date();
  const deadline = new Date(nextDeadlineAt);
  const diffDays = (deadline.getTime() - now.getTime()) / 86400000;

  return diffDays >= 0 && diffDays <= 7;
}
