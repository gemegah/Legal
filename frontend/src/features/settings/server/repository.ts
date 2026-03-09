import "server-only";

import {
  getMockAccountSettingsData,
  getMockPracticeSettingsData,
  getMockSettingsWorkspace,
  getMockTeamSettingsData,
} from "@/features/settings/data/mock";
import type {
  AccountSettingsData,
  PracticeSettingsData,
  SettingsViewer,
  SettingsWorkspaceData,
  TeamMember,
  TeamSettingsData,
} from "@/features/settings/types";
import { apiGet } from "@/lib/api";
import { getDataSource } from "@/lib/data-source";

interface SettingsRepository {
  getWorkspace(): Promise<SettingsWorkspaceData>;
  getPracticeSettings(): Promise<PracticeSettingsData>;
  getTeamSettings(): Promise<TeamSettingsData>;
  getAccountSettings(): Promise<AccountSettingsData>;
}

interface ApiViewer {
  id: string;
  full_name: string;
  email: string;
  role: "admin" | "lawyer" | "staff" | "client";
}

interface ApiTeamMember {
  id: string;
  full_name: string;
  email: string;
  role: "admin" | "lawyer" | "staff" | "client";
  is_active: boolean;
  last_login_at: string | null;
}

const mockSettingsRepository: SettingsRepository = {
  async getWorkspace() {
    return getMockSettingsWorkspace();
  },
  async getPracticeSettings() {
    return getMockPracticeSettingsData();
  },
  async getTeamSettings() {
    return getMockTeamSettingsData();
  },
  async getAccountSettings() {
    return getMockAccountSettingsData();
  },
};

const apiSettingsRepository: SettingsRepository = {
  async getWorkspace() {
    const fallback = getMockSettingsWorkspace();

    try {
      const viewer = normalizeViewer(await apiGet<ApiViewer>("/api/v1/auth/me"));
      const team = await getApiTeamSettings(viewer);
      return {
        viewer,
        practice: {
          ...fallback.practice,
          viewer,
        },
        team,
        account: {
          ...fallback.account,
          viewer,
          profile: {
            ...fallback.account.profile,
            fullName: viewer.fullName,
            email: viewer.email,
            title: viewer.title,
            timezone: viewer.timezone,
            phone: viewer.phone,
          },
        },
      };
    } catch {
      return fallback;
    }
  },
  async getPracticeSettings() {
    const workspace = await this.getWorkspace();
    return workspace.practice;
  },
  async getTeamSettings() {
    const workspace = await this.getWorkspace();
    return workspace.team;
  },
  async getAccountSettings() {
    const workspace = await this.getWorkspace();
    return workspace.account;
  },
};

export const settingsRepository =
  getDataSource() === "api" ? apiSettingsRepository : mockSettingsRepository;

async function getApiTeamSettings(viewer: SettingsViewer): Promise<TeamSettingsData> {
  const fallback = getMockTeamSettingsData();

  try {
    const users = await apiGet<ApiTeamMember[]>("/api/v1/users");
    return {
      viewer,
      firmName: fallback.firmName,
      seatCount: fallback.seatCount,
      members: users
        .filter((user) => user.role !== "client")
        .map((user) => normalizeTeamMember(user, fallback.members)),
    };
  } catch {
    return {
      ...fallback,
      viewer,
    };
  }
}

function normalizeViewer(payload: ApiViewer): SettingsViewer {
  const fallback = getMockSettingsWorkspace().viewer;

  return {
    id: payload.id,
    fullName: payload.full_name,
    email: payload.email,
    role: payload.role === "client" ? "staff" : payload.role,
    title: fallback.role === payload.role ? fallback.title : roleTitleFor(payload.role),
    timezone: fallback.timezone,
    phone: fallback.phone,
  };
}

function normalizeTeamMember(payload: ApiTeamMember, fallbackMembers: TeamMember[]): TeamMember {
  const fallback = fallbackMembers.find((member) => member.id === payload.id || member.email === payload.email);

  return {
    id: payload.id,
    fullName: payload.full_name,
    email: payload.email,
    title: fallback?.title ?? roleTitleFor(payload.role),
    role: payload.role === "client" ? "staff" : payload.role,
    isActive: payload.is_active,
    inviteStatus: payload.last_login_at ? "accepted" : "pending",
    lastLoginAt: payload.last_login_at,
    matterAccessSummary: fallback?.matterAccessSummary ?? "Assigned matters only",
    billingAccess: fallback?.billingAccess ?? "limited",
  };
}

function roleTitleFor(role: ApiViewer["role"]) {
  if (role === "admin") return "Firm Administrator";
  if (role === "lawyer") return "Lawyer";
  return "Staff";
}
