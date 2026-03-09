import "server-only";

import { cache } from "react";

import type {
  AccountSettingsData,
  PracticeSettingsData,
  SettingsWorkspaceData,
  TeamSettingsData,
} from "@/features/settings/types";

import { settingsRepository } from "./repository";

export const getSettingsWorkspace = cache(async (): Promise<SettingsWorkspaceData> => {
  return settingsRepository.getWorkspace();
});

export const getPracticeSettingsData = cache(async (): Promise<PracticeSettingsData> => {
  return settingsRepository.getPracticeSettings();
});

export const getTeamSettingsData = cache(async (): Promise<TeamSettingsData> => {
  return settingsRepository.getTeamSettings();
});

export const getAccountSettingsData = cache(async (): Promise<AccountSettingsData> => {
  return settingsRepository.getAccountSettings();
});
