import "server-only";

import { getMockTaskById, listMockTasks } from "@/features/tasks/data/mock";
import type { TaskItem } from "@/features/tasks/types";
import { getDataSource } from "@/lib/data-source";

export interface TaskRepository {
  getTaskById(id: string): Promise<TaskItem | null>;
  listTasks(): Promise<TaskItem[]>;
  listTasksByCase(caseId: string): Promise<TaskItem[]>;
}

export const mockTaskRepository: TaskRepository = {
  async getTaskById(id) {
    return getMockTaskById(id);
  },
  async listTasks() {
    return listMockTasks();
  },
  async listTasksByCase(caseId) {
    return listMockTasks().filter((task) => task.caseId === caseId);
  },
};

export const apiTaskRepository: TaskRepository = {
  async getTaskById() {
    throw new Error('Task API repository is not wired yet. Use DATA_SOURCE="mock" for tasks until the backend slice is implemented.');
  },
  async listTasks() {
    throw new Error('Task API repository is not wired yet. Use DATA_SOURCE="mock" for tasks until the backend slice is implemented.');
  },
  async listTasksByCase() {
    throw new Error('Task API repository is not wired yet. Use DATA_SOURCE="mock" for tasks until the backend slice is implemented.');
  },
};

function createTaskRepository(): TaskRepository {
  return getDataSource() === "api" ? apiTaskRepository : mockTaskRepository;
}

export const taskRepository: TaskRepository = createTaskRepository();
