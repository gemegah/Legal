export type DataSource = "mock" | "api";

export interface RuntimeConfig {
  apiBaseUrl: string | null;
  dataSource: DataSource;
}

function parseDataSource(value: string | undefined): DataSource {
  if (!value) {
    return "mock";
  }

  if (value === "mock" || value === "api") {
    return value;
  }

  throw new Error(`Unsupported DATA_SOURCE "${value}". Use "mock" or "api".`);
}

export function getRuntimeConfig(): RuntimeConfig {
  const dataSource = parseDataSource(process.env.DATA_SOURCE);
  const apiBaseUrl = process.env.LEGALOS_API_BASE_URL?.trim() || process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || null;

  if (dataSource === "api" && !apiBaseUrl) {
    throw new Error(
      'DATA_SOURCE is set to "api" but no API base URL was provided. Set LEGALOS_API_BASE_URL or NEXT_PUBLIC_API_BASE_URL.',
    );
  }

  return {
    apiBaseUrl,
    dataSource,
  };
}
