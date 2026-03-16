import { listMockCases } from "@/features/cases/data/mock";
import type {
  MessageItem,
  MessageThreadDetail,
  MessagesWorkspaceData,
  MessageThreadType,
} from "@/features/messages/types";

const caseMap = new Map(
  listMockCases().map((item) => [item.id, `${item.reference} - ${item.title}`]),
);

const assigneeOptions = [
  { value: "usr-kwame", label: "Kwame Boateng" },
  { value: "usr-ama", label: "Ama Osei" },
  { value: "usr-naa", label: "Naa Korkor Abbey" },
  { value: "usr-ops", label: "Operations Desk" },
];

const seedThreads: MessageThreadDetail[] = [
  buildThread({
    id: "thr-internal-affidavit",
    caseId: "case-2026-014",
    type: "internal",
    subject: "Affidavit filing sequence for Mensah case",
    assigneeId: "usr-kwame",
    status: "waiting_on_firm",
    portalSafe: false,
    channel: "in_app",
    unreadCount: 2,
    participants: [
      { id: "usr-kwame", name: "Kwame Boateng", role: "admin" },
      { id: "usr-ama", name: "Ama Osei", role: "lawyer" },
      { id: "usr-ops", name: "Operations Desk", role: "staff" },
    ],
    messages: [
      message("msg-014-1", "thr-internal-affidavit", "usr-ama", "Ama Osei", "lawyer", "We should file before noon if registry confirms the certified copy is ready.", "2026-03-08T08:35:00Z"),
      message("msg-014-2", "thr-internal-affidavit", "usr-ops", "Operations Desk", "staff", "Runner is available from 10:30. I still need the stamped exhibit list.", "2026-03-08T09:20:00Z"),
      message("msg-014-3", "thr-internal-affidavit", "usr-kwame", "Kwame Boateng", "admin", "Use the revised numbering from this morning. Keep the client update separate until filing lands.", "2026-03-08T09:32:00Z"),
    ],
    linkedDocumentLabels: ["Affidavit bundle v3", "Exhibit list"],
  }),
  buildThread({
    id: "thr-client-affidavit",
    caseId: "case-2026-014",
    type: "client",
    subject: "Client update draft before filing",
    assigneeId: "usr-ama",
    status: "open",
    portalSafe: true,
    channel: "portal",
    unreadCount: 0,
    participants: [
      { id: "usr-ama", name: "Ama Osei", role: "lawyer" },
      { id: "usr-client-asante", name: "Kojo Asante", role: "client" },
    ],
    messages: [
      {
        ...message("msg-014-client-1", "thr-client-affidavit", "usr-ama", "Ama Osei", "lawyer", "We have completed review of the revised affidavit materials. Next steps are filing and service coordination.", "2026-03-07T15:10:00Z"),
        visibility: "client_visible",
      },
      {
        ...message("msg-014-client-2", "thr-client-affidavit", "usr-client-asante", "Kojo Asante", "client", "Thank you. Please send a same-day note once filing is done.", "2026-03-07T16:00:00Z"),
        visibility: "client_visible",
      },
    ],
    linkedDocumentLabels: ["Client status update"],
  }),
  buildThread({
    id: "thr-estate-registry",
    caseId: "case-2026-011",
    type: "internal",
    subject: "Registry copies for Darko estate case",
    assigneeId: "usr-naa",
    status: "open",
    portalSafe: false,
    channel: "email_bridge",
    unreadCount: 1,
    participants: [
      { id: "usr-naa", name: "Naa Korkor Abbey", role: "lawyer" },
      { id: "usr-ops", name: "Operations Desk", role: "staff" },
    ],
    messages: [
      message("msg-011-1", "thr-estate-registry", "usr-naa", "Naa Korkor Abbey", "lawyer", "Need two extra certified copies before the registry will confirm the hearing date.", "2026-03-05T10:05:00Z"),
      message("msg-011-2", "thr-estate-registry", "usr-ops", "Operations Desk", "staff", "I can handle the clerk run tomorrow morning if the corrected schedule is approved today.", "2026-03-05T11:18:00Z"),
    ],
    linkedDocumentLabels: ["Beneficiary schedule"],
  }),
  buildThread({
    id: "thr-client-payment",
    caseId: "case-2026-011",
    type: "client",
    subject: "Invoice clarification for registry disbursements",
    assigneeId: "usr-ama",
    status: "waiting_on_client",
    portalSafe: true,
    channel: "portal",
    unreadCount: 0,
    participants: [
      { id: "usr-ama", name: "Ama Osei", role: "lawyer" },
      { id: "usr-client-darko", name: "Esi Darko", role: "client" },
    ],
    messages: [
      {
        ...message("msg-011-client-1", "thr-client-payment", "usr-ama", "Ama Osei", "lawyer", "The invoice separates registry disbursements from counsel time. Please let us know if you want a line-by-line breakdown.", "2026-03-05T16:15:00Z"),
        visibility: "client_visible",
      },
    ],
    linkedDocumentLabels: ["March probate invoice"],
  }),
  buildThread({
    id: "thr-archived-land",
    caseId: "case-2025-122",
    type: "internal",
    subject: "Lease portfolio close-out notes",
    assigneeId: "usr-kwame",
    status: "archived",
    portalSafe: false,
    channel: "in_app",
    unreadCount: 0,
    participants: [
      { id: "usr-kwame", name: "Kwame Boateng", role: "admin" },
      { id: "usr-ama", name: "Ama Osei", role: "lawyer" },
    ],
    messages: [
      message("msg-122-1", "thr-archived-land", "usr-kwame", "Kwame Boateng", "admin", "Archive after client confirms all executed leases are stored in the document center.", "2026-02-26T12:10:00Z"),
    ],
    linkedDocumentLabels: ["Executed leases"],
  }),
];

