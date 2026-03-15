export type TaskStatus = "todo" | "in_progress" | "done" | "blocked" | "cancelled";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export type TaskViewMode = "list" | "kanban";

export type TaskScope = "firm" | "mine" | "case";

export type TaskDueWindow = "all" | "overdue" | "today" | "this_week" | "future" | "none";

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  caseId: string;
  caseReference: string;
  caseTitle: string;
  clientName: string;
  assigneeId: string | null;
  assigneeName: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  assignedToMe: boolean;
}

export interface TaskListFilters {
  search: string;
  statuses: TaskStatus[];
  priorities: TaskPriority[];
  assigneeId: string | null;
  caseId: string | null;
  dueWindow: TaskDueWindow;
  assignedToMeOnly: boolean;
}

export interface TaskBoardColumn {
  status: Exclude<TaskStatus, "cancelled">;
  label: string;
  items: TaskItem[];
}

export interface TaskWorkspaceState {
  scope: TaskScope;
  viewMode: TaskViewMode;
  filters: TaskListFilters;
}

export interface TaskWorkspaceContext {
  tasks: TaskItem[];
  scope: TaskScope;
  caseId?: string;
  caseTitle?: string;
  canFilterByCase: boolean;
}

export interface TaskFormValues {
  title: string;
  description: string;
  caseId: string;
  assigneeName: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueAt: string;
}
