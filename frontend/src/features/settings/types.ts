export type PractitionerRole = "admin" | "lawyer" | "staff";

export interface SettingsViewer {
  id: string;
  fullName: string;
  email: string;
  role: PractitionerRole;
  title: string;
  timezone: string;
  phone: string;
}

export interface PracticeSettings {
  workspaceName: string;
  legalName: string;
  primaryEmail: string;
  primaryPhone: string;
  timezone: string;
  reminderCadence: string;
  paymentReminderMode: string;
  invoiceFooter: string;
  defaultMatterVisibility: string;
}

export interface PracticeSettingsData {
  viewer: SettingsViewer;
  firmName: string;
  seatCount: number;
  activeMatters: number;
  monthlyCollectionsTargetGhs: number;
  practice: PracticeSettings;
}

export type InviteStatus = "accepted" | "pending" | "expired";

export interface TeamMember {
  id: string;
  fullName: string;
  email: string;
  title: string;
  role: PractitionerRole;
  isActive: boolean;
  inviteStatus: InviteStatus;
  lastLoginAt: string | null;
  matterAccessSummary: string;
  billingAccess: "full" | "limited" | "none";
}

export interface TeamSettingsData {
  viewer: SettingsViewer;
  firmName: string;
  seatCount: number;
  members: TeamMember[];
}

export interface SessionActivity {
  id: string;
  deviceLabel: string;
  locationLabel: string;
  lastSeenAt: string;
  status: "current" | "recent" | "expired";
}

export interface AccountPreference {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  group: "notifications" | "workflow";
}

export interface AccountSecurityState {
  mfaEnabled: boolean;
  passwordUpdatedAt: string;
  recoveryEmail: string;
  sessions: SessionActivity[];
}

export interface AccountProfile {
  fullName: string;
  email: string;
  title: string;
  timezone: string;
  phone: string;
}

export interface AccountSettingsData {
  viewer: SettingsViewer;
  profile: AccountProfile;
  security: AccountSecurityState;
  preferences: AccountPreference[];
}

export interface SettingsWorkspaceData {
  viewer: SettingsViewer;
  practice: PracticeSettingsData;
  team: TeamSettingsData;
  account: AccountSettingsData;
}
