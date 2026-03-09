import type {
  AccountPreference,
  AccountSecurityState,
  AccountSettingsData,
  PracticeSettingsData,
  SettingsViewer,
  SettingsWorkspaceData,
  TeamMember,
  TeamSettingsData,
} from "../types";

const viewer: SettingsViewer = {
  id: "usr-kwame",
  fullName: "Kwame Boateng",
  email: "kwame@boatengassociates.gh",
  role: "admin",
  title: "Managing Partner",
  timezone: "Africa/Accra",
  phone: "+233 24 555 9012",
};

const teamMembers: TeamMember[] = [
  {
    id: "usr-kwame",
    fullName: "Kwame Boateng",
    email: "kwame@boatengassociates.gh",
    title: "Managing Partner",
    role: "admin",
    isActive: true,
    inviteStatus: "accepted",
    lastLoginAt: "2026-03-09T08:42:00Z",
    matterAccessSummary: "All matters",
    billingAccess: "full",
  },
  {
    id: "usr-abena",
    fullName: "Abena Mensah",
    email: "abena@boatengassociates.gh",
    title: "Senior Associate",
    role: "lawyer",
    isActive: true,
    inviteStatus: "accepted",
    lastLoginAt: "2026-03-09T07:15:00Z",
    matterAccessSummary: "Lead on 12 matters",
    billingAccess: "limited",
  },
  {
    id: "usr-kojo",
    fullName: "Kojo Owusu",
    email: "kojo@boatengassociates.gh",
    title: "Associate",
    role: "lawyer",
    isActive: true,
    inviteStatus: "accepted",
    lastLoginAt: "2026-03-08T18:05:00Z",
    matterAccessSummary: "Assigned matters only",
    billingAccess: "limited",
  },
  {
    id: "usr-efua",
    fullName: "Efua Nortey",
    email: "efua@boatengassociates.gh",
    title: "Practice Manager",
    role: "staff",
    isActive: true,
    inviteStatus: "accepted",
    lastLoginAt: "2026-03-09T06:58:00Z",
    matterAccessSummary: "Operations and filing support",
    billingAccess: "full",
  },
  {
    id: "usr-kweku",
    fullName: "Kweku Agyemang",
    email: "kweku@boatengassociates.gh",
    title: "Paralegal",
    role: "staff",
    isActive: true,
    inviteStatus: "accepted",
    lastLoginAt: "2026-03-08T16:44:00Z",
    matterAccessSummary: "Assigned matters only",
    billingAccess: "none",
  },
  {
    id: "usr-ama",
    fullName: "Ama Sarpong",
    email: "ama@boatengassociates.gh",
    title: "Client Success",
    role: "staff",
    isActive: false,
    inviteStatus: "accepted",
    lastLoginAt: "2026-02-22T10:10:00Z",
    matterAccessSummary: "Portal coordination only",
    billingAccess: "none",
  },
  {
    id: "usr-josephine",
    fullName: "Josephine Addo",
    email: "josephine@boatengassociates.gh",
    title: "Finance Officer",
    role: "staff",
    isActive: true,
    inviteStatus: "pending",
    lastLoginAt: null,
    matterAccessSummary: "Billing workspace only",
    billingAccess: "full",
  },
];

const preferences: AccountPreference[] = [
  {
    id: "pref-daily-digest",
    label: "Daily deadline digest",
    description: "Receive one Accra-time digest for filings, hearings, and internal reminders due soon.",
    enabled: true,
    group: "notifications",
  },
  {
    id: "pref-client-message",
    label: "Client message alerts",
    description: "Email me when a client replies in the portal or uploads requested documents.",
    enabled: true,
    group: "notifications",
  },
  {
    id: "pref-billing-alerts",
    label: "Billing follow-up alerts",
    description: "Flag overdue invoices and payment confirmations inside the practitioner workspace.",
    enabled: true,
    group: "notifications",
  },
  {
    id: "pref-open-team-by-default",
    label: "Open settings on last visited section",
    description: "Return to the last settings screen instead of always landing on practice settings.",
    enabled: false,
    group: "workflow",
  },
  {
    id: "pref-show-relative-time",
    label: "Prefer relative timestamps",
    description: "Use Today, Yesterday, and similar language where it improves scanning.",
    enabled: true,
    group: "workflow",
  },
];

const security: AccountSecurityState = {
  mfaEnabled: true,
  passwordUpdatedAt: "2026-01-21T09:30:00Z",
  recoveryEmail: "ops@boatengassociates.gh",
  sessions: [
    {
      id: "session-current",
      deviceLabel: "ThinkPad X1 Carbon",
      locationLabel: "Accra HQ",
      lastSeenAt: "2026-03-09T09:04:00Z",
      status: "current",
    },
    {
      id: "session-safari",
      deviceLabel: "iPhone Safari",
      locationLabel: "Accra",
      lastSeenAt: "2026-03-08T21:16:00Z",
      status: "recent",
    },
    {
      id: "session-chrome",
      deviceLabel: "Chrome on shared boardroom PC",
      locationLabel: "Accra HQ",
      lastSeenAt: "2026-02-26T14:50:00Z",
      status: "expired",
    },
  ],
};

export function getMockPracticeSettingsData(): PracticeSettingsData {
  return {
    viewer,
    firmName: "Boateng & Associates",
    seatCount: 8,
    activeMatters: 34,
    monthlyCollectionsTargetGhs: 180000,
    practice: {
      workspaceName: "Boateng & Associates",
      legalName: "Boateng & Associates Legal Practitioners",
      primaryEmail: "operations@boatengassociates.gh",
      primaryPhone: "+233 30 276 1408",
      timezone: "Africa/Accra",
      reminderCadence: "7d, 3d, 1d, same day",
      paymentReminderMode: "7d before due date and 3d after due date",
      invoiceFooter: "Payments accepted in GHS through Hubtel Mobile Money and Paystack card checkout.",
      defaultMatterVisibility: "Assigned team members plus admin oversight",
    },
  };
}

export function getMockTeamSettingsData(): TeamSettingsData {
  return {
    viewer,
    firmName: "Boateng & Associates",
    seatCount: 8,
    members: teamMembers,
  };
}

export function getMockAccountSettingsData(): AccountSettingsData {
  return {
    viewer,
    profile: {
      fullName: viewer.fullName,
      email: viewer.email,
      title: viewer.title,
      timezone: viewer.timezone,
      phone: viewer.phone,
    },
    security,
    preferences,
  };
}

export function getMockSettingsWorkspace(): SettingsWorkspaceData {
  return {
    viewer,
    practice: getMockPracticeSettingsData(),
    team: getMockTeamSettingsData(),
    account: getMockAccountSettingsData(),
  };
}
