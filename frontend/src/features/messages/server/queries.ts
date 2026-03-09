import "server-only";

import { cache } from "react";

import type { MessagesWorkspaceData } from "@/features/messages/types";

import { messagesRepository } from "./repository";

export const getMessagesWorkspace = cache(async (): Promise<MessagesWorkspaceData> => {
  return messagesRepository.listThreads();
});
