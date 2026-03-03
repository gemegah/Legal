import { TasksWorkspaceClient } from "@/features/tasks/components/TaskWorkspace";
import { getTaskWorkspace } from "@/features/tasks/server/queries";
import type { TaskScope, TaskViewMode } from "@/features/tasks/types";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams?: {
    matter_id?: string;
    scope?: string;
    view?: string;
  };
}

export default async function Page({ searchParams }: PageProps) {
  const { tasks } = await getTaskWorkspace();
  const initialViewMode = getInitialViewMode(searchParams?.view);
  const initialScope = getInitialScope(searchParams?.scope);

  return (
    <TasksWorkspaceClient
      initialMatterId={searchParams?.matter_id ?? null}
      initialScope={initialScope}
      initialTasks={tasks}
      initialViewMode={initialViewMode}
    />
  );
}

function getInitialViewMode(value?: string): TaskViewMode {
  return value === "kanban" ? "kanban" : "list";
}

function getInitialScope(value?: string): TaskScope {
  return value === "mine" ? "mine" : "firm";
}
