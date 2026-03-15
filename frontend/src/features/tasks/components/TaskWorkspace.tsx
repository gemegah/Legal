"use client";

import Link from "next/link";
import { useDeferredValue, useState, type FormEvent } from "react";

import {
  buildTaskBoard,
  defaultTaskFilters,
  filterTasks,
  getStatusLabel,
  moveTaskStatus,
} from "@/features/tasks/filtering";
import type {
  TaskDueWindow,
  TaskFormValues,
  TaskItem,
  TaskPriority,
  TaskScope,
  TaskStatus,
  TaskViewMode,
} from "@/features/tasks/types";
import { cn, formatDate, formatRelativeDate } from "@/lib/utils";

const statusOptions: TaskStatus[] = ["todo", "in_progress", "blocked", "done", "cancelled"];
const priorityOptions: TaskPriority[] = ["low", "medium", "high", "urgent"];
const dueFilterOptions: Array<{ value: TaskDueWindow; label: string }> = [
  { value: "all", label: "All dates" },
  { value: "overdue", label: "Overdue" },
  { value: "today", label: "Due today" },
  { value: "this_week", label: "This week" },
  { value: "future", label: "Future" },
  { value: "none", label: "No due date" },
];

interface BaseWorkspaceProps {
  initialTasks: TaskItem[];
  initialViewMode: TaskViewMode;
  initialScope: TaskScope;
  initialCaseId?: string | null;
  isCaseContext?: boolean;
  caseTitle?: string;
}

export function TasksWorkspaceClient({
  initialTasks,
  initialViewMode,
  initialScope,
  initialCaseId,
  isCaseContext = false,
}: BaseWorkspaceProps) {
  return (
    <TaskWorkspace
      initialTasks={initialTasks}
      initialViewMode={initialViewMode}
      initialScope={initialScope}
      initialCaseId={initialCaseId ?? null}
      isCaseContext={isCaseContext}
      canFilterByCase
      createLabel="New Task"
      emptyTitle="No tasks match the current filters."
      emptyCopy="Adjust the task filters or create a new case-linked task to refill the queue."
    />
  );
}

export function CaseTasksClient({
  initialTasks,
  initialViewMode,
  initialScope,
  initialCaseId,
  isCaseContext = true,
  caseTitle,
}: BaseWorkspaceProps) {
  return (
    <TaskWorkspace
      initialTasks={initialTasks}
      initialViewMode={initialViewMode}
      initialScope={initialScope}
      initialCaseId={initialCaseId ?? null}
      isCaseContext={isCaseContext}
      caseTitle={caseTitle}
      canFilterByCase={false}
      createLabel="Add Task"
      emptyTitle="No case tasks yet."
      emptyCopy="Create the first task for this case to start tracking assignments, due dates, and workflow status."
    />
  );
}

