export type MessageThreadType = "internal" | "client";
export type MessageThreadStatus = "open" | "waiting_on_firm" | "waiting_on_client" | "archived";
export type MessageChannel = "in_app" | "email_bridge" | "portal";
export type MessageVisibility = "internal_only" | "client_visible";
export type MessageDeliveryState = "sent" | "draft" | "failed";

export interface MessageParticipant {
  id: string;
  name: string;
  role: "admin" | "lawyer" | "staff" | "client";
}

export interface MessageAttachment {
  id: string;
  name: string;
  kind: "document" | "note" | "file";
}

export interface MessageItem {
  id: string;
  threadId: string;
  authorId: string;
  authorName: string;
  authorRole: "admin" | "lawyer" | "staff" | "client";
  body: string;
  createdAt: string;
  attachments: MessageAttachment[];
  visibility: MessageVisibility;
  deliveryState: MessageDeliveryState;
}

export interface MessageThread {
  id: string;
  caseId: string | null;
  caseLabel: string | null;
  type: MessageThreadType;
  subject: string;
  participants: MessageParticipant[];
  lastMessageAt: string;
  lastMessagePreview: string;
  unreadCount: number;
  assigneeId: string | null;
  status: MessageThreadStatus;
  portalSafe: boolean;
  channel: MessageChannel;
}

export interface MessageThreadDetail extends MessageThread {
  messages: MessageItem[];
  linkedDocumentLabels: string[];
}

export interface MessageWorkspaceOption {
  value: string;
  label: string;
}

export interface MessagesWorkspaceData {
  threads: MessageThreadDetail[];
  caseOptions: MessageWorkspaceOption[];
  assigneeOptions: MessageWorkspaceOption[];
}
