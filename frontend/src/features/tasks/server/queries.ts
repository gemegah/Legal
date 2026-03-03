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

export const getTasksByMatter = cache(async (matterId: string): Promise<{ tasks: TaskItem[] }> => {
  if (!matterId) {
    return { tasks: [] };
  }

  const tasks = await taskRepository.listTasksByMatter(matterId);

  return { tasks };
});
