import "server-only";

import { createMockThread, getMessagesWorkspaceData, replyToMockThread, updateMockThreadMeta } from "@/features/messages/data/mock";
import type { MessageItem, MessageThread, MessageThreadDetail, MessagesWorkspaceData } from "@/features/messages/types";

export interface MessagesRepository {
  listThreads(): Promise<MessagesWorkspaceData>;
  getThread(id: string): Promise<MessageThreadDetail | null>;
  createThread(input: {
    matterId: string | null;
    type: "internal" | "client";
    subject: string;
    assigneeId: string | null;
    body: string;
  }): Promise<MessageThreadDetail>;
  reply(threadId: string, input: Pick<MessageItem, "body" | "visibility">): Promise<MessageItem | null>;
  updateThreadMeta(
    id: string,
    input: Partial<Pick<MessageThread, "assigneeId" | "matterId" | "status" | "portalSafe" | "unreadCount">>,
  ): Promise<MessageThreadDetail | null>;
}

const mockMessagesRepository: MessagesRepository = {
  async listThreads() {
    return getMessagesWorkspaceData();
  },
  async getThread(id) {
    return getMessagesWorkspaceData().threads.find((thread) => thread.id === id) ?? null;
  },
  async createThread(input) {
    return createMockThread(input);
  },
  async reply(threadId, input) {
    return replyToMockThread(threadId, input);
  },
  async updateThreadMeta(id, input) {
    return updateMockThreadMeta(id, input);
  },
};

export const messagesRepository: MessagesRepository = mockMessagesRepository;
