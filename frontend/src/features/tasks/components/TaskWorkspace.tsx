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

const statusOptions: TaskStatus[] = [
  "todo",
  "in_progress",
  "blocked",
  "done",
  "cancelled",
];
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
  initialMatterId?: string | null;
  isMatterContext?: boolean;
  matterTitle?: string;
}

export function TasksWorkspaceClient({
  initialTasks,
  initialViewMode,
  initialScope,
  initialMatterId,
  isMatterContext = false,
}: BaseWorkspaceProps) {
  return (
    <TaskWorkspace
      initialTasks={initialTasks}
      initialViewMode={initialViewMode}
      initialScope={initialScope}
      initialMatterId={initialMatterId ?? null}
      isMatterContext={isMatterContext}
      canFilterByMatter
      createLabel="New Task"
      emptyTitle="No tasks match the current filters."
      emptyCopy="Adjust the task filters or create a new matter-linked task to refill the queue."
      onSearchChange={function (value: string): void {
        throw new Error("Function not implemented.");
      }}
    />
  );
}

export function MatterTasksClient({
  initialTasks,
  initialViewMode,
  initialScope,
  initialMatterId,
  isMatterContext = true,
  matterTitle,
}: BaseWorkspaceProps) {
  return (
    <TaskWorkspace
      initialTasks={initialTasks}
      initialViewMode={initialViewMode}
      initialScope={initialScope}
      initialMatterId={initialMatterId ?? null}
      isMatterContext={isMatterContext}
      matterTitle={matterTitle}
      canFilterByMatter={false}
      createLabel="Add Task"
      emptyTitle="No matter tasks yet."
      emptyCopy="Create the first task for this matter to start tracking assignments, due dates, and workflow status."
      onSearchChange={function (value: string): void {
        throw new Error("Function not implemented.");
      }}
    />
  );
}

