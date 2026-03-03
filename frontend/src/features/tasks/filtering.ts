import type {
  TaskBoardColumn,
  TaskDueWindow,
  TaskItem,
  TaskListFilters,
  TaskPriority,
  TaskStatus,
} from "@/features/tasks/types";

const priorityWeight: Record<TaskPriority, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
};

const boardStatuses: Array<Exclude<TaskStatus, "cancelled">> = [
  "todo",
  "in_progress",
  "blocked",
  "done",
];

const boardLabels: Record<Exclude<TaskStatus, "cancelled">, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  blocked: "Blocked",
  done: "Done",
};

export const defaultTaskFilters: TaskListFilters = {
  search: "",
  statuses: [],
  priorities: [],
  assigneeId: null,
  matterId: null,
  dueWindow: "all",
  assignedToMeOnly: false,
};

export function filterTasks(tasks: TaskItem[], filters: TaskListFilters): TaskItem[] {
  const normalizedSearch = filters.search.trim().toLowerCase();

  return tasks
    .filter((task) => {
      if (filters.assignedToMeOnly && !task.assignedToMe) {
        return false;
      }

      if (filters.matterId && task.matterId !== filters.matterId) {
        return false;
      }

      if (filters.assigneeId && task.assigneeId !== filters.assigneeId) {
        return false;
      }

      if (filters.statuses.length > 0 && !filters.statuses.includes(task.status)) {
        return false;
      }

      if (filters.priorities.length > 0 && !filters.priorities.includes(task.priority)) {
        return false;
      }

      if (!matchesDueWindow(task, filters.dueWindow)) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return [
        task.title,
        task.description,
        task.matterReference,
        task.matterTitle,
        task.clientName,
        task.assigneeName ?? "",
      ].some((value) => value.toLowerCase().includes(normalizedSearch));
    })
    .sort(compareTasks);
}

export function buildTaskBoard(tasks: TaskItem[]): TaskBoardColumn[] {
  return boardStatuses.map((status) => ({
    status,
    label: boardLabels[status],
    items: tasks.filter((task) => task.status === status).sort(compareTasks),
  }));
}

export function moveTaskStatus(
  tasks: TaskItem[],
  taskId: string,
  status: Exclude<TaskStatus, "cancelled">,
): TaskItem[] {
  return tasks.map((task) => {
    if (task.id !== taskId) {
      return task;
    }

    const now = new Date().toISOString();

    return {
      ...task,
      status,
      updatedAt: now,
      completedAt: status === "done" ? now : null,
    };
  });
}

export function getStatusLabel(status: TaskStatus): string {
  if (status === "todo") {
    return "To Do";
  }

  if (status === "in_progress") {
    return "In Progress";
  }

  return status.charAt(0).toUpperCase() + status.slice(1);
}

function compareTasks(left: TaskItem, right: TaskItem): number {
  const dueComparison = compareDueDates(left.dueAt, right.dueAt);

  if (dueComparison !== 0) {
    return dueComparison;
  }

  const priorityComparison = priorityWeight[left.priority] - priorityWeight[right.priority];

  if (priorityComparison !== 0) {
    return priorityComparison;
  }

  return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
}

function compareDueDates(left: string | null, right: string | null): number {
  if (left && right) {
    return new Date(left).getTime() - new Date(right).getTime();
  }

  if (left) {
    return -1;
  }

  if (right) {
    return 1;
  }

  return 0;
}

function matchesDueWindow(task: TaskItem, dueWindow: TaskDueWindow): boolean {
  if (dueWindow === "all") {
    return true;
  }

  if (!task.dueAt) {
    return dueWindow === "none";
  }

  const now = new Date();
  const nowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const due = new Date(task.dueAt);
  const dueStart = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const diffDays = Math.round((dueStart.getTime() - nowStart.getTime()) / 86400000);

  if (dueWindow === "overdue") {
    return diffDays < 0 && task.status !== "done";
  }

  if (dueWindow === "today") {
    return diffDays === 0;
  }

  if (dueWindow === "this_week") {
    return diffDays > 0 && diffDays <= 7;
  }

  if (dueWindow === "future") {
    return diffDays > 7;
  }

  return false;
}
