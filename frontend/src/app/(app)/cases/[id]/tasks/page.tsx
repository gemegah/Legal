import { CaseTasksClient } from "@/features/tasks/components/TaskWorkspace";
import { getTasksByCase } from "@/features/tasks/server/queries";
import type { TaskViewMode } from "@/features/tasks/types";
import { getCaseById } from "@/features/cases/server/queries";

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
  const [{ tasks }, caseDetail] = await Promise.all([
    getTasksByCase(params.id),
    getCaseById(params.id),
  ]);

  return (
    <CaseTasksClient
      initialCaseId={params.id}
      initialScope="case"
      initialTasks={tasks}
      initialViewMode={getInitialViewMode(searchParams?.view)}
      caseTitle={caseDetail?.title}
    />
  );
}

function getInitialViewMode(value?: string): TaskViewMode {
  return value === "kanban" ? "kanban" : "list";
}
