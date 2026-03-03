import { MatterTasksClient } from "@/features/tasks/components/TaskWorkspace";
import { getTasksByMatter } from "@/features/tasks/server/queries";
import type { TaskViewMode } from "@/features/tasks/types";
import { getMatterById } from "@/features/matters/server/queries";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    id: string;
  };
  searchParams?: {
    view?: string;
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  const [{ tasks }, matter] = await Promise.all([
    getTasksByMatter(params.id),
    getMatterById(params.id),
  ]);

  return (
    <MatterTasksClient
      initialMatterId={params.id}
      initialScope="matter"
      initialTasks={tasks}
      initialViewMode={getInitialViewMode(searchParams?.view)}
      matterTitle={matter?.title}
    />
  );
}

function getInitialViewMode(value?: string): TaskViewMode {
  return value === "kanban" ? "kanban" : "list";
}
