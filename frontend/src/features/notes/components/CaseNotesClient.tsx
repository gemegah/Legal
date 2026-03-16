"use client";

import { useDeferredValue, useEffect, useMemo, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/Button";
import type { CaseNote } from "@/features/notes/types";
import { cn, formatDateTime, formatRelativeDate } from "@/lib/utils";

type NoteFilter = "all" | "pinned" | "mine" | "recent";
type NoteSort = "newest" | "oldest" | "pinned";

interface DraftState {
  title: string;
  body: string;
  tags: string;
}

const currentUser = {
  id: "usr-kwame",
  name: "Kwame Boateng",
};

const emptyDraft: DraftState = {
  title: "",
  body: "",
  tags: "",
};

export function CaseNotesClient({
  initialNotes,
  caseId,
}: {
  initialNotes: CaseNote[];
  caseId: string;
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [filter, setFilter] = useState<NoteFilter>("all");
  const [sort, setSort] = useState<NoteSort>("pinned");
  const [query, setQuery] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(initialNotes[0]?.id ?? null);
  const [draft, setDraft] = useState<DraftState>(initialNotes[0] ? noteToDraft(initialNotes[0]) : emptyDraft);
  const [isCreating, setIsCreating] = useState(initialNotes.length === 0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const deferredQuery = useDeferredValue(query);

  const filteredNotes = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();
    const now = Date.now();

    return notes
      .filter((note) => {
        if (filter === "pinned" && !note.pinned) return false;
        if (filter === "mine" && note.authorId !== currentUser.id) return false;
        if (filter === "recent" && now - Date.parse(note.updatedAt) > 1000 * 60 * 60 * 24 * 3) return false;
        if (!normalizedQuery) return true;
        return [note.title, note.body, note.authorName, note.tags.join(" ")].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        );
      })
      .sort((left, right) => {
        if (sort === "oldest") return Date.parse(left.updatedAt) - Date.parse(right.updatedAt);
        if (sort === "newest") return Date.parse(right.updatedAt) - Date.parse(left.updatedAt);
        if (left.pinned !== right.pinned) return left.pinned ? -1 : 1;
        return Date.parse(right.updatedAt) - Date.parse(left.updatedAt);
      });
  }, [deferredQuery, filter, notes, sort]);

  const pinnedNotes = filteredNotes.filter((note) => note.pinned);
  const listNotes = filteredNotes.filter((note) => !note.pinned);
  const selectedNote = notes.find((note) => note.id === selectedNoteId) ?? null;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const hash = window.location.hash.replace("#", "");
    if (hash) {
      const hashNote = notes.find((note) => note.id === hash);
      if (hashNote) {
        setSelectedNoteId(hashNote.id);
        setDraft(noteToDraft(hashNote));
        setIsCreating(false);
      }
      return;
    }

    if (!isCreating && filteredNotes.length > 0 && !filteredNotes.some((note) => note.id === selectedNoteId)) {
      handleSelect(filteredNotes[0]);
    }
  }, [filteredNotes, isCreating, notes, selectedNoteId]);

  function handleSelect(note: CaseNote) {
    setSelectedNoteId(note.id);
    setDraft(noteToDraft(note));
    setIsCreating(false);
    setError(null);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `${window.location.pathname}#${note.id}`);
    }
  }

  function handleNewNote() {
    setSelectedNoteId(null);
    setDraft(emptyDraft);
    setIsCreating(true);
    setError(null);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }

  function updateDraft<K extends keyof DraftState>(key: K, value: DraftState[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.title.trim()) {
      setError("Enter a note title.");
      return;
    }
    if (!draft.body.trim()) {
      setError("Add note content before saving.");
      return;
    }

    const tags = draft.tags
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const now = new Date().toISOString();

    if (isCreating || !selectedNote) {
      const newNote: CaseNote = {
        id: `note-${Math.random().toString(36).slice(2, 10)}`,
        caseId,
        title: draft.title.trim(),
        body: draft.body.trim(),
        authorId: currentUser.id,
        authorName: currentUser.name,
        createdAt: now,
        updatedAt: now,
        pinned: false,
        visibility: "firm_only",
        tags,
        source: "manual",
        relatedItems: [],
      };
      setNotes((current) => [newNote, ...current]);
      setFeedback(`Saved "${newNote.title}".`);
      handleSelect(newNote);
      return;
    }

    setNotes((current) =>
      current.map((note) =>
        note.id === selectedNote.id
          ? {
              ...note,
              title: draft.title.trim(),
              body: draft.body.trim(),
              tags,
              updatedAt: now,
            }
          : note,
      ),
    );
    setFeedback(`Updated "${draft.title.trim()}".`);
    setError(null);
  }

  function handleTogglePin(noteId: string) {
    setNotes((current) =>
      current.map((note) =>
        note.id === noteId
          ? {
              ...note,
              pinned: !note.pinned,
              updatedAt: new Date().toISOString(),
            }
          : note,
      ),
    );
    setFeedback("Pinned state updated.");
  }

  function handleDuplicate(note: CaseNote) {
    const duplicate: CaseNote = {
      ...note,
      id: `note-${Math.random().toString(36).slice(2, 10)}`,
      title: `${note.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pinned: false,
    };
    setNotes((current) => [duplicate, ...current]);
    handleSelect(duplicate);
    setFeedback(`Duplicated "${note.title}".`);
  }

  function handleCopyLink(note: CaseNote) {
    if (typeof window === "undefined") {
      return;
    }
    if (!navigator.clipboard?.writeText) {
      setFeedback("Clipboard access is unavailable in this browser.");
      return;
    }
    const url = `${window.location.origin}${window.location.pathname}#${note.id}`;
    navigator.clipboard.writeText(url).then(
      () => setFeedback("Copied note link."),
      () => setFeedback("Copy failed. Select the note and copy the URL manually."),
    );
  }

  function handlePrint() {
    if (typeof window !== "undefined") {
      window.print();
    }
  }

  function handleMarkReviewed(noteId: string) {
    setNotes((current) =>
      current.map((note) =>
        note.id === noteId
          ? {
              ...note,
              source: "manual",
              reviewedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : note,
      ),
    );
    setFeedback("AI draft marked reviewed.");
  }

  return (
    <section className="case-tab-panel notes-workspace">
      <div className="surface-card notes-hero">
        <div>
          <p className="eyebrow-label">Case Notes</p>
          <h2 className="section-title">Working notes stay private to the firm</h2>
          <p className="case-tab-copy">
            Capture strategy, call summaries, and pinned instructions without mixing them into the immutable audit trail.
          </p>
        </div>
        <div className="notes-hero-actions">
          <span className="case-inline-note">Firm users only</span>
          <Button onClick={handlePrint} variant="ghost">
            Print Notes
          </Button>
          <Button onClick={handleNewNote}>New Note</Button>
        </div>
      </div>

      <div className="surface-card notes-toolbar">
        <label className="notes-search">
          <span className="sr-only">Search notes</span>
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search notes, authors, tags..."
            type="search"
            value={query}
          />
        </label>

        <div className="notes-filter-row">
          {(["all", "pinned", "mine", "recent"] as NoteFilter[]).map((value) => (
            <button
              className={cn("notes-filter-chip", filter === value && "is-active")}
              key={value}
              onClick={() => setFilter(value)}
              type="button"
            >
              {labelForFilter(value)}
            </button>
          ))}
        </div>

        <label className="notes-sort-field">
          <span>Sort</span>
          <select onChange={(event) => setSort(event.target.value as NoteSort)} value={sort}>
            <option value="pinned">Pinned first</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </label>
      </div>

      {feedback ? <div className="notes-feedback">{feedback}</div> : null}

      <div className="notes-grid">
        <div className="surface-card notes-list-panel">
          {notes.length === 0 ? (
            <div className="empty-state notes-empty">
              No notes yet. Start with a private working note or pin the current case strategy here.
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="empty-state notes-empty">
              No notes match the current filters. Clear the search or switch filters to see more note history.
            </div>
          ) : (
            <>
              {pinnedNotes.length > 0 ? (
                <div className="notes-section">
                  <div className="notes-section-header">
                    <h3 className="section-title">Pinned Notes</h3>
                    <span className="row-meta">{pinnedNotes.length} pinned</span>
                  </div>
                  <div className="notes-card-stack">
                    {pinnedNotes.map((note) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        selected={note.id === selectedNoteId}
                        onCopyLink={handleCopyLink}
                        onDuplicate={handleDuplicate}
                        onMarkReviewed={handleMarkReviewed}
                        onSelect={handleSelect}
                        onTogglePin={handleTogglePin}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="notes-section">
                <div className="notes-section-header">
                  <h3 className="section-title">All Case Notes</h3>
                  <span className="row-meta">{filteredNotes.length} visible</span>
                </div>
                <div className="notes-card-stack">
                  {listNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      selected={note.id === selectedNoteId}
                      onCopyLink={handleCopyLink}
                      onDuplicate={handleDuplicate}
                      onMarkReviewed={handleMarkReviewed}
                      onSelect={handleSelect}
                      onTogglePin={handleTogglePin}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="surface-card notes-editor-panel">
          <div className="notes-editor-head">
            <div>
              <p className="eyebrow-label">{isCreating ? "New Note" : "Selected Note"}</p>
              <h3 className="section-title">{isCreating ? "Create private case note" : selectedNote?.title ?? "Create note"}</h3>
            </div>
            {!isCreating && selectedNote ? (
              <span className="notes-editor-meta">
                {selectedNote.authorName}  -  {formatRelativeDate(selectedNote.updatedAt)}
              </span>
            ) : null}
          </div>

          <form className="notes-editor-form" onSubmit={handleSave}>
            <label className="notes-field">
              <span>Title</span>
              <input
                onChange={(event) => updateDraft("title", event.target.value)}
                placeholder="Note title"
                value={draft.title}
              />
            </label>

            <label className="notes-field">
              <span>Tags</span>
              <input
                onChange={(event) => updateDraft("tags", event.target.value)}
                placeholder="strategy, client-call, filing"
                value={draft.tags}
              />
            </label>

            <label className="notes-field">
              <span>Content</span>
              <textarea
                onChange={(event) => updateDraft("body", event.target.value)}
                placeholder="Capture the working note, guidance, or update here."
                rows={12}
                value={draft.body}
              />
            </label>

            {error ? <p className="notes-error">{error}</p> : null}

            <div className="notes-editor-actions">
              {!isCreating && selectedNote ? (
                <Button onClick={() => handleTogglePin(selectedNote.id)} type="button" variant="ghost">
                  {selectedNote.pinned ? "Unpin" : "Pin"}
                </Button>
              ) : null}
              <Button onClick={handleNewNote} type="button" variant="ghost">
                Reset
              </Button>
              <Button type="submit">{isCreating ? "Save Note" : "Update Note"}</Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function NoteCard({
  note,
  onSelect,
  onTogglePin,
  onDuplicate,
  onCopyLink,
  onMarkReviewed,
  selected,
}: {
  note: CaseNote;
  onSelect: (note: CaseNote) => void;
  onTogglePin: (noteId: string) => void;
  onDuplicate: (note: CaseNote) => void;
  onCopyLink: (note: CaseNote) => void;
  onMarkReviewed: (noteId: string) => void;
  selected: boolean;
}) {
  return (
    <div className={cn("notes-card", note.pinned && "is-pinned", selected && "is-selected")}>
      <button className="notes-card-select" onClick={() => onSelect(note)} type="button">
        <div className="notes-card-header">
          <div>
            <p className="notes-card-title">{note.title}</p>
            <p className="row-meta">
              {note.authorName}  -  {formatDateTime(note.createdAt)}
              {note.updatedAt !== note.createdAt ? "  -  Edited" : ""}
            </p>
          </div>
          <div className="notes-card-badges">
            {note.pinned ? <span className="notes-badge is-pinned">Pinned</span> : null}
            {note.source === "ai_draft" ? <span className="notes-badge is-ai">AI Draft</span> : null}
          </div>
        </div>

        <p className="notes-card-body">{note.body}</p>

        {note.tags.length > 0 ? (
          <div className="notes-tag-row">
            {note.tags.map((tag) => (
              <span className="notes-tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </button>

      <div className="notes-card-actions">
        <button
          className="notes-card-action"
          onClick={() => onTogglePin(note.id)}
          type="button"
        >
          {note.pinned ? "Unpin" : "Pin"}
        </button>
        <button
          className="notes-card-action"
          onClick={() => onDuplicate(note)}
          type="button"
        >
          Duplicate
        </button>
        <button
          className="notes-card-action"
          onClick={() => onCopyLink(note)}
          type="button"
        >
          Copy Link
        </button>
        {note.source === "ai_draft" ? (
          <button
            className="notes-card-action"
            onClick={() => onMarkReviewed(note.id)}
            type="button"
          >
            Mark Reviewed
          </button>
        ) : null}
      </div>
    </div>
  );
}

function noteToDraft(note: CaseNote): DraftState {
  return {
    title: note.title,
    body: note.body,
    tags: note.tags.join(", "),
  };
}

function labelForFilter(filter: NoteFilter) {
  switch (filter) {
    case "pinned":
      return "Pinned";
    case "mine":
      return "Mine";
    case "recent":
      return "Recent";
    default:
      return "All";
  }
}
