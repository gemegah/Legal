import "server-only";

import { getRuntimeConfig, type DataSource } from "./runtime-config";

export function getDataSource(): DataSource {
  return getRuntimeConfig().dataSource;
}

export function getApiBaseUrl(): string {
  const { apiBaseUrl } = getRuntimeConfig();

  if (!apiBaseUrl) {
    throw new Error("API base URL is not configured.");
  }

  return apiBaseUrl.replace(/\/$/, "");
}
