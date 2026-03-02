import type { MatterDetail } from "@/types/matter";

interface UseMatterResult {
  matter: MatterDetail | null;
  isLoading: boolean;
  isError: boolean;
}

const mockMatter: MatterDetail = {
  id: "mat-2026-014",
  reference: "MAT-2026-014",
  title: "Asante v. Mensah Industries Ltd",
  clientName: "Asante Holdings Ltd",
  matterType: "Commercial Litigation",
  practiceArea: "Dispute Resolution",
  status: "active",
  court: "Commercial Division, High Court - Accra",
  suitNumber: "HRCM/142/26",
  opposingParty: "Mensah Industries Ltd",
  opposingCounsel: "Adu-Boahen Chambers",
  leadLawyerName: "Kwame Boateng",
  nextDeadlineAt: "2026-03-06T09:00:00Z",
  openedAt: "2026-01-14T10:30:00Z",
  unpaidBalanceGhs: 18450,
  recentActivitySummary: "Affidavit review completed and hearing bundle is awaiting filing.",
  recentActivityCount: 7,
  summary:
    "This matter remains active before the Commercial Division of the High Court in Accra. Pleadings are settled, the claimant's affidavit bundle has been reviewed internally, and the team is now focused on filing preparation ahead of the next court date.",
  focusNote:
    "The immediate priority is to file the revised affidavit bundle, confirm service timing, and keep the client briefed on the hearing sequence expected this week.",
  recentTimeline: [
    {
      id: "activity-1",
      title: "Affidavit bundle revised",
      detail: "Counsel comments were incorporated and the final filing pack is ready for review.",
      at: "2026-03-01T16:20:00Z",
    },
    {
      id: "activity-2",
      title: "Client strategy update sent",
      detail: "A plain-language status update was prepared for the client after internal review.",
      at: "2026-02-28T11:10:00Z",
    },
    {
      id: "activity-3",
      title: "Billing review completed",
      detail: "Time entries for conference prep and affidavit drafting were approved for invoicing.",
      at: "2026-02-27T14:45:00Z",
    },
  ],
  outstandingWork: [
    {
      id: "work-1",
      title: "File revised affidavit bundle",
      owner: "Kwame Boateng",
      dueLabel: "Due 6 Mar 2026",
    },
    {
      id: "work-2",
      title: "Confirm service copy with court clerk",
      owner: "Ama Osei",
      dueLabel: "Due 5 Mar 2026",
    },
    {
      id: "work-3",
      title: "Prepare hearing brief for client",
      owner: "Kwesi Adjei",
      dueLabel: "Due 7 Mar 2026",
    },
  ],
};

export function useMatter(id: string): UseMatterResult {
  if (!id) {
    return {
      matter: null,
      isLoading: false,
      isError: true,
    };
  }

  return {
    matter: {
      ...mockMatter,
      id,
    },
    isLoading: false,
    isError: false,
  };
}
