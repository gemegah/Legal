import { MessagesWorkspaceClient } from "@/features/messages/components/MessagesWorkspaceClient";
import { getMessagesWorkspace } from "@/features/messages/server/queries";

export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await getMessagesWorkspace();

  return <MessagesWorkspaceClient initialData={data} />;
}