function TaskWorkspace({
  initialTasks,
  initialViewMode,
  initialScope,
  initialMatterId,
  isMatterContext = false,
  matterTitle,
  onSearchChange,
  canFilterByMatter,
  createLabel,
  emptyTitle,
  emptyCopy,
}: BaseWorkspaceProps & {
  canFilterByMatter: boolean;
  createLabel: string;
  emptyTitle: string;
  emptyCopy: string;
  onSearchChange: (value: string) => void;
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const [viewMode, setViewMode] = useState<TaskViewMode>(initialViewMode);
  const [scope, setScope] = useState<TaskScope>(initialScope);
  const [search, setSearch] = useState("");
  const [dueWindow, setDueWindow] = useState<TaskDueWindow>("all");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [selectedMatterId, setSelectedMatterId] = useState(
    initialMatterId ?? "",
  );
  const [editorState, setEditorState] = useState<{
    mode: "create" | "edit";
    taskId: string | null;
    presetStatus?: TaskStatus;
  } | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const deferredSearch = useDeferredValue(search);

  const normalizedTasks = initialMatterId
    ? tasks.filter((task) => task.matterId === initialMatterId)
    : tasks;
  const availableMatterOptions = getMatterOptions(tasks);
  const filters = {
    ...defaultTaskFilters,
    search: deferredSearch,
    dueWindow,
    assignedToMeOnly: scope === "mine",
    matterId: selectedMatterId || null,
    statuses: statusFilter === "all" ? [] : [statusFilter],
  };
  const filteredTasks = filterTasks(
    canFilterByMatter ? tasks : normalizedTasks,
    filters,
  );
  const board = buildTaskBoard(filteredTasks);

  function handleCreateTask(presetStatus?: TaskStatus) {
    setEditorState({ mode: "create", taskId: null, presetStatus });
  }

  function handleEditTask(taskId: string) {
    setEditorState({ mode: "edit", taskId });
  }

  function handleSaveTask(values: TaskFormValues) {
    const matterOption = availableMatterOptions.find(
      (option) => option.id === values.matterId,
    );
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
            matterId: values.matterId,
            matterReference: matterOption?.reference ?? task.matterReference,
            matterTitle: matterOption?.title ?? task.matterTitle,
            clientName: matterOption?.clientName ?? task.clientName,
            assigneeName: values.assigneeName.trim() || null,
            assigneeId: values.assigneeName.trim()
              ? slugify(values.assigneeName.trim())
              : null,
            status: values.status,
            priority: values.priority,
            dueAt: values.dueAt ? new Date(values.dueAt).toISOString() : null,
            completedAt:
              values.status === "done"
                ? (task.completedAt ?? nextTimestamp)
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
          matterId: values.matterId,
          matterReference: matterOption?.reference ?? "MAT-NEW",
          matterTitle: matterOption?.title ?? "Unlinked matter",
          clientName: matterOption?.clientName ?? "Matter client",
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
      ? (tasks.find((task) => task.id === editorState.taskId) ?? null)
      : null;

  return (
    <section className="task-workspace">
      {/* <div className="task-workspace-hero-copy">
          <p className="eyebrow-label">
            {isMatterContext ? "Matter Task Coordination" : "Practitioner Task Queue"}
          </p>
          <h2 className="matter-title">{isMatterContext ? "Matter Tasks" : "Tasks"}</h2>
          <p className="task-workspace-copy">
            {isMatterContext
              ? `Manage assignments, due dates, and progress for ${matterTitle ?? "this matter"} without leaving the matter workspace.`
              : "Manage matter-linked work across the firm, with a list-first queue and a board for flow management."}
          </p>
        </div> */}

      {/* <div className="task-workspace-actions">
          {isMatterContext && initialMatterId ? (
            <Link className="btn btn-ghost" href={`/tasks?matter_id=${initialMatterId}`}>
              View All Tasks
            </Link>
          ) : null}
        </div> */}
      <div style={{ display: 'flex'}}>
        <label
          className="matter-search-field task-search-field"
          aria-label="Search tasks"
        >
          <SearchIcon />
          <input
          style={{backgroundColor: '#ffffff'}}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search tasks, matters, clients, assignees"
            type="search"
            value={search}
          />
        </label>
        <button
          className="btn btn-primary"
          style={{ width: "fit-content", alignSelf: "end" }}
          onClick={() => handleCreateTask()}
          type="button"
        >
          + {createLabel}
        </button>
      </div>

      <div className="surface-card task-workspace-panel">
        <TaskToolbar
          canFilterByMatter={canFilterByMatter}
          createLabel={createLabel}
          dueWindow={dueWindow}
          matterId={selectedMatterId || null}
          matterOptions={availableMatterOptions}
          onAssignedScope={() =>
            setScope((current) =>
              current === "mine"
                ? isMatterContext
                  ? "matter"
                  : "firm"
                : "mine",
            )
          }
          onDueWindowChange={setDueWindow}
          onMatterChange={setSelectedMatterId}
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
            canShowMatter={!isMatterContext}
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
          availableMatters={availableMatterOptions}
          lockedMatterId={isMatterContext ? (initialMatterId ?? null) : null}
          onClose={() => setEditorState(null)}
          onSave={handleSaveTask}
          preferredMatterId={selectedMatterId || initialMatterId || null}
          presetStatus={editorState.presetStatus}
          task={selectedTask}
        />
      ) : null}
    </section>
  );
}