let mockThreads = seedThreads.map(cloneThreadDetail);

export function getMessagesWorkspaceData(): MessagesWorkspaceData {
  return {
    threads: mockThreads
      .slice()
      .sort((left, right) => Date.parse(right.lastMessageAt) - Date.parse(left.lastMessageAt))
      .map(cloneThreadDetail),
    caseOptions: Array.from(caseMap.entries()).map(([value, label]) => ({ value, label })),
    assigneeOptions: assigneeOptions.map((option) => ({ ...option })),
  };
}

export function getUnreadMessageCount(): number {
  return mockThreads.reduce((sum, thread) => sum + thread.unreadCount, 0);
}

export function createMockThread(input: {
  caseId: string | null;
  type: MessageThreadType;
  subject: string;
  assigneeId: string | null;
  body: string;
}): MessageThreadDetail {
  const now = new Date().toISOString();
  const thread = buildThread({
    id: `thr-${Math.random().toString(36).slice(2, 10)}`,
    caseId: input.caseId,
    type: input.type,
    subject: input.subject,
    assigneeId: input.assigneeId,
    status: "open",
    portalSafe: input.type === "client",
    channel: input.type === "client" ? "portal" : "in_app",
    unreadCount: 0,
    participants: [
      { id: "usr-kwame", name: "Kwame Boateng", role: "admin" },
      ...(input.type === "client" ? [{ id: "usr-client-new", name: "Client participant", role: "client" as const }] : []),
    ],
    messages: [message(`msg-${Math.random().toString(36).slice(2, 10)}`, "new-thread", "usr-kwame", "Kwame Boateng", "admin", input.body, now)],
    linkedDocumentLabels: [],
  });
  mockThreads = [thread, ...mockThreads];
  return cloneThreadDetail(thread);
}

export function replyToMockThread(threadId: string, input: Pick<MessageItem, "body" | "visibility">): MessageItem | null {
  const thread = mockThreads.find((item) => item.id === threadId);
  if (!thread) {
    return null;
  }
  const nextMessage = {
    ...message(`msg-${Math.random().toString(36).slice(2, 10)}`, threadId, "usr-kwame", "Kwame Boateng", "admin", input.body, new Date().toISOString()),
    visibility: input.visibility,
  };
  thread.messages = [...thread.messages, nextMessage];
  syncThread(thread);
  return { ...nextMessage, attachments: nextMessage.attachments.map((item) => ({ ...item })) };
}

export function updateMockThreadMeta(
  threadId: string,
  input: Partial<Pick<MessageThreadDetail, "assigneeId" | "caseId" | "status" | "portalSafe" | "unreadCount">>,
): MessageThreadDetail | null {
  const thread = mockThreads.find((item) => item.id === threadId);
  if (!thread) {
    return null;
  }
  Object.assign(thread, input);
  thread.caseLabel = thread.caseId ? caseMap.get(thread.caseId) ?? "Linked case" : null;
  syncThread(thread);
  return cloneThreadDetail(thread);
}

function buildThread(input: Omit<MessageThreadDetail, "lastMessageAt" | "lastMessagePreview" | "caseLabel"> & { caseId: string | null }) {
  const lastMessage = input.messages[input.messages.length - 1];
  return {
    ...input,
    caseLabel: input.caseId ? caseMap.get(input.caseId) ?? "Linked case" : null,
    lastMessageAt: lastMessage?.createdAt ?? new Date().toISOString(),
    lastMessagePreview: lastMessage?.body ?? "",
  };
}

function message(
  id: string,
  threadId: string,
  authorId: string,
  authorName: string,
  authorRole: "admin" | "lawyer" | "staff" | "client",
  body: string,
  createdAt: string,
): MessageItem {
  return {
    id,
    threadId,
    authorId,
    authorName,
    authorRole,
    body,
    createdAt,
    attachments: [],
    visibility: authorRole === "client" ? "client_visible" : "internal_only",
    deliveryState: "sent",
  };
}

function syncThread(thread: MessageThreadDetail) {
  const lastMessage = thread.messages[thread.messages.length - 1];
  thread.lastMessageAt = lastMessage?.createdAt ?? thread.lastMessageAt;
  thread.lastMessagePreview = lastMessage?.body ?? thread.lastMessagePreview;
}

function cloneThreadDetail(thread: MessageThreadDetail): MessageThreadDetail {
  return {
    ...thread,
    participants: thread.participants.map((participant) => ({ ...participant })),
    messages: thread.messages.map((item) => ({
      ...item,
      attachments: item.attachments.map((attachment) => ({ ...attachment })),
    })),
    linkedDocumentLabels: [...thread.linkedDocumentLabels],
  };
}
