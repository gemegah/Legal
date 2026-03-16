import type { CaseNote } from "@/features/notes/types";

const seedNotes: CaseNote[] = [
  {
    id: "note-case-014-strategy",
    caseId: "case-2026-014",
    title: "Partner strategy summary before affidavit filing",
    body:
      "Keep the affidavit bundle tight. Opposing counsel is trying to widen the factual dispute, but our strongest line remains the late delivery records and the board approval trail. Confirm the final exhibit numbering before filing.",
    authorId: "usr-kwame",
    authorName: "Kwame Boateng",
    createdAt: "2026-03-08T08:10:00Z",
    updatedAt: "2026-03-08T08:10:00Z",
    pinned: true,
    visibility: "firm_only",
    tags: ["strategy", "filing"],
    source: "manual",
    relatedItems: [
      { entityType: "document", entityId: "doc-affidavit-bundle", label: "Affidavit bundle v3" },
      { entityType: "task", entityId: "task-file-affidavit", label: "File revised affidavit" },
    ],
  },
  {
    id: "note-case-014-ai-update",
    caseId: "case-2026-014",
    title: "AI draft client update for review",
    body:
      "Draft message: We have completed review of the revised affidavit materials and remain on track for filing. Next steps are final exhibit confirmation, filing, and service coordination. Please avoid direct engagement with the respondent until filing is complete.",
    authorId: "usr-legalos-ai",
    authorName: "LegalOS AI",
    createdAt: "2026-03-07T14:20:00Z",
    updatedAt: "2026-03-07T15:05:00Z",
    pinned: false,
    visibility: "firm_only",
    tags: ["client-update", "ai"],
    source: "ai_draft",
    relatedItems: [{ entityType: "event", entityId: "evt-hearing-prep", label: "Hearing prep timeline" }],
    reviewedAt: null,
  },
  {
    id: "note-case-014-call",
    caseId: "case-2026-014",
    title: "Client call notes",
    body:
      "Client confirmed no new commercial correspondence from Mensah Industries this week. They want a same-day update once filing is complete. Finance also asked whether the next invoice can separate counsel time from filing disbursements.",
    authorId: "usr-ama",
    authorName: "Ama Osei",
    createdAt: "2026-03-06T16:40:00Z",
    updatedAt: "2026-03-08T09:15:00Z",
    pinned: false,
    visibility: "firm_only",
    tags: ["client-call", "billing"],
    source: "manual",
    relatedItems: [{ entityType: "invoice", entityId: "inv-2026-014", label: "Draft March invoice" }],
  },
  {
    id: "note-case-011-probate",
    caseId: "case-2026-011",
    title: "Registry follow-up checklist",
    body:
      "Registry clerk asked for the corrected beneficiary schedule and two additional certified copies before they release the next hearing date. Esi should not attend the registry in person until we confirm the file has moved.",
    authorId: "usr-naa",
    authorName: "Naa Korkor Abbey",
    createdAt: "2026-03-05T10:00:00Z",
    updatedAt: "2026-03-05T10:00:00Z",
    pinned: true,
    visibility: "firm_only",
    tags: ["registry", "probate"],
    source: "manual",
    relatedItems: [{ entityType: "task", entityId: "task-beneficiary-schedule", label: "Correct beneficiary schedule" }],
  },
  {
    id: "note-case-003-customs",
    caseId: "case-2026-003",
    title: "Imported customs chronology",
    body:
      "Imported chronology from prior counsel file. Dates should be checked against the customs demand notices because two scanned copies disagree on service date.",
    authorId: "usr-ops",
    authorName: "Operations Desk",
    createdAt: "2026-03-04T12:25:00Z",
    updatedAt: "2026-03-04T12:25:00Z",
    pinned: false,
    visibility: "firm_only",
    tags: ["chronology", "imported"],
    source: "imported",
    relatedItems: [{ entityType: "document", entityId: "doc-customs-notices", label: "Customs demand notices" }],
  },
];

let mockNotes = seedNotes.map(cloneNote);

export function listMockNotesByCase(caseId: string): CaseNote[] {
  return mockNotes.filter((note) => note.caseId === caseId).map(cloneNote);
}

export function createMockNote(input: Omit<CaseNote, "id" | "createdAt" | "updatedAt">): CaseNote {
  const now = new Date().toISOString();
  const note: CaseNote = {
    ...input,
    id: `note-${Math.random().toString(36).slice(2, 10)}`,
    createdAt: now,
    updatedAt: now,
  };
  mockNotes = [note, ...mockNotes];
  return cloneNote(note);
}

export function updateMockNote(id: string, input: Partial<Omit<CaseNote, "id" | "caseId" | "createdAt">>): CaseNote | null {
  let updated: CaseNote | null = null;
  mockNotes = mockNotes.map((note) => {
    if (note.id !== id) {
      return note;
    }
    updated = {
      ...note,
      ...input,
      updatedAt: new Date().toISOString(),
    };
    return updated;
  });
  return updated ? cloneNote(updated) : null;
}

export function toggleMockNotePin(id: string): CaseNote | null {
  const note = mockNotes.find((item) => item.id === id);
  if (!note) {
    return null;
  }
  return updateMockNote(id, { pinned: !note.pinned });
}

function cloneNote(note: CaseNote): CaseNote {
  return {
    ...note,
    tags: [...note.tags],
    relatedItems: note.relatedItems.map((item) => ({ ...item })),
  };
}