function TaskWorkspace({
  initialTasks,
  initialViewMode,
  initialScope,
  initialCaseId,
  isCaseContext = false,
  canFilterByCase,
  createLabel,
  emptyTitle,
  emptyCopy,
}: BaseWorkspaceProps & {
  canFilterByCase: boolean;
  createLabel: string;
  emptyTitle: string;
  emptyCopy: string;
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const [viewMode, setViewMode] = useState<TaskViewMode>(initialViewMode);
  const [scope, setScope] = useState<TaskScope>(initialScope);
  const [search, setSearch] = useState("");
  const [dueWindow, setDueWindow] = useState<TaskDueWindow>("all");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [selectedCaseId, setSelectedCaseId] = useState(initialCaseId ?? "");
  const [editorState, setEditorState] = useState<{
    mode: "create" | "edit";
    taskId: string | null;
    presetStatus?: TaskStatus;
  } | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const deferredSearch = useDeferredValue(search);

  const normalizedTasks = initialCaseId
    ? tasks.filter((task) => task.caseId === initialCaseId)
    : tasks;
  const availableCaseOptions = getCaseOptions(tasks);
  const filters = {
    ...defaultTaskFilters,
    search: deferredSearch,
    dueWindow,
    assignedToMeOnly: scope === "mine",
    caseId: selectedCaseId || null,
    statuses: statusFilter === "all" ? [] : [statusFilter],
  };
  const filteredTasks = filterTasks(canFilterByCase ? tasks : normalizedTasks, filters);
  const board = buildTaskBoard(filteredTasks);

  function handleCreateTask(presetStatus?: TaskStatus) {
    setEditorState({ mode: "create", taskId: null, presetStatus });
  }

  function handleEditTask(taskId: string) {
    setEditorState({ mode: "edit", taskId });
  }

  function handleSaveTask(values: TaskFormValues) {
    const caseOption = availableCaseOptions.find((option) => option.id === values.caseId);
    const nextTimestamp = new Date().toISOString();

    if (editorState?.mode === "edit" && editorState.taskId) {
      setTasks((current) =>
        current.map((task) => {
          if (task.id !== editorState.taskId) {
            return task;
          }

          return {
            ...task,
            title: values.title,
            description: values.description,
            caseId: values.caseId,
            caseReference: caseOption?.reference ?? task.caseReference,
            caseTitle: caseOption?.title ?? task.caseTitle,
            clientName: caseOption?.clientName ?? task.clientName,
            assigneeName: values.assigneeName.trim() || null,
            assigneeId: values.assigneeName.trim()
              ? slugify(values.assigneeName.trim())
              : null,
            status: values.status,
            priority: values.priority,
            dueAt: values.dueAt ? new Date(values.dueAt).toISOString() : null,
            completedAt:
              values.status === "done"
                ? task.completedAt ?? nextTimestamp
                : null,
            updatedAt: nextTimestamp,
            assignedToMe: isAssignedToCurrentUser(values.assigneeName),
          };
        }),
      );
    } else {
      const assigneeName = values.assigneeName.trim();

      setTasks((current) => [
        {
          id: `task-${Math.random().toString(36).slice(2, 10)}`,
          title: values.title,
          description: values.description,
          caseId: values.caseId,
          caseReference: caseOption?.reference ?? "CAS-NEW",
          caseTitle: caseOption?.title ?? "Unlinked case",
          clientName: caseOption?.clientName ?? "Case client",
          assigneeName: assigneeName || null,
          assigneeId: assigneeName ? slugify(assigneeName) : null,
          status: values.status,
          priority: values.priority,
          dueAt: values.dueAt ? new Date(values.dueAt).toISOString() : null,
          completedAt: values.status === "done" ? nextTimestamp : null,
          createdAt: nextTimestamp,
          updatedAt: nextTimestamp,
          assignedToMe: isAssignedToCurrentUser(assigneeName),
        },
        ...current,
      ]);
    }

    setEditorState(null);
  }

  function handleStatusChange(taskId: string, status: TaskStatus) {
    if (status === "cancelled") {
      setTasks((current) =>
        current.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status,
                completedAt: null,
                updatedAt: new Date().toISOString(),
              }
            : task,
        ),
      );

      return;
    }

    setTasks((current) => moveTaskStatus(current, taskId, status));
  }

  function handleTaskDrop(status: Exclude<TaskStatus, "cancelled">) {
    if (!draggedTaskId) {
      return;
    }

    setTasks((current) => moveTaskStatus(current, draggedTaskId, status));
    setDraggedTaskId(null);
  }

  const selectedTask =
    editorState && editorState.taskId
      ? tasks.find((task) => task.id === editorState.taskId) ?? null
      : null;

  return (
    <section className="task-workspace">
      <div className="surface-card task-workspace-panel">
        <TaskToolbar
          canFilterByCase={canFilterByCase}
          createLabel={createLabel}
          dueWindow={dueWindow}
          initialCaseId={initialCaseId ?? null}
          isCaseContext={isCaseContext}
          caseId={selectedCaseId || null}
          caseOptions={availableCaseOptions}
          onAssignedScope={() =>
            setScope((current) => (current === "mine" ? (isCaseContext ? "case" : "firm") : "mine"))
          }
          onCreateTask={() => handleCreateTask()}
          onDueWindowChange={setDueWindow}
          onCaseChange={setSelectedCaseId}
          onSearchChange={setSearch}
          onStatusFilterChange={setStatusFilter}
          onViewModeChange={setViewMode}
          scope={scope}
          search={search}
          statusFilter={statusFilter}
          viewMode={viewMode}
        />

        {viewMode === "list" ? (
          <TaskListTable
            canShowCase={!isCaseContext}
            emptyCopy={emptyCopy}
            emptyTitle={emptyTitle}
            onEdit={handleEditTask}
            onStatusChange={handleStatusChange}
            tasks={filteredTasks}
          />
        ) : (
          <TaskBoard
            board={board}
            emptyCopy={emptyCopy}
            emptyTitle={emptyTitle}
            onAddTask={handleCreateTask}
            onDragEnd={() => setDraggedTaskId(null)}
            onDragStart={setDraggedTaskId}
            onDropTask={handleTaskDrop}
            onEdit={handleEditTask}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>

      {editorState ? (
        <TaskEditorModal
          key={`${editorState.mode}-${editorState.taskId ?? "new"}-${editorState.presetStatus ?? "na"}`}
          availableCases={availableCaseOptions}
          lockedCaseId={isCaseContext ? initialCaseId ?? null : null}
          onClose={() => setEditorState(null)}
          onSave={handleSaveTask}
          preferredCaseId={selectedCaseId || initialCaseId || null}
          presetStatus={editorState.presetStatus}
          task={selectedTask}
        />
      ) : null}
    </section>
  );
}

function TaskToolbar({
  canFilterByCase,
  createLabel,
  dueWindow,
  initialCaseId,
  isCaseContext,
  caseId,
  caseOptions,
  onAssignedScope,
  onCreateTask,
  onDueWindowChange,
  onCaseChange,
  onSearchChange,
  onStatusFilterChange,
  onViewModeChange,
  scope,
  search,
  statusFilter,
  viewMode,
}: {
  canFilterByCase: boolean;
  createLabel: string;
  dueWindow: TaskDueWindow;
  initialCaseId: string | null;
  isCaseContext: boolean;
  caseId: string | null;
  caseOptions: CaseOption[];
  onAssignedScope: () => void;
  onCreateTask: () => void;
  onDueWindowChange: (value: TaskDueWindow) => void;
  onCaseChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: TaskStatus | "all") => void;
  onViewModeChange: (value: TaskViewMode) => void;
  scope: TaskScope;
  search: string;
  statusFilter: TaskStatus | "all";
  viewMode: TaskViewMode;
}) {
  return (
    <div className="task-toolbar-shell">
      <div className="task-toolbar-header">
        <h2 className="task-toolbar-title">
          {isCaseContext ? "Case Tasks" : "Tasks"}
        </h2>
        <div className="task-toolbar-header-actions">
          {isCaseContext && initialCaseId ? (
            <Link className="btn btn-ghost" href={`/tasks?case_id=${initialCaseId}`}>
              View All Tasks
            </Link>
          ) : null}
          <button
            aria-pressed={scope === "mine"}
            className={cn("task-chip-button", scope === "mine" && "is-active")}
            onClick={onAssignedScope}
            type="button"
          >
            Assigned to Me
          </button>
          <TaskViewToggle onChange={onViewModeChange} value={viewMode} />
          <button className="btn btn-primary" onClick={onCreateTask} type="button">
            + {createLabel}
          </button>
        </div>
      </div>

      <div className="task-status-tabs" role="tablist" aria-label="Filter by task status">
        <button
          aria-pressed={statusFilter === "all"}
          className={cn("task-status-tab", statusFilter === "all" && "is-active")}
          onClick={() => onStatusFilterChange("all")}
          type="button"
        >
          All
        </button>
        {statusOptions.map((status) => (
          <button
            aria-pressed={statusFilter === status}
            className={cn("task-status-tab", statusFilter === status && "is-active")}
            key={status}
            onClick={() => onStatusFilterChange(status)}
            type="button"
          >
            {getStatusLabel(status)}
          </button>
        ))}
      </div>

      <div className="task-toolbar-filters">
        <label className="case-search-field task-search-field" aria-label="Search tasks">
          <SearchIcon />
          <input
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search tasks, cases, clients, assignees"
            type="search"
            value={search}
          />
        </label>

        <label className="task-inline-select">
          <span>Due</span>
          <select
            onChange={(event) => onDueWindowChange(event.target.value as TaskDueWindow)}
            value={dueWindow}
          >
            {dueFilterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        {canFilterByCase ? (
          <label className="task-inline-select">
            <span>Case</span>
            <select onChange={(event) => onCaseChange(event.target.value)} value={caseId ?? ""}>
              <option value="">All cases</option>
              {caseOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.reference}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>
    </div>
  );
}

function TaskViewToggle({
  onChange,
  value,
}: {
  onChange: (value: TaskViewMode) => void;
  value: TaskViewMode;
}) {
  return (
    <div className="task-view-toggle" role="tablist" aria-label="Task view mode">
      {(["list", "kanban"] as TaskViewMode[]).map((mode) => (
        <button
          aria-pressed={value === mode}
          className={cn("task-view-button", value === mode && "is-active")}
          key={mode}
          onClick={() => onChange(mode)}
          type="button"
        >
          {mode === "list" ? "List View" : "Kanban"}
        </button>
      ))}
    </div>
  );
}

function TaskListTable({
  canShowCase,
  emptyCopy,
  emptyTitle,
  onEdit,
  onStatusChange,
  tasks,
}: {
  canShowCase: boolean;
  emptyCopy: string;
  emptyTitle: string;
  onEdit: (taskId: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  tasks: TaskItem[];
}) {
  if (tasks.length === 0) {
    return <TaskEmptyState copy={emptyCopy} title={emptyTitle} />;
  }

  return (
    <>
      <div className="task-table-desktop surface-card task-table-shell">
        <div
          className={cn(
            "task-table-head",
            canShowCase ? "is-global" : "is-case",
          )}
        >
          <span>Task</span>
          <span>Due</span>
          {canShowCase ? <span>Case</span> : null}
          <span>Assignee</span>
          <span>Status</span>
          <span>Priority</span>
          <span>Action</span>
        </div>

        <div className="task-table-body">
          {tasks.map((task) => (
            <TaskListRow
              canShowCase={canShowCase}
              key={task.id}
              onEdit={onEdit}
              onStatusChange={onStatusChange}
              task={task}
            />
          ))}
        </div>
      </div>

      <div className="task-card-stack">
        {tasks.map((task) => (
          <TaskCardListItem key={task.id} onEdit={onEdit} onStatusChange={onStatusChange} task={task} />
        ))}
      </div>
    </>
  );
}

function TaskListRow({
  canShowCase,
  onEdit,
  onStatusChange,
  task,
}: {
  canShowCase: boolean;
  onEdit: (taskId: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  task: TaskItem;
}) {
  return (
    <div className={cn("task-table-row", canShowCase ? "is-global" : "is-case")}>
      <div className="task-table-primary">
        <button className="task-inline-link" onClick={() => onEdit(task.id)} type="button">
          {task.title}
        </button>
        <p className="row-meta">{task.description}</p>
      </div>
      <TaskDueMeta task={task} />
      {canShowCase ? (
        <Link className="task-case-link" href={`/cases/${task.caseId}`}>
          <span className="table-ref">{task.caseReference}</span>
          <span className="row-meta">{task.caseTitle}</span>
        </Link>
      ) : null}
      <span className="table-copy">{task.assigneeName ?? "Unassigned"}</span>
      <TaskStatusSelect onChange={(status) => onStatusChange(task.id, status)} value={task.status} />
      <TaskPriorityBadge priority={task.priority} />
      <button className="task-action-link" onClick={() => onEdit(task.id)} type="button">
        Edit
      </button>
    </div>
  );
}

function TaskCardListItem({
  onEdit,
  onStatusChange,
  task,
}: {
  onEdit: (taskId: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  task: TaskItem;
}) {
  return (
    <div className="surface-card task-mobile-card">
      <div className="task-mobile-card-head">
        <div>
          <p className="table-ref">{task.caseReference}</p>
          <button className="task-inline-link" onClick={() => onEdit(task.id)} type="button">
            {task.title}
          </button>
        </div>
        <TaskPriorityBadge priority={task.priority} />
      </div>

      <p className="row-meta">{task.description}</p>

      <div className="task-mobile-card-grid">
        <TaskCardMeta label="Due" value={getDueLabel(task)} />
        <TaskCardMeta label="Assignee" value={task.assigneeName ?? "Unassigned"} />
        <TaskCardMeta label="Case" value={task.caseTitle} />
        <TaskCardMeta label="Client" value={task.clientName} />
      </div>

      <div className="task-mobile-card-actions">
        <TaskStatusSelect onChange={(status) => onStatusChange(task.id, status)} value={task.status} />
        <button className="btn btn-ghost" onClick={() => onEdit(task.id)} type="button">
          Edit
        </button>
      </div>
    </div>
  );
}

function TaskBoard({
  board,
  emptyCopy,
  emptyTitle,
  onAddTask,
  onDragEnd,
  onDragStart,
  onDropTask,
  onEdit,
  onStatusChange,
}: {
  board: ReturnType<typeof buildTaskBoard>;
  emptyCopy: string;
  emptyTitle: string;
  onAddTask: (presetStatus?: TaskStatus) => void;
  onDragEnd: () => void;
  onDragStart: (taskId: string) => void;
  onDropTask: (status: Exclude<TaskStatus, "cancelled">) => void;
  onEdit: (taskId: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}) {
  const hasVisibleTasks = board.some((column) => column.items.length > 0);

  if (!hasVisibleTasks) {
    return <TaskEmptyState copy={emptyCopy} title={emptyTitle} />;
  }

  return (
    <div className="task-board-shell">
      {board.map((column) => (
        <div
          className={cn("task-board-column", `is-${column.status}`)}
          key={column.status}
          onDragOver={(event) => event.preventDefault()}
          onDrop={() => onDropTask(column.status)}
        >
          <div className="task-board-column-head">
            <div>
              <p className="task-board-column-title">{column.label}</p>
              <p className="row-meta">{column.items.length} task(s)</p>
            </div>
            <button className="task-column-add" onClick={() => onAddTask(column.status)} type="button">
              + Add Task
            </button>
          </div>

          <div className="task-board-column-body">
            {column.items.length > 0 ? (
              column.items.map((task) => (
                <div
                  className="task-board-card"
                  draggable
                  key={task.id}
                  onDragEnd={onDragEnd}
                  onDragStart={() => onDragStart(task.id)}
                >
                  <div className="task-board-card-head">
                    <TaskPriorityBadge priority={task.priority} />
                    <button className="task-action-link" onClick={() => onEdit(task.id)} type="button">
                      Edit
                    </button>
                  </div>

                  <button className="task-inline-link task-board-card-title" onClick={() => onEdit(task.id)} type="button">
                    {task.title}
                  </button>
                  <p className="row-meta">{task.description}</p>

                  <Link className="task-board-case-link" href={`/cases/${task.caseId}`}>
                    {task.caseReference}  -  {task.caseTitle}
                  </Link>

                  <div className="task-board-card-meta">
                    <span>{task.assigneeName ?? "Unassigned"}</span>
                    <span>{getDueLabel(task)}</span>
                  </div>

                  <TaskStatusSelect onChange={(status) => onStatusChange(task.id, status)} value={task.status} />
                </div>
              ))
            ) : (
              <div className="task-board-empty">Drop tasks here or add a new one in this lane.</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function TaskStatusSelect({
  onChange,
  value,
}: {
  onChange: (status: TaskStatus) => void;
  value: TaskStatus;
}) {
  return (
    <label className={cn("task-status-select", `is-${value}`)}>
      <span className="sr-only">Update task status</span>
      <select onChange={(event) => onChange(event.target.value as TaskStatus)} value={value}>
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {getStatusLabel(status)}
          </option>
        ))}
      </select>
    </label>
  );
}

function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
  return <span className={cn("task-priority-badge", `is-${priority}`)}>{priority}</span>;
}

function TaskEmptyState({ copy, title }: { copy: string; title: string }) {
  return (
    <div className="task-empty-state">
      <h3 className="section-title">{title}</h3>
      <p className="placeholder-copy">{copy}</p>
    </div>
  );
}

function TaskEditorModal({
  availableCases,
  lockedCaseId,
  onClose,
  onSave,
  preferredCaseId,
  presetStatus,
  task,
}: {
  availableCases: CaseOption[];
  lockedCaseId: string | null;
  onClose: () => void;
  onSave: (values: TaskFormValues) => void;
  preferredCaseId: string | null;
  presetStatus?: TaskStatus;
  task: TaskItem | null;
}) {
  const initialValues: TaskFormValues = {
    title: task?.title ?? "",
    description: task?.description ?? "",
    caseId: lockedCaseId ?? task?.caseId ?? preferredCaseId ?? availableCases[0]?.id ?? "",
    assigneeName: task?.assigneeName ?? "",
    status: task?.status ?? presetStatus ?? "todo",
    priority: task?.priority ?? "medium",
    dueAt: task?.dueAt ? toLocalInputDate(task.dueAt) : "",
  };
  const [values, setValues] = useState<TaskFormValues>(initialValues);

  function update<K extends keyof TaskFormValues>(key: K, value: TaskFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!values.title.trim() || !values.caseId) {
      return;
    }

    onSave({
      ...values,
      title: values.title.trim(),
      description: values.description.trim(),
      assigneeName: values.assigneeName.trim(),
    });
  }

  return (
    <div className="task-modal-backdrop" role="presentation">
      <div aria-modal="true" className="task-modal" role="dialog" aria-labelledby="task-editor-title">
        <div className="task-modal-head">
          <div>
            <p className="eyebrow-label">{task ? "Edit task" : "Create task"}</p>
            <h3 className="case-title task-modal-title" id="task-editor-title">
              {task ? task.title : "Task Editor"}
            </h3>
          </div>
          <button className="task-modal-close" onClick={onClose} type="button" aria-label="Close">
            x
          </button>
        </div>

        <form className="task-form" onSubmit={handleSubmit}>
          <label className="task-form-field">
            <span>Title</span>
            <input
              onChange={(event) => update("title", event.target.value)}
              placeholder="Prepare filing, call client, review evidence..."
              value={values.title}
            />
          </label>

          <label className="task-form-field">
            <span>Description</span>
            <textarea
              onChange={(event) => update("description", event.target.value)}
              placeholder="Capture the exact next action and any important context."
              rows={4}
              value={values.description}
            />
          </label>

          {lockedCaseId ? (
            <div className="task-form-field">
              <span>Case</span>
              <div className="task-form-readonly">
                {availableCases.find((option) => option.id === values.caseId)?.title ?? "Current case"}
              </div>
            </div>
          ) : (
            <label className="task-form-field">
              <span>Case</span>
              <select onChange={(event) => update("caseId", event.target.value)} value={values.caseId}>
                {availableCases.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.reference}  -  {option.title}
                  </option>
                ))}
              </select>
            </label>
          )}

          <div className="task-form-grid">
            <label className="task-form-field">
              <span>Assignee</span>
              <input
                onChange={(event) => update("assigneeName", event.target.value)}
                placeholder="Kwame Boateng"
                value={values.assigneeName}
              />
            </label>

            <label className="task-form-field">
              <span>Due date</span>
              <input
                onChange={(event) => update("dueAt", event.target.value)}
                type="datetime-local"
                value={values.dueAt}
              />
            </label>
          </div>

          <div className="task-form-grid">
            <label className="task-form-field">
              <span>Status</span>
              <select onChange={(event) => update("status", event.target.value as TaskStatus)} value={values.status}>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {getStatusLabel(status)}
                  </option>
                ))}
              </select>
            </label>

            <label className="task-form-field">
              <span>Priority</span>
              <select
                onChange={(event) => update("priority", event.target.value as TaskPriority)}
                value={values.priority}
              >
                {priorityOptions.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="task-form-actions">
            <button className="btn btn-ghost" onClick={onClose} type="button">
              Cancel
            </button>
            <button className="btn btn-primary" type="submit">
              {task ? "Save Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TaskDueMeta({ task }: { task: TaskItem }) {
  const tone = getDueTone(task);

  return (
    <div className="task-due-meta">
      <span className={cn("task-due-label", `is-${tone}`)}>{getDueLabel(task)}</span>
      <span className="row-meta">{task.dueAt ? formatDate(task.dueAt) : "No due date"}</span>
    </div>
  );
}

function TaskCardMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="task-card-meta">
      <p>{label}</p>
      <span>{value}</span>
    </div>
  );
}

function getDueLabel(task: TaskItem): string {
  if (!task.dueAt) {
    return "No due date";
  }

  if (task.status === "done" && task.completedAt) {
    return `Completed ${formatRelativeDate(task.completedAt)}`;
  }

  return formatRelativeDate(task.dueAt);
}

function getDueTone(task: TaskItem): "default" | "warning" | "danger" | "success" {
  if (!task.dueAt) {
    return "default";
  }

  if (task.status === "done") {
    return "success";
  }

  const now = new Date();
  const due = new Date(task.dueAt);
  const diffDays = Math.round((due.getTime() - now.getTime()) / 86400000);

  if (diffDays < 0) {
    return "danger";
  }

  if (diffDays <= 2) {
    return "warning";
  }

  return "default";
}

function getCaseOptions(tasks: TaskItem[]): CaseOption[] {
  const map = new Map<string, CaseOption>();

  tasks.forEach((task) => {
    if (!map.has(task.caseId)) {
      map.set(task.caseId, {
        id: task.caseId,
        reference: task.caseReference,
        title: task.caseTitle,
        clientName: task.clientName,
      });
    }
  });

  return Array.from(map.values());
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function isAssignedToCurrentUser(assigneeName: string): boolean {
  return assigneeName.trim().toLowerCase() === "kwame boateng";
}

function toLocalInputDate(value: string): string {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" x2="16.65" y1="21" y2="16.65" />
    </svg>
  );
}

interface CaseOption {
  id: string;
  reference: string;
  title: string;
  clientName: string;
}
