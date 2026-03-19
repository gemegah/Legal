"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type { CaseDetail } from "@/features/cases/types";
import { createTemplate, generateTemplateDocument, updateClientRequest, updateDocumentShare, uploadDocument } from "@/features/documents/client";
import { deriveDocumentStatus, inferFileExtension, matchesDateFilter } from "@/features/documents/helpers";
import { cn, formatDateTime, formatRelativeDate } from "@/lib/utils";

import type {
  ClientRequestStatus,
  DocumentDateFilter,
  DocumentOutputTarget,
  DocumentRecord,
  DocumentSearchFilters,
  DocumentTemplate,
  DocumentTemplateStatus,
  DocumentWorkflowStatus,
  DocumentWorkspaceData,
} from "../types";

const defaultFilters: DocumentSearchFilters = { query: "", status: "", date: "all", caseId: "" };

export function DocumentsWorkspaceClient({
  apiBaseUrl,
  caseDetail,
  dataSource,
  initialData,
}: {
  apiBaseUrl: string | null;
  caseDetail?: CaseDetail | null;
  dataSource: "mock" | "api";
  initialData: DocumentWorkspaceData;
}) {
  const [documents, setDocuments] = useState(initialData.documents);
  const [templates, setTemplates] = useState(initialData.templates);
  const [filters, setFilters] = useState<DocumentSearchFilters>(defaultFilters);
  const [draftFilters, setDraftFilters] = useState<DocumentSearchFilters>(defaultFilters);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const deferredQuery = useDeferredValue(filters.query);

  const caseOptions = useMemo(() => {
    const map = new Map<string, { value: string; label: string; meta: string }>();
    documents.forEach((doc) => {
      if (!map.has(doc.caseId)) map.set(doc.caseId, { value: doc.caseId, label: `${doc.caseReference} - ${doc.caseTitle}`, meta: doc.clientName });
    });
    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [documents]);

  const statusOptions = useMemo(
    () => Array.from(new Set(documents.map((doc) => doc.status))).sort().map((value) => ({ value, label: labelForStatus(value) })),
    [documents],
  );

  const filteredDocuments = useMemo(() => {
    const query = deferredQuery.trim().toLowerCase();
    return documents
      .filter((doc) => {
        if (caseDetail?.id && doc.caseId !== caseDetail.id) return false;
        if (filters.caseId && doc.caseId !== filters.caseId) return false;
        if (filters.status && doc.status !== filters.status) return false;
        if (!matchesDateFilter(doc.updatedAt, filters.date)) return false;
        if (!query) return true;
        return [doc.title, doc.caseReference, doc.caseTitle, doc.clientName, doc.fileName, doc.documentType, doc.uploadedBy, doc.tags.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(query);
      })
      .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
  }, [caseDetail?.id, deferredQuery, documents, filters]);

  const groups = useMemo(() => {
    if (caseDetail) return [{ id: caseDetail.id, caseReference: caseDetail.reference, caseTitle: caseDetail.title, clientName: caseDetail.clientName, documents: filteredDocuments }];
    const map = new Map<string, { id: string; caseReference: string; caseTitle: string; clientName: string; documents: DocumentRecord[] }>();
    filteredDocuments.forEach((doc) => {
      if (!map.has(doc.caseId)) map.set(doc.caseId, { id: doc.caseId, caseReference: doc.caseReference, caseTitle: doc.caseTitle, clientName: doc.clientName, documents: [] });
      map.get(doc.caseId)?.documents.push(doc);
    });
    return Array.from(map.values()).sort((a, b) => +new Date(b.documents[0]?.updatedAt ?? 0) - +new Date(a.documents[0]?.updatedAt ?? 0));
  }, [caseDetail, filteredDocuments]);

  const filterCount = Number(Boolean(filters.status)) + Number(filters.date !== "all") + Number(!caseDetail && Boolean(filters.caseId));

  function updateQuery(value: string) {
    setFilters((current) => ({ ...current, query: value }));
    setDraftFilters((current) => ({ ...current, query: value }));
  }

  function upsertDocument(next: DocumentRecord) {
    const record = ensureDocument(next);
    setDocuments((current) => (current.some((item) => item.id === record.id) ? current.map((item) => (item.id === record.id ? record : item)) : [record, ...current]));
  }

  function openDocument(document: DocumentRecord) {
    if (document.providerLink?.documentUrl) {
      window.open(document.providerLink.documentUrl, "_blank", "noopener,noreferrer");
      return;
    }
    setMessage(`"${document.title}" is indexed in this starter workspace, but direct downloads are not wired into this view yet.`);
  }

  async function saveUpload(values: { caseId: string; documentType: string; file: File; tags: string[]; title: string }) {
    setPendingAction("upload");
    try {
      if (dataSource === "api" && apiBaseUrl) {
        upsertDocument(
          await uploadDocument({
            apiBaseUrl,
            caseId: values.caseId,
            payload: { file_name: values.file.name, document_type: values.documentType, title: values.title },
            confirm: {
              checksum_sha256: "starter-checksum",
              file_size_bytes: values.file.size || 0,
              mime_type: values.file.type || "application/octet-stream",
              storage_key: "",
            },
          }),
        );
      } else {
        const option = caseOptions.find((item) => item.value === values.caseId);
        const [caseReference, caseTitle] = option?.label.split(" - ") ?? ["CAS-NEW", "New Case"];
        const now = new Date().toISOString();
        upsertDocument({
          id: `doc-${Math.random().toString(36).slice(2, 8)}`,
          caseId: values.caseId,
          caseReference,
          caseTitle,
          clientName: option?.meta ?? "Case client",
          title: values.title,
          fileName: values.file.name,
          fileExtension: inferFileExtension(values.file.name, "upload"),
          documentType: values.documentType,
          status: "processing",
          sourceKind: "upload",
          latestVersionNumber: 1,
          ocrStatus: "processing",
          aiStatus: "pending",
          requestStatus: "none",
          isClientShared: false,
          tags: values.tags,
          updatedAt: now,
          uploadedBy: "K. Boateng",
          previewSummary: "Upload confirmed and background OCR is processing.",
          versions: [{ id: "new-upload-v1", versionNumber: 1, createdAt: now, createdBy: "K. Boateng", summary: "Initial upload confirmed.", ocrStatus: "processing", providerRevisionId: null }],
          aiReview: { status: "pending", summary: "Background extraction will start after OCR completes.", flags: [], lastAnalyzedAt: null },
          providerLink: null,
          activity: [{ id: "new-upload-activity", at: now, actor: "LegalOS OCR", detail: "Upload confirmed and OCR queued." }],
        });
      }
      setUploadOpen(false);
      setMessage(`Queued "${values.title}" for background processing.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setPendingAction(null);
    }
  }

  async function saveTemplate(values: { category: string; name: string; sourceKind: DocumentTemplate["sourceKind"]; status: DocumentTemplateStatus }) {
    setPendingAction("template");
    try {
      if (dataSource === "api" && apiBaseUrl) {
        const created = await createTemplate({ apiBaseUrl, payload: values });
        setTemplates((current) => [created, ...current]);
      } else
        setTemplates((current) => [
          {
            id: `tpl-${Math.random().toString(36).slice(2, 8)}`,
            name: values.name,
            category: values.category,
            sourceKind: values.sourceKind,
            status: values.status,
            ownerName: "K. Boateng",
            caseTypes: ["Commercial Litigation", "Advisory"],
            practiceAreas: ["Commercial"],
            updatedAt: new Date().toISOString(),
            defaultDocumentType: "Advice Letter",
            defaultTags: ["automation"],
            titlePattern: "{{case.reference}} - Draft",
            supportsInternalGeneration: values.sourceKind === "generated" || values.sourceKind === "upload",
            outputTargets: values.sourceKind === "google_docs" ? ["google_docs"] : values.sourceKind === "word" ? ["word"] : ["legalos", "word"],
            sourceFileName: `${values.name.toLowerCase().replace(/\s+/g, "-")}.docx`,
            fields: [{ id: "field-new", token: "{{client.name}}", label: "Client Name", source: "client.name", required: true }],
          },
          ...current,
        ]);
      setTemplateOpen(false);
      setMessage(`Template "${values.name}" saved.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Template could not be saved.");
    } finally {
      setPendingAction(null);
    }
  }

  async function saveGenerated(values: { caseId: string; outputTarget: DocumentOutputTarget; templateId: string; title: string }) {
    const template = templates.find((item) => item.id === values.templateId);
    if (!template) return;
    setPendingAction("generate");
    try {
      if (dataSource === "api" && apiBaseUrl) {
        upsertDocument(await generateTemplateDocument({ apiBaseUrl, templateId: values.templateId, payload: values }));
      } else {
        const option = caseOptions.find((item) => item.value === values.caseId);
        const [caseReference, caseTitle] = option?.label.split(" - ") ?? ["CAS-NEW", "Generated Case"];
        const ext = values.outputTarget === "google_docs" ? "gdoc" : "docx";
        const now = new Date().toISOString();
        upsertDocument({
          id: `doc-${Math.random().toString(36).slice(2, 8)}`,
          caseId: values.caseId,
          caseReference,
          caseTitle,
          clientName: option?.meta ?? "Generated Client",
          title: values.title,
          fileName: `${values.title.toLowerCase().replace(/\s+/g, "-")}.${ext}`,
          fileExtension: ext,
          documentType: template.defaultDocumentType,
          status: "ready",
          sourceKind: values.outputTarget === "legalos" ? "generated" : values.outputTarget,
          latestVersionNumber: 1,
          ocrStatus: "complete",
          aiStatus: "idle",
          requestStatus: "none",
          isClientShared: false,
          tags: [...template.defaultTags],
          updatedAt: now,
          uploadedBy: "LegalOS Templates",
          previewSummary: `Created from ${template.name}.`,
          versions: [{ id: "generated-v1", versionNumber: 1, createdAt: now, createdBy: "LegalOS Templates", summary: "Generated draft.", ocrStatus: "complete", providerRevisionId: null }],
          aiReview: { status: "idle", summary: "Built-in extraction will run automatically where supported.", flags: [], lastAnalyzedAt: null },
          providerLink: values.outputTarget === "word" || values.outputTarget === "google_docs" ? { provider: values.outputTarget, documentUrl: "https://example.com/generated", templateUrl: null, syncStatus: "syncing", lastSyncedAt: now } : null,
          activity: [{ id: "generated-activity", at: now, actor: "LegalOS Templates", detail: `Created from ${template.name}.` }],
        });
      }
      setCreateOpen(false);
      setMessage(`Created "${values.title}" from template.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Document generation failed.");
    } finally {
      setPendingAction(null);
    }
  }

  async function toggleShare(document: DocumentRecord) {
    setPendingAction(document.id);
    try {
      const updated =
        dataSource === "api" && apiBaseUrl
          ? await updateDocumentShare({ apiBaseUrl, documentId: document.id, payload: { is_client_shared: !document.isClientShared } })
          : ensureDocument({ ...document, isClientShared: !document.isClientShared, updatedAt: new Date().toISOString() });
      upsertDocument(updated);
      setMessage(document.isClientShared ? "Document returned to internal-only access." : "Document shared with the client.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Share action failed.");
    } finally {
      setOpenMenuId(null);
      setPendingAction(null);
    }
  }

  async function toggleRequest(document: DocumentRecord) {
    const nextStatus: ClientRequestStatus = document.requestStatus === "requested" || document.requestStatus === "uploaded" ? "fulfilled" : "requested";
    setPendingAction(document.id);
    try {
      const updated =
        dataSource === "api" && apiBaseUrl
          ? await updateClientRequest({ apiBaseUrl, documentId: document.id, payload: { status: nextStatus } })
          : ensureDocument({ ...document, requestStatus: nextStatus, updatedAt: new Date().toISOString() });
      upsertDocument(updated);
      setMessage(nextStatus === "requested" ? "Client upload request marked active." : "Client upload request marked complete.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Request state could not be updated.");
    } finally {
      setOpenMenuId(null);
      setPendingAction(null);
    }
  }

  return (
    <section className={cn("documents-workspace", caseDetail && "is-case")}>
      <div className="surface-card documents-panel">
        <div className="documents-shell-header">
          <div className="documents-shell-copy">
            <p className="eyebrow-label">{caseDetail ? "Case Documents" : "Document Center"}</p>
            <h2 className="case-title">{caseDetail ? `${caseDetail.reference} documents` : "Documents"}</h2>
            <p className="documents-shell-subcopy">{caseDetail ? "Case files, uploads, and drafts in one calm list view." : "Grouped case files with built-in processing and a lighter document workspace."}</p>
          </div>
          <div className="documents-shell-actions">
            <Button onClick={() => setUploadOpen(true)} variant="ghost">Upload document</Button>
            <Button onClick={() => setCreateOpen(true)}>Create document</Button>
          </div>
        </div>
        {message ? <div className="documents-feedback">{message}</div> : null}
        <div className="documents-toolbar">
          <label className="case-search-field documents-search-field" aria-label="Search documents">
            <SearchIcon />
            <input onChange={(event) => updateQuery(event.target.value)} placeholder={caseDetail ? "Search case documents..." : "Search documents, cases, owners..."} type="search" value={filters.query} />
          </label>
          <div className="documents-toolbar-actions">
            <button className={cn("documents-filter-trigger", filterOpen && "is-open")} onClick={() => setFilterOpen((current) => !current)} type="button">
              Filters
              {filterCount > 0 ? <span className="documents-filter-count">{filterCount}</span> : null}
            </button>
          </div>
          {filterOpen ? (
            <div className="documents-filter-popover">
              <FilterSection label="Status" options={[{ value: "", label: "All statuses" }, ...statusOptions]} value={draftFilters.status} onChange={(value) => setDraftFilters((current) => ({ ...current, status: value }))} />
              <FilterSection
                label="Date"
                options={[
                  { value: "all", label: "All dates" },
                  { value: "today", label: "Updated today" },
                  { value: "last_7_days", label: "Last 7 days" },
                  { value: "last_30_days", label: "Last 30 days" },
                  { value: "older", label: "Older" },
                ]}
                value={draftFilters.date}
                onChange={(value) => setDraftFilters((current) => ({ ...current, date: value as DocumentDateFilter }))}
              />
              {!caseDetail ? <FilterSection label="Case" options={[{ value: "", label: "All cases" }, ...caseOptions.map((item) => ({ value: item.value, label: item.label }))]} value={draftFilters.caseId} onChange={(value) => setDraftFilters((current) => ({ ...current, caseId: value }))} /> : null}
              <div className="documents-filter-footer">
                <Button
                  onClick={() => {
                    const next = { ...defaultFilters, query: filters.query };
                    setFilters(next);
                    setDraftFilters(next);
                    setFilterOpen(false);
                  }}
                  variant="ghost"
                >
                  Clear
                </Button>
                <Button onClick={() => { setFilters(draftFilters); setFilterOpen(false); }}>Apply filters</Button>
              </div>
            </div>
          ) : null}
        </div>
        <div className="documents-list-shell">
          {groups.every((group) => group.documents.length === 0) ? (
            <div className="documents-empty-state">
              <p className="section-title">No documents match the current workspace view.</p>
              <p className="placeholder-copy">Adjust the filters or add a new document to refill the list.</p>
            </div>
          ) : (
            groups.map((group) =>
              group.documents.length ? (
                <section className="documents-case-group" key={group.id}>
                  {!caseDetail ? (
                    <div className="documents-case-header">
                      <div><p className="eyebrow-label">{group.caseReference}</p><h3 className="section-title">{group.caseTitle}</h3></div>
                      <div className="documents-case-meta"><span>{group.clientName}</span><span>{group.documents.length} document{group.documents.length === 1 ? "" : "s"}</span></div>
                    </div>
                  ) : null}
                  <div className="documents-row-head"><span>Document</span><span>Status</span><span>Updated</span><span>Owner</span><span>Actions</span></div>
                  <div className="documents-row-list">
                    {group.documents.map((document) => (
                      <DocumentRow document={document} isMenuOpen={openMenuId === document.id} key={document.id} onOpen={() => openDocument(document)} onRequest={() => void toggleRequest(document)} onToggleMenu={() => setOpenMenuId(openMenuId === document.id ? null : document.id)} onToggleShare={() => void toggleShare(document)} pending={pendingAction === document.id} />
                    ))}
                  </div>
                </section>
              ) : null,
            )
          )}
        </div>
      </div>
      <UploadDocumentModal caseDetail={caseDetail} caseOptions={caseOptions} loading={pendingAction === "upload"} onClose={() => setUploadOpen(false)} onSave={saveUpload} open={uploadOpen} />
      <CreateDocumentModal caseDetail={caseDetail} caseOptions={caseOptions} loading={pendingAction === "generate"} onClose={() => setCreateOpen(false)} onManageTemplates={() => setTemplateOpen(true)} onSave={saveGenerated} open={createOpen} templates={templates} />
      <TemplateBuilderModal loading={pendingAction === "template"} onClose={() => setTemplateOpen(false)} onSave={saveTemplate} open={templateOpen} />
    </section>
  );
}

function DocumentRow({
  document,
  isMenuOpen,
  onOpen,
  onRequest,
  onToggleMenu,
  onToggleShare,
  pending,
}: {
  document: DocumentRecord;
  isMenuOpen: boolean;
  onOpen: () => void;
  onRequest: () => void;
  onToggleMenu: () => void;
  onToggleShare: () => void;
  pending: boolean;
}) {
  return (
    <div className="documents-row">
      <div className="documents-file-cell">
        <FileBadge fileExtension={document.fileExtension} sourceKind={document.sourceKind} />
        <div className="documents-file-copy">
          <div className="documents-file-title-line"><strong>{document.title}</strong><span className="documents-file-extension">{document.fileExtension.toUpperCase()}</span></div>
          <p className="documents-file-meta"><span>{document.documentType}</span><span>v{document.latestVersionNumber}</span><span>{document.isClientShared ? "Client shared" : "Internal only"}</span>{document.requestStatus !== "none" ? <span>{labelForRequest(document.requestStatus)}</span> : null}</p>
          <p className="documents-file-note">{noteForDocument(document)}</p>
        </div>
      </div>
      <div className="documents-status-cell"><span className={cn("documents-status-badge", `is-${document.status}`)}>{labelForStatus(document.status)}</span></div>
      <div className="documents-date-cell"><strong>{formatRelativeDate(document.updatedAt)}</strong><small>{formatDateTime(document.updatedAt)}</small></div>
      <div className="documents-owner-cell"><strong>{document.uploadedBy}</strong><small>{document.fileName}</small></div>
      <div className="documents-actions-cell">
        <button className="documents-inline-action" onClick={onOpen} type="button">Open</button>
        <div className="documents-row-menu">
          <button aria-label="More document actions" className="documents-row-menu-trigger" onClick={onToggleMenu} type="button"><MenuIcon /></button>
          {isMenuOpen ? (
            <div className="documents-row-menu-panel">
              <button onClick={onToggleShare} type="button">{document.isClientShared ? "Unshare with client" : "Share with client"}</button>
              <button onClick={onRequest} type="button">{document.requestStatus === "requested" || document.requestStatus === "uploaded" ? "Mark client request complete" : "Request client upload"}</button>
            </div>
          ) : null}
        </div>
        {pending ? <span className="documents-row-working">Updating...</span> : null}
      </div>
    </div>
  );
}

function FilterSection({ label, onChange, options, value }: { label: string; onChange: (value: string) => void; options: Array<{ value: string; label: string }>; value: string }) {
  return (
    <div className="documents-filter-section">
      <p className="documents-filter-label">{label}</p>
      <div className="documents-filter-options">
        {options.map((option) => (
          <button className={cn("documents-filter-option", value === option.value && "is-active")} key={option.value} onClick={() => onChange(option.value)} type="button">
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function UploadDocumentModal({
  caseDetail,
  caseOptions,
  loading,
  onClose,
  onSave,
  open,
}: {
  caseDetail?: CaseDetail | null;
  caseOptions: Array<{ value: string; label: string; meta: string }>;
  loading: boolean;
  onClose: () => void;
  onSave: (values: { caseId: string; documentType: string; file: File; tags: string[]; title: string }) => Promise<void>;
  open: boolean;
}) {
  const [caseId, setCaseId] = useState(caseDetail?.id ?? caseOptions[0]?.value ?? "");
  const [documentType, setDocumentType] = useState("Court Filing");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("uploaded, legalos");
  const [file, setFile] = useState<File | null>(null);
  return (
    <Modal footer={<><Button onClick={onClose} variant="ghost">Cancel</Button><Button disabled={!file || !title.trim()} loading={loading} onClick={() => file ? void onSave({ caseId, documentType, file, tags: tags.split(",").map((item) => item.trim()).filter(Boolean), title }) : undefined}>Queue upload</Button></>} onClose={onClose} open={open} title="Upload document">
      <div className="documents-modal-grid">
        {!caseDetail ? <label className="documents-field"><span>Case</span><select onChange={(event) => setCaseId(event.target.value)} value={caseId}>{caseOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label> : null}
        <label className="documents-field"><span>File</span><input accept=".doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg" onChange={(event) => { const nextFile = event.target.files?.[0] ?? null; setFile(nextFile); if (nextFile && !title) setTitle(nextFile.name.replace(/\.[^.]+$/, "")); }} type="file" /></label>
        <label className="documents-field"><span>Title</span><input onChange={(event) => setTitle(event.target.value)} value={title} /></label>
        <label className="documents-field"><span>Document type</span><input onChange={(event) => setDocumentType(event.target.value)} value={documentType} /></label>
        <label className="documents-field"><span>Tags</span><input onChange={(event) => setTags(event.target.value)} value={tags} /></label>
      </div>
    </Modal>
  );
}

function CreateDocumentModal({
  caseDetail,
  caseOptions,
  loading,
  onClose,
  onManageTemplates,
  onSave,
  open,
  templates,
}: {
  caseDetail?: CaseDetail | null;
  caseOptions: Array<{ value: string; label: string; meta: string }>;
  loading: boolean;
  onClose: () => void;
  onManageTemplates: () => void;
  onSave: (values: { caseId: string; outputTarget: DocumentOutputTarget; templateId: string; title: string }) => Promise<void>;
  open: boolean;
  templates: DocumentTemplate[];
}) {
  const visibleTemplates = useMemo(() => !caseDetail ? templates : templates.filter((template) => template.caseTypes.includes(caseDetail.caseType) || template.practiceAreas.includes(caseDetail.practiceArea)), [caseDetail, templates]);
  const [templateId, setTemplateId] = useState(visibleTemplates[0]?.id ?? templates[0]?.id ?? "");
  const [caseId, setCaseId] = useState(caseDetail?.id ?? caseOptions[0]?.value ?? "");
  const [title, setTitle] = useState("Generated draft");
  const selectedTemplate = visibleTemplates.find((template) => template.id === templateId) ?? templates.find((template) => template.id === templateId) ?? null;
  const outputOptions = selectedTemplate?.outputTargets ?? ["word"];
  const [outputTarget, setOutputTarget] = useState<DocumentOutputTarget>((outputOptions[0] ?? "word") as DocumentOutputTarget);
  return (
    <Modal footer={<><Button onClick={onClose} variant="ghost">Cancel</Button><Button disabled={!templateId || !title.trim()} loading={loading} onClick={() => void onSave({ caseId, outputTarget, templateId, title })}>Create document</Button></>} onClose={onClose} open={open} title="Create document">
      <div className="documents-create-shell">
        <div className="documents-create-head"><p className="placeholder-copy">Template selection stays inside the create flow. Editor targets apply in the background.</p><Button onClick={onManageTemplates} variant="ghost">Manage templates</Button></div>
        <div className="documents-modal-grid">
          {!caseDetail ? <label className="documents-field"><span>Case</span><select onChange={(event) => setCaseId(event.target.value)} value={caseId}>{caseOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label> : null}
          <label className="documents-field"><span>Template</span><select onChange={(event) => { const nextTemplateId = event.target.value; setTemplateId(nextTemplateId); const nextTemplate = visibleTemplates.find((template) => template.id === nextTemplateId) ?? templates.find((template) => template.id === nextTemplateId); if (nextTemplate) setOutputTarget((nextTemplate.outputTargets[0] ?? "word") as DocumentOutputTarget); }} value={templateId}>{(visibleTemplates.length ? visibleTemplates : templates).map((template) => <option key={template.id} value={template.id}>{template.name}</option>)}</select></label>
          <label className="documents-field"><span>Document title</span><input onChange={(event) => setTitle(event.target.value)} value={title} /></label>
          <label className="documents-field"><span>Output</span><select onChange={(event) => setOutputTarget(event.target.value as DocumentOutputTarget)} value={outputTarget}>{outputOptions.map((option) => <option key={option} value={option}>{labelForOutput(option as DocumentOutputTarget)}</option>)}</select></label>
        </div>
      </div>
    </Modal>
  );
}

function TemplateBuilderModal({
  loading,
  onClose,
  onSave,
  open,
}: {
  loading: boolean;
  onClose: () => void;
  onSave: (values: { category: string; name: string; sourceKind: DocumentTemplate["sourceKind"]; status: DocumentTemplateStatus }) => Promise<void>;
  open: boolean;
}) {
  const [name, setName] = useState("New document automation");
  const [category, setCategory] = useState("Advisory");
  const [sourceKind, setSourceKind] = useState<DocumentTemplate["sourceKind"]>("word");
  const [status, setStatus] = useState<DocumentTemplateStatus>("draft");
  return (
    <Modal footer={<><Button onClick={onClose} variant="ghost">Close</Button><Button loading={loading} onClick={() => void onSave({ category, name, sourceKind, status })}>Save template</Button></>} onClose={onClose} open={open} title="Manage templates">
      <div className="documents-modal-grid">
        <label className="documents-field"><span>Template name</span><input onChange={(event) => setName(event.target.value)} value={name} /></label>
        <label className="documents-field"><span>Category</span><input onChange={(event) => setCategory(event.target.value)} value={category} /></label>
        <label className="documents-field"><span>Source</span><select onChange={(event) => setSourceKind(event.target.value as DocumentTemplate["sourceKind"])} value={sourceKind}><option value="word">Microsoft Word</option><option value="google_docs">Google Docs</option><option value="generated">Generate in LegalOS</option><option value="upload">Uploaded template</option></select></label>
        <label className="documents-field"><span>Status</span><select onChange={(event) => setStatus(event.target.value as DocumentTemplateStatus)} value={status}><option value="draft">Draft</option><option value="active">Active</option></select></label>
      </div>
    </Modal>
  );
}

function FileBadge({ fileExtension, sourceKind }: { fileExtension: string; sourceKind: DocumentRecord["sourceKind"] }) {
  const tone = sourceKind === "google_docs" ? "google" : fileExtension === "doc" || fileExtension === "docx" ? "word" : fileExtension === "ppt" || fileExtension === "pptx" ? "powerpoint" : fileExtension === "xls" || fileExtension === "xlsx" ? "spreadsheet" : fileExtension === "pdf" ? "pdf" : "generic";
  const label = sourceKind === "google_docs" ? "G" : fileExtension === "doc" || fileExtension === "docx" ? "W" : fileExtension === "ppt" || fileExtension === "pptx" ? "P" : fileExtension === "xls" || fileExtension === "xlsx" ? "X" : fileExtension === "pdf" ? "PDF" : fileExtension.slice(0, 3).toUpperCase();
  return <span aria-hidden="true" className={cn("documents-file-badge", `is-${tone}`)}>{label}</span>;
}

function SearchIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" /></svg>;
}

function MenuIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20"><circle cx="4" cy="10" r="1.5" /><circle cx="10" cy="10" r="1.5" /><circle cx="16" cy="10" r="1.5" /></svg>;
}

function ensureDocument(document: DocumentRecord): DocumentRecord {
  return { ...document, fileExtension: document.fileExtension || inferFileExtension(document.fileName, document.sourceKind), status: document.status || deriveDocumentStatus({ aiStatus: document.aiStatus, isClientShared: document.isClientShared, ocrStatus: document.ocrStatus, requestStatus: document.requestStatus }) };
}

function noteForDocument(document: DocumentRecord): string {
  if (document.status === "processing") return "Background OCR and extraction are still running.";
  if (document.status === "attention") return "Built-in extraction flagged an issue that needs follow-up.";
  if (document.status === "client_requested") return "Client-facing request is active on this document.";
  return document.previewSummary;
}

function labelForStatus(value: DocumentWorkflowStatus | string): string {
  if (value === "client_requested") return "Client requested";
  if (value === "client_shared") return "Client shared";
  if (value === "attention") return "Attention";
  if (value === "processing") return "Processing";
  return "Ready";
}

function labelForRequest(status: ClientRequestStatus): string {
  if (status === "requested") return "Client request";
  if (status === "uploaded") return "Client uploaded";
  if (status === "fulfilled") return "Request fulfilled";
  if (status === "cancelled") return "Request cancelled";
  return "No request";
}

function labelForOutput(value: DocumentOutputTarget): string {
  if (value === "google_docs") return "Google Docs";
  if (value === "legalos") return "LegalOS";
  return "Microsoft Word";
}
