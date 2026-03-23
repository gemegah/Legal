"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type {
  MessageThreadDetail,
  MessagesWorkspaceData,
  MessageThreadStatus,
  MessageThreadType,
  MessageVisibility,
} from "@/features/messages/types";
import { cn, formatDateTime, formatRelativeDate } from "@/lib/utils";

type QueueFilter = "unread" | "internal" | "client" | "needs_reply" | "archived";

interface ThreadDraft {
  body: string;
  visibility: MessageVisibility;
}

interface NewThreadState {
  type: MessageThreadType;
  subject: string;
  caseId: string;
  assigneeId: string;
  body: string;
}

const emptyDraft: ThreadDraft = {
  body: "",
  visibility: "internal_only",
};

export function MessagesWorkspaceClient({ initialData }: { initialData: MessagesWorkspaceData }) {
  const [threads, setThreads] = useState(initialData.threads);
  const [queue, setQueue] = useState<QueueFilter>("unread");
  const [query, setQuery] = useState("");
  const [caseFilter, setCaseFilter] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(initialData.threads[0]?.id ?? null);
  const [drafts, setDrafts] = useState<Record<string, ThreadDraft>>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [newThreadState, setNewThreadState] = useState<NewThreadState>({
    type: "internal",
    subject: "",
    caseId: "",
    assigneeId: initialData.assigneeOptions[0]?.value ?? "",
    body: "",
  });

  const filteredThreads = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return threads
      .filter((thread) => {
        if (queue === "unread" && thread.unreadCount === 0) return false;
        if (queue === "internal" && (thread.type !== "internal" || thread.status === "archived")) return false;
        if (queue === "client" && (thread.type !== "client" || thread.status === "archived")) return false;
        if (queue === "needs_reply" && thread.status !== "waiting_on_firm") return false;
        if (queue === "archived" && thread.status !== "archived") return false;
        if (caseFilter && thread.caseId !== caseFilter) return false;
        if (assigneeFilter && thread.assigneeId !== assigneeFilter) return false;
        if (!normalizedQuery) return true;
        return [
          thread.subject,
          thread.lastMessagePreview,
          thread.caseLabel ?? "",
          ...thread.participants.map((participant) => participant.name),
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .sort((left, right) => Date.parse(right.lastMessageAt) - Date.parse(left.lastMessageAt));
  }, [assigneeFilter, caseFilter, query, queue, threads]);

  const selectedThread = filteredThreads.find((thread) => thread.id === selectedThreadId) ?? filteredThreads[0] ?? null;
  const draft = selectedThread ? drafts[selectedThread.id] ?? defaultDraftForThread(selectedThread) : emptyDraft;

  useEffect(() => {
    if (!selectedThread && filteredThreads[0]) {
      setSelectedThreadId(filteredThreads[0].id);
    }
  }, [filteredThreads, selectedThread]);

  function selectThread(thread: MessageThreadDetail) {
    setSelectedThreadId(thread.id);
  }

  function updateDraft(next: Partial<ThreadDraft>) {
    if (!selectedThread) return;
    setDrafts((current) => ({
      ...current,
      [selectedThread.id]: {
        ...(current[selectedThread.id] ?? defaultDraftForThread(selectedThread)),
        ...next,
      },
    }));
  }

  function handleReply() {
    if (!selectedThread || !draft.body.trim()) {
      return;
    }

    const now = new Date().toISOString();
    setThreads((current) =>
      current.map((thread) =>
        thread.id === selectedThread.id
          ? {
              ...thread,
              status: thread.type === "client" && draft.visibility === "client_visible" ? "waiting_on_client" : "open",
              unreadCount: 0,
              lastMessageAt: now,
              lastMessagePreview: draft.body.trim(),
              messages: [
                ...thread.messages,
                {
                  id: `msg-${Math.random().toString(36).slice(2, 10)}`,
                  threadId: thread.id,
                  authorId: "usr-kwame",
                  authorName: "Kwame Boateng",
                  authorRole: "admin",
                  body: draft.body.trim(),
                  createdAt: now,
                  attachments: [],
                  visibility: draft.visibility,
                  deliveryState: "sent",
                },
              ],
            }
          : thread,
      ),
    );
    setDrafts((current) => ({ ...current, [selectedThread.id]: defaultDraftForThread(selectedThread) }));
    setFeedback(selectedThread.type === "client" && draft.visibility === "client_visible" ? "Client-safe update sent." : "Reply added to thread.");
  }

  function handleSaveDraft() {
    if (!selectedThread) return;
    setFeedback(`Draft saved for "${selectedThread.subject}".`);
  }

  function handleThreadMeta(threadId: string, patch: Partial<Pick<MessageThreadDetail, "assigneeId" | "caseId" | "status" | "portalSafe" | "unreadCount">>) {
    setThreads((current) =>
      current.map((thread) =>
        thread.id === threadId
          ? {
              ...thread,
              ...patch,
              caseLabel:
                patch.caseId !== undefined
                  ? initialData.caseOptions.find((option) => option.value === patch.caseId)?.label ?? null
                  : thread.caseLabel,
            }
          : thread,
      ),
    );
  }

  function openNewThread(type: MessageThreadType) {
    setNewThreadState({
      type,
      subject: "",
      caseId: "",
      assigneeId: initialData.assigneeOptions[0]?.value ?? "",
      body: "",
    });
    setComposerOpen(true);
  }

  function handleCreateThread(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newThreadState.subject.trim() || !newThreadState.body.trim()) {
      setFeedback("Add a subject and opening message before creating a thread.");
      return;
    }
    const now = new Date().toISOString();
    const threadId = `thr-${Math.random().toString(36).slice(2, 10)}`;
    const newThread: MessageThreadDetail = {
      id: threadId,
      caseId: newThreadState.caseId || null,
      caseLabel:
        initialData.caseOptions.find((option) => option.value === newThreadState.caseId)?.label ?? null,
      type: newThreadState.type,
      subject: newThreadState.subject.trim(),
      participants: [
        { id: "usr-kwame", name: "Kwame Boateng", role: "admin" },
        ...(newThreadState.type === "client"
          ? [{ id: "usr-client-new", name: "Client participant", role: "client" as const }]
          : []),
      ],
      lastMessageAt: now,
      lastMessagePreview: newThreadState.body.trim(),
      unreadCount: 0,
      assigneeId: newThreadState.assigneeId || null,
      status: "open",
      portalSafe: newThreadState.type === "client",
      channel: newThreadState.type === "client" ? "portal" : "in_app",
      linkedDocumentLabels: [],
      messages: [
        {
          id: `msg-${Math.random().toString(36).slice(2, 10)}`,
          threadId,
          authorId: "usr-kwame",
          authorName: "Kwame Boateng",
          authorRole: "admin",
          body: newThreadState.body.trim(),
          createdAt: now,
          attachments: [],
          visibility: newThreadState.type === "client" ? "client_visible" : "internal_only",
          deliveryState: "sent",
        },
      ],
    };
    setThreads((current) => [newThread, ...current]);
    setSelectedThreadId(newThread.id);
    setComposerOpen(false);
    setQueue(newThread.type === "client" ? "client" : "internal");
    setFeedback(`Created "${newThread.subject}".`);
  }

  return (
    <section className="messages-workspace">

        {/* <div className="messages-hero-copy">
          <p className="eyebrow-label">Message Center</p>
          <h2 className="case-title">Internal and client-facing communication in one queue</h2>
          <p className="placeholder-copy">
            Keep internal coordination separate from portal-safe updates while preserving case context, assignee ownership, and unread routing.
          </p>
        </div> */}
        <div className="messages-hero-actions" style={{alignSelf: 'end'}}>
          <Button onClick={() => openNewThread("internal")} variant="ghost">
            New Internal Thread
          </Button>
          <Button onClick={() => openNewThread("client")}>New Client Update</Button>
        </div>


      {feedback ? <div className="messages-feedback">{feedback}</div> : null}

      <div className="messages-shell">
        <div className="surface-card messages-rail">
          <div className="messages-rail-group">
            <h3 className="section-title">Queues</h3>
            <div className="messages-queue-list">
              {([
                ["unread", "Unread"],
                ["internal", "Internal"],
                ["client", "Client"],
                ["needs_reply", "Needs Reply"],
                ["archived", "Archived"],
              ] as Array<[QueueFilter, string]>).map(([value, label]) => (
                <button
                  className={cn("messages-queue-button", queue === value && "is-active")}
                  key={value}
                  onClick={() => setQueue(value)}
                  type="button"
                >
                  <span>{label}</span>
                  <span className="messages-queue-count">{countThreads(threads, value)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="messages-rail-group">
            <h3 className="section-title">Filters</h3>
            <label className="messages-field">
              <span>Search</span>
              <input onChange={(event) => setQuery(event.target.value)} placeholder="Subject, participant, case..." value={query} />
            </label>
            <label className="messages-field">
              <span>Case</span>
              <select onChange={(event) => setCaseFilter(event.target.value)} value={caseFilter}>
                <option value="">All cases</option>
                {initialData.caseOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="messages-field">
              <span>Assignee</span>
              <select onChange={(event) => setAssigneeFilter(event.target.value)} value={assigneeFilter}>
                <option value="">All assignees</option>
                {initialData.assigneeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      {feedback ? <div className="messages-feedback">{feedback}</div> : null}

      <div className="messages-shell">
        <div className="surface-card messages-list-panel">
          {filteredThreads.length === 0 ? (
            <div className="empty-state">
              No threads match the current queue and filters. Switch queues or create a new thread from the hero actions.
            </div>
          ) : (
            <div className="messages-thread-list">
              {filteredThreads.map((thread) => (
                <button
                  className={cn("messages-thread-row", selectedThread?.id === thread.id && "is-selected")}
                  key={thread.id}
                  onClick={() => selectThread(thread)}
                  type="button"
                >
                  <span className="messages-thread-avatar">{initialsForName(thread.participants[0]?.name ?? "")}</span>
                  <div className="messages-thread-body">
                    <div className="messages-thread-head">
                      <p className="messages-thread-title">{thread.subject}</p>
                      <span className="messages-thread-time">{formatRelativeDate(thread.lastMessageAt)}</span>
                    </div>
                    <span className="row-meta">{formatRelativeDate(thread.lastMessageAt)}</span>
                  </div>
                  <p className="messages-thread-preview">{thread.lastMessagePreview}</p>
                  <div className="messages-thread-meta">
                    <span>{thread.caseLabel ?? "No case linked"}</span>
                    <span>{thread.participants.map((participant) => participant.name).join(", ")}</span>
                    {thread.unreadCount > 0 ? <span className="messages-unread-pill">{thread.unreadCount} unread</span> : null}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="surface-card messages-detail-panel">
          {selectedThread ? (
            <>
              <div className="messages-detail-head">
                <div>
                  <p className="eyebrow-label">{selectedThread.type === "client" ? "Client Thread" : "Internal Thread"}</p>
                  <h3 className="section-title">{selectedThread.subject}</h3>
                  <div className="messages-thread-badges">
                    <span className={cn("messages-chip", `is-${selectedThread.type}`)}>{selectedThread.type === "client" ? "Client" : "Internal"}</span>
                    <span className={cn("messages-chip", `is-status-${selectedThread.status}`)}>{labelForStatus(selectedThread.status)}</span>
                    {selectedThread.portalSafe ? <span className="messages-chip is-portal-safe">Portal-safe</span> : null}
                  </div>
                </div>
                <div className="messages-detail-actions">
                  <Button
                    onClick={() =>
                      handleThreadMeta(selectedThread.id, {
                        unreadCount: selectedThread.unreadCount > 0 ? 0 : 1,
                      })
                    }
                    variant="ghost"
                  >
                    {selectedThread.unreadCount > 0 ? "Mark Read" : "Mark Unread"}
                  </Button>
                  <Button
                    onClick={() =>
                      handleThreadMeta(selectedThread.id, {
                        status: selectedThread.status === "archived" ? "open" : "archived",
                      })
                    }
                    variant="ghost"
                  >
                    {selectedThread.status === "archived" ? "Restore" : "Archive"}
                  </Button>
                </div>
              </div>

              <div className="messages-detail-content">
                <div className="messages-transcript">
                  {selectedThread.messages.map((message) => (
                    <div
                      className={cn(
                        "messages-bubble",
                        message.authorId === "usr-kwame" && "is-self",
                        message.visibility === "client_visible" && "is-client-visible",
                      )}
                      key={message.id}
                    >
                      <div className="messages-bubble-head">
                        <strong>{message.authorName}</strong>
                        <span className="row-meta">
                          {message.authorRole}  -  {formatDateTime(message.createdAt)}
                        </span>
                      </div>
                      <p>{message.body}</p>
                      <div className="messages-bubble-meta">
                        <span className={cn("messages-chip", message.visibility === "client_visible" ? "is-portal-safe" : "is-internal-note")}>
                          {message.visibility === "client_visible" ? "Client visible" : "Internal"}
                        </span>
                      </div>
                      <p className="messages-bubble-body">{message.body}</p>
                    </div>
                  ))}
                </div>

                <div className="messages-side-meta">
                  <div className="messages-meta-card">
                    <h4 className="section-title">Thread Settings</h4>
                    <label className="messages-field">
                      <span>Assignee</span>
                      <select
                        onChange={(event) => handleThreadMeta(selectedThread.id, { assigneeId: event.target.value || null })}
                        value={selectedThread.assigneeId ?? ""}
                      >
                        <option value="">Unassigned</option>
                        {initialData.assigneeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="messages-field">
                      <span>Linked case</span>
                      <select
                        onChange={(event) => handleThreadMeta(selectedThread.id, { caseId: event.target.value || null })}
                        value={selectedThread.caseId ?? ""}
                      >
                        <option value="">No case linked</option>
                        {initialData.caseOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="messages-field">
                      <span>Status</span>
                      <select
                        onChange={(event) => handleThreadMeta(selectedThread.id, { status: event.target.value as MessageThreadStatus })}
                        value={selectedThread.status}
                      >
                        <option value="open">Open</option>
                        <option value="waiting_on_firm">Waiting on firm</option>
                        <option value="waiting_on_client">Waiting on client</option>
                        <option value="archived">Archived</option>
                      </select>
                    </label>
                    <div className="messages-meta-row">
                      <span>Channel</span>
                      <strong>{selectedThread.channel.replace(/_/g, " ")}</strong>
                    </div>
                    {selectedThread.caseId ? (
                      <Link className="panel-link" href={`/cases/${selectedThread.caseId}`}>
                        Open case
                      </Link>
                    ) : null}
                  </div>

                  <div className="messages-meta-card">
                    <h4 className="section-title">Participants</h4>
                    <div className="messages-participant-list">
                      {selectedThread.participants.map((participant) => (
                        <div className="messages-participant-row" key={participant.id}>
                          <span className="avatar-circle">{initialsForName(participant.name)}</span>
                          <div>
                            <p className="messages-participant-name">{participant.name}</p>
                            <p className="row-meta">{participant.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedThread.linkedDocumentLabels.length > 0 ? (
                    <div className="messages-meta-card">
                      <h4 className="section-title">Linked references</h4>
                      <div className="messages-reference-list">
                        {selectedThread.linkedDocumentLabels.map((label, i) => (
                          <span className="messages-chip" key={`${label}-${i}`}>
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="messages-composer">
                <div className="messages-composer-head">
                  <h4 className="section-title">Reply</h4>
                  {selectedThread.type === "client" ? (
                    <span className="row-meta">Choose whether the draft is internal-only or visible in the portal.</span>
                  ) : (
                    <span className="row-meta">Internal notes never leave the firm workspace.</span>
                  )}
                </div>
                {selectedThread.type === "client" && draft.visibility === "client_visible" ? (
                  <div className="messages-warning-strip">
                    Client-safe draft selected. Review carefully before sending because this message is intended for portal visibility.
                  </div>
                ) : null}
                <div className="messages-composer-grid">
                  <label className="messages-field">
                    <span>Visibility</span>
                    <select
                      onChange={(event) => updateDraft({ visibility: event.target.value as MessageVisibility })}
                      value={draft.visibility}
                    >
                      <option value="internal_only">Internal only</option>
                      {selectedThread.type === "client" ? <option value="client_visible">Client visible</option> : null}
                    </select>
                  </label>
                  <label className="messages-field">
                    <span>Attachments</span>
                    <input disabled placeholder="Attachment placeholders will wire to uploads later." value="" />
                  </label>
                </div>
                <label className="messages-field">
                  <span>Message</span>
                  <textarea
                    onChange={(event) => updateDraft({ body: event.target.value })}
                    placeholder="Write the reply, internal note, or client-safe update."
                    rows={3}
                    value={draft.body}
                  />
                </label>
                <div className="messages-composer-actions">
                  <Button onClick={handleSaveDraft} variant="ghost">
                    Save Draft
                  </Button>
                  <Button onClick={handleReply}>
                    {selectedThread.type === "client" && draft.visibility === "client_visible" ? "Send Client Update" : "Add Reply"}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state">Select a thread to inspect the transcript and reply from the workspace.</div>
          )}
        </div>
      </div>

      <Modal
        footer={
          <>
            <Button onClick={() => setComposerOpen(false)} variant="ghost">
              Cancel
            </Button>
            <Button form="new-thread-form" type="submit">
              Create Thread
            </Button>
          </>
        }
        onClose={() => setComposerOpen(false)}
        open={composerOpen}
        title={newThreadState.type === "client" ? "New Client Update" : "New Internal Thread"}
      >
        <form className="messages-create-form" id="new-thread-form" onSubmit={handleCreateThread}>
          <label className="messages-field">
            <span>Thread type</span>
            <select
              onChange={(event) =>
                setNewThreadState((current) => ({ ...current, type: event.target.value as MessageThreadType }))
              }
              value={newThreadState.type}
            >
              <option value="internal">Internal</option>
              <option value="client">Client</option>
            </select>
          </label>
          <label className="messages-field">
            <span>Subject</span>
            <input
              onChange={(event) => setNewThreadState((current) => ({ ...current, subject: event.target.value }))}
              placeholder="Thread subject"
              value={newThreadState.subject}
            />
          </label>
          <label className="messages-field">
            <span>Linked case</span>
            <select
              onChange={(event) => setNewThreadState((current) => ({ ...current, caseId: event.target.value }))}
              value={newThreadState.caseId}
            >
              <option value="">No case linked</option>
              {initialData.caseOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="messages-field">
            <span>Assignee</span>
            <select
              onChange={(event) => setNewThreadState((current) => ({ ...current, assigneeId: event.target.value }))}
              value={newThreadState.assigneeId}
            >
              <option value="">Unassigned</option>
              {initialData.assigneeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="messages-field">
            <span>Opening message</span>
            <textarea
              onChange={(event) => setNewThreadState((current) => ({ ...current, body: event.target.value }))}
              rows={5}
              value={newThreadState.body}
            />
          </label>
        </form>
      </Modal>
    </section>
  );
}

function countThreads(threads: MessageThreadDetail[], queue: QueueFilter) {
  return threads.filter((thread) => {
    if (queue === "unread") return thread.unreadCount > 0;
    if (queue === "internal") return thread.type === "internal" && thread.status !== "archived";
    if (queue === "client") return thread.type === "client" && thread.status !== "archived";
    if (queue === "needs_reply") return thread.status === "waiting_on_firm";
    return thread.status === "archived";
  }).length;
}

function defaultDraftForThread(thread: MessageThreadDetail): ThreadDraft {
  return {
    body: "",
    visibility: thread.type === "client" ? "client_visible" : "internal_only",
  };
}

function labelForStatus(status: MessageThreadStatus) {
  switch (status) {
    case "waiting_on_client":
      return "Awaiting client";
    case "waiting_on_firm":
      return "Needs reply";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

function initialsForName(name: string) {
  return name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
