import "server-only";

import { getApiBaseUrl } from "./data-source";

export async function apiGet<T>(path: string, options?: { allowNotFound?: boolean }): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (response.status === 404 && options?.allowNotFound) {
    return null as T;
  }

  if (!response.ok) {
    throw new Error(`GET ${path} failed with status ${response.status}.`);
  }

  return (await response.json()) as T;
}