function TaskToolbar({
  canFilterByMatter,
  createLabel,
  dueWindow,
  matterId,
  matterOptions,
  onAssignedScope,
  onDueWindowChange,
  onMatterChange,
  onSearchChange,
  onStatusFilterChange,
  onViewModeChange,
  scope,
  search,
  statusFilter,
  viewMode,
}: {
  canFilterByMatter: boolean;
  createLabel: string;
  dueWindow: TaskDueWindow;
  matterId: string | null;
  matterOptions: MatterOption[];
  onAssignedScope: () => void;
  onDueWindowChange: (value: TaskDueWindow) => void;
  onMatterChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: TaskStatus | "all") => void;
  onViewModeChange: (value: TaskViewMode) => void;
  scope: TaskScope;
  search: string;
  statusFilter: TaskStatus | "all";
  viewMode: TaskViewMode;
}) {
  return (
    <div
      className="task-toolbar-shell"
      style={{ justifyContent: "space-between" }}
    >
      <div className="task-toolbar-top">
        <TaskViewToggle onChange={onViewModeChange} value={viewMode} />

        <div className="task-toolbar-actions">
          <button
            aria-pressed={scope === "mine"}
            className={cn("task-chip-button", scope === "mine" && "is-active")}
            onClick={onAssignedScope}
            type="button"
          >
            Assigned to Me
          </button>
        </div>
      </div>

      <div
        className="task-toolbar-filters"
        style={{ gap: 8, justifyContent: "space-between" }}
      >
        {/* <label className="matter-search-field task-search-field" aria-label="Search tasks">
          <SearchIcon />
          <input
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search tasks, matters, clients, assignees"
            type="search"
            value={search}
          />
        </label> */}

        <label className="task-inline-select">
          <span>Status</span>
          <select
            onChange={(event) =>
              onStatusFilterChange(event.target.value as TaskStatus | "all")
            }
            value={statusFilter}
          >
            <option value="all">All statuses</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {getStatusLabel(status)}
              </option>
            ))}
          </select>
        </label>
        <label className="task-inline-select">
          <span>Due</span>
          <select
            onChange={(event) =>
              onDueWindowChange(event.target.value as TaskDueWindow)
            }
            value={dueWindow}
          >
            {dueFilterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        {canFilterByMatter ? (
          <label className="task-inline-select">
            <span>Matter</span>
            <select
              onChange={(event) => onMatterChange(event.target.value)}
              value={matterId ?? ""}
            >
              <option value="">All matters</option>
              {matterOptions.map((option) => (
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
    <div
      className="task-view-toggle"
      role="tablist"
      aria-label="Task view mode"
    >
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
  canShowMatter,
  emptyCopy,
  emptyTitle,
  onEdit,
  onStatusChange,
  tasks,
}: {
  canShowMatter: boolean;
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
            canShowMatter ? "is-global" : "is-matter",
          )}
        >
          <span>Task</span>
          <span>Due</span>
          {canShowMatter ? <span>Matter</span> : null}
          <span>Assignee</span>
          <span>Status</span>
          <span>Priority</span>
          <span>Action</span>
        </div>

        <div className="task-table-body">
          {tasks.map((task) => (
            <TaskListRow
              canShowMatter={canShowMatter}
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
          <TaskCardListItem
            key={task.id}
            onEdit={onEdit}
            onStatusChange={onStatusChange}
            task={task}
          />
        ))}
      </div>
    </>
  );
}

function TaskListRow({
  canShowMatter,
  onEdit,
  onStatusChange,
  task,
}: {
  canShowMatter: boolean;
  onEdit: (taskId: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  task: TaskItem;
}) {
  return (
    <div
      className={cn(
        "task-table-row",
        canShowMatter ? "is-global" : "is-matter",
      )}
    >
      <div className="task-table-primary">
        <button
          className="task-inline-link"
          onClick={() => onEdit(task.id)}
          type="button"
        >
          {task.title}
        </button>
        <p className="row-meta">{task.description}</p>
      </div>
      <TaskDueMeta task={task} />
      {canShowMatter ? (
        <Link className="task-matter-link" href={`/matters/${task.matterId}`}>
          <span className="table-ref">{task.matterReference}</span>
          <span className="row-meta">{task.matterTitle}</span>
        </Link>
      ) : null}
      <span className="table-copy">{task.assigneeName ?? "Unassigned"}</span>
      <TaskStatusSelect
        onChange={(status) => onStatusChange(task.id, status)}
        value={task.status}
      />
      <TaskPriorityBadge priority={task.priority} />
      <button
        className="task-action-link"
        onClick={() => onEdit(task.id)}
        type="button"
      >
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
          <p className="table-ref">{task.matterReference}</p>
          <button
            className="task-inline-link"
            onClick={() => onEdit(task.id)}
            type="button"
          >
            {task.title}
          </button>
        </div>
        <TaskPriorityBadge priority={task.priority} />
      </div>

      <p className="row-meta">{task.description}</p>

      <div className="task-mobile-card-grid">
        <TaskCardMeta label="Due" value={getDueLabel(task)} />
        <TaskCardMeta
          label="Assignee"
          value={task.assigneeName ?? "Unassigned"}
        />
        <TaskCardMeta label="Matter" value={task.matterTitle} />
        <TaskCardMeta label="Client" value={task.clientName} />
      </div>

      <div className="task-mobile-card-actions">
        <TaskStatusSelect
          onChange={(status) => onStatusChange(task.id, status)}
          value={task.status}
        />
        <button
          className="btn btn-ghost"
          onClick={() => onEdit(task.id)}
          type="button"
        >
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
            <button
              className="task-column-add"
              onClick={() => onAddTask(column.status)}
              type="button"
            >
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
                    <button
                      className="task-action-link"
                      onClick={() => onEdit(task.id)}
                      type="button"
                    >
                      Edit
                    </button>
                  </div>

                  <button
                    className="task-inline-link task-board-card-title"
                    onClick={() => onEdit(task.id)}
                    type="button"
                  >
                    {task.title}
                  </button>
                  <p className="row-meta">{task.description}</p>

                  <Link
                    className="task-board-matter-link"
                    href={`/matters/${task.matterId}`}
                  >
                    {task.matterReference} · {task.matterTitle}
                  </Link>

                  <div className="task-board-card-meta">
                    <span>{task.assigneeName ?? "Unassigned"}</span>
                    <span>{getDueLabel(task)}</span>
                  </div>

                  <TaskStatusSelect
                    onChange={(status) => onStatusChange(task.id, status)}
                    value={task.status}
                  />
                </div>
              ))
            ) : (
              <div className="task-board-empty">
                Drop tasks here or add a new one in this lane.
              </div>
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
      <select
        onChange={(event) => onChange(event.target.value as TaskStatus)}
        value={value}
      >
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
  return (
    <span className={cn("task-priority-badge", `is-${priority}`)}>
      {priority}
    </span>
  );
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
  availableMatters,
  lockedMatterId,
  onClose,
  onSave,
  preferredMatterId,
  presetStatus,
  task,
}: {
  availableMatters: MatterOption[];
  lockedMatterId: string | null;
  onClose: () => void;
  onSave: (values: TaskFormValues) => void;
  preferredMatterId: string | null;
  presetStatus?: TaskStatus;
  task: TaskItem | null;
}) {
  const initialValues: TaskFormValues = {
    title: task?.title ?? "",
    description: task?.description ?? "",
    matterId:
      lockedMatterId ??
      task?.matterId ??
      preferredMatterId ??
      availableMatters[0]?.id ??
      "",
    assigneeName: task?.assigneeName ?? "",
    status: task?.status ?? presetStatus ?? "todo",
    priority: task?.priority ?? "medium",
    dueAt: task?.dueAt ? toLocalInputDate(task.dueAt) : "",
  };
  const [values, setValues] = useState<TaskFormValues>(initialValues);

  function update<K extends keyof TaskFormValues>(
    key: K,
    value: TaskFormValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!values.title.trim() || !values.matterId) {
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
      <div
        aria-modal="true"
        className="task-modal"
        role="dialog"
        aria-labelledby="task-editor-title"
      >
        <div className="task-modal-head">
          <div>
            <p className="eyebrow-label">
              {task ? "Edit task" : "Create task"}
            </p>
            <h3
              className="matter-title task-modal-title"
              id="task-editor-title"
            >
              {task ? task.title : "Task Editor"}
            </h3>
          </div>
          <button
            className="task-modal-close"
            onClick={onClose}
            type="button"
            aria-label="Close"
          >
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

          {lockedMatterId ? (
            <div className="task-form-field">
              <span>Matter</span>
              <div className="task-form-readonly">
                {availableMatters.find(
                  (option) => option.id === values.matterId,
                )?.title ?? "Current matter"}
              </div>
            </div>
          ) : (
            <label className="task-form-field">
              <span>Matter</span>
              <select
                onChange={(event) => update("matterId", event.target.value)}
                value={values.matterId}
              >
                {availableMatters.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.reference} · {option.title}
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
              <select
                onChange={(event) =>
                  update("status", event.target.value as TaskStatus)
                }
                value={values.status}
              >
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
                onChange={(event) =>
                  update("priority", event.target.value as TaskPriority)
                }
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
      <span className={cn("task-due-label", `is-${tone}`)}>
        {getDueLabel(task)}
      </span>
      <span className="row-meta">
        {task.dueAt ? formatDate(task.dueAt) : "No due date"}
      </span>
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

function getDueTone(
  task: TaskItem,
): "default" | "warning" | "danger" | "success" {
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

function getMatterOptions(tasks: TaskItem[]): MatterOption[] {
  const map = new Map<string, MatterOption>();

  tasks.forEach((task) => {
    if (!map.has(task.matterId)) {
      map.set(task.matterId, {
        id: task.matterId,
        reference: task.matterReference,
        title: task.matterTitle,
        clientName: task.clientName,
      });
    }
  });

  return Array.from(map.values());
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
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

interface MatterOption {
  id: string;
  reference: string;
  title: string;
  clientName: string;
}
