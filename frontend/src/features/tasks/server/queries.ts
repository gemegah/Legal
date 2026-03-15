import "server-only";

import { cache } from "react";

import type { TaskItem } from "@/features/tasks/types";

import { taskRepository } from "./repository";

export const getTaskById = cache(async (id: string): Promise<TaskItem | null> => {
  if (!id) {
    return null;
  }

  return taskRepository.getTaskById(id);
});

export const getTaskWorkspace = cache(async (): Promise<{ tasks: TaskItem[] }> => {
  const tasks = await taskRepository.listTasks();

  return { tasks };
});

export const getTasksByCase = cache(async (caseId: string): Promise<{ tasks: TaskItem[] }> => {
  if (!caseId) {
    return { tasks: [] };
  }

  const tasks = await taskRepository.listTasksByCase(caseId);

  return { tasks };
});
