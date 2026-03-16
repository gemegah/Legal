import type {
  ClientUploadRequest,
  DocumentRecord,
  DocumentTemplate,
  DocumentTemplateCreateRequest,
  DocumentTemplateGenerateRequest,
  ShareRequest,
  UploadConfirmRequest,
  UploadConfirmResponse,
  UploadInitiateRequest,
  UploadInitiateResponse,
} from "./types";

async function request<T>(apiBaseUrl: string, path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl.replace(/\/$/, "")}${path}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`${init?.method ?? "GET"} ${path} failed with status ${response.status}.`);
  }

  return (await response.json()) as T;
}

export async function uploadDocument(args: {
  apiBaseUrl: string;
  caseId: string;
  payload: UploadInitiateRequest;
  confirm: UploadConfirmRequest;
}): Promise<DocumentRecord> {
  const initiated = await request<UploadInitiateResponse>(
    args.apiBaseUrl,
    `/api/v1/cases/${args.caseId}/documents/upload-initiate`,
    {
      body: JSON.stringify(args.payload),
      method: "POST",
    },
  );

  await request<UploadConfirmResponse>(
    args.apiBaseUrl,
    `/api/v1/cases/${args.caseId}/documents/${initiated.document_id}/confirm`,
    {
      body: JSON.stringify({ ...args.confirm, storage_key: initiated.storage_key }),
      method: "POST",
    },
  );

  return request<DocumentRecord>(args.apiBaseUrl, `/api/v1/documents/${initiated.document_id}`);
}

export async function updateDocumentShare(args: {
  apiBaseUrl: string;
  documentId: string;
  payload: ShareRequest;
}): Promise<DocumentRecord> {
  return request<DocumentRecord>(args.apiBaseUrl, `/api/v1/documents/${args.documentId}/share`, {
    body: JSON.stringify(args.payload),
    method: "POST",
  });
}

export async function updateClientRequest(args: {
  apiBaseUrl: string;
  documentId: string;
  payload: ClientUploadRequest;
}): Promise<DocumentRecord> {
  return request<DocumentRecord>(args.apiBaseUrl, `/api/v1/documents/${args.documentId}/request-client-upload`, {
    body: JSON.stringify(args.payload),
    method: "POST",
  });
}

export async function createTemplate(args: {
  apiBaseUrl: string;
  payload: DocumentTemplateCreateRequest;
}): Promise<DocumentTemplate> {
  return request<DocumentTemplate>(args.apiBaseUrl, "/api/v1/document-templates", {
    body: JSON.stringify(args.payload),
    method: "POST",
  });
}

export async function generateTemplateDocument(args: {
  apiBaseUrl: string;
  templateId: string;
  payload: DocumentTemplateGenerateRequest;
}): Promise<DocumentRecord> {
  return request<DocumentRecord>(
    args.apiBaseUrl,
    `/api/v1/document-templates/${args.templateId}/generate`,
    {
      body: JSON.stringify(args.payload),
      method: "POST",
    },
  );
}
