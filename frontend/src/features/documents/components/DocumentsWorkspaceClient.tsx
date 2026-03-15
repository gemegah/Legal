"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type { CaseDetail } from "@/features/cases/types";
import { cn, formatDate, formatDateTime, formatRelativeDate } from "@/lib/utils";

import type {
  ClientRequestStatus,
  DocumentRecord,
  DocumentSearchFilters,
  DocumentTemplate,
  DocumentTemplateStatus,
  DocumentWorkspaceData,
} from "../types";

type WorkspaceTab = "all" | "templates" | "review" | "requests";

const defaultFilters: DocumentSearchFilters = {
  query: "",
  caseId: "",
  documentType: "",
  sourceKind: "",
  aiStatus: "",
  ocrStatus: "",
  sharedState: "",
  requestState: "",
};

export function DocumentsWorkspaceClient({
  initialData,
  caseDetail,
}: {
  initialData: DocumentWorkspaceData;
  caseDetail?: CaseDetail | null;
}) {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("all");
  const [filters, setFilters] = useState<DocumentSearchFilters>({ ...defaultFilters, caseId: caseDetail?.id ?? "" });
  const [documents, setDocuments] = useState(initialData.documents);
  const [templates, setTemplates] = useState(initialData.templates);
  const [providers, setProviders] = useState(initialData.providers);
  const [selectedDocumentId, setSelectedDocumentId] = useState(initialData.documents[0]?.id ?? null);
  const [message, setMessage] = useState<string | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const deferredQuery = useDeferredValue(filters.query);

  const caseOptions = useMemo(() => {
    const map = new Map<string, string>();
    documents.forEach((doc) => map.set(doc.caseId, `${doc.caseReference} - ${doc.caseTitle}`));
    return Array.from(map.entries()).map(([id, label]) => ({ value: id, label }));
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    const query = deferredQuery.trim().toLowerCase();
    return documents.filter((doc) => {
      if (caseDetail?.id && doc.caseId !== caseDetail.id) return false;
      if (activeTab === "review" && !needsReview(doc)) return false;
      if (activeTab === "requests" && doc.requestStatus === "none") return false;
      if (filters.caseId && doc.caseId !== filters.caseId) return false;
      if (filters.documentType && doc.documentType !== filters.documentType) return false;
      if (filters.sourceKind && doc.sourceKind !== filters.sourceKind) return false;
      if (filters.aiStatus && doc.aiStatus !== filters.aiStatus) return false;
      if (filters.ocrStatus && doc.ocrStatus !== filters.ocrStatus) return false;
      if (filters.requestState && doc.requestStatus !== filters.requestState) return false;
      if (filters.sharedState === "shared" && !doc.isClientShared) return false;
      if (filters.sharedState === "internal" && doc.isClientShared) return false;
      if (!query) return true;
      return [doc.title, doc.caseTitle, doc.clientName, doc.uploadedBy, doc.previewSummary, doc.tags.join(" ")].some((value) =>
        value.toLowerCase().includes(query),
      );
    });
  }, [activeTab, deferredQuery, documents, filters, caseDetail?.id]);

  const selectedDocument =
    filteredDocuments.find((doc) => doc.id === selectedDocumentId) ?? filteredDocuments[0] ?? null;

  function updateFilter(key: keyof DocumentSearchFilters, value: string) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function pushMessage(next: string) {
    setMessage(next);
  }

  function handleUpload(values: { title: string; documentType: string; tags: string }) {
    const caseId = caseDetail?.id ?? filters.caseId ?? documents[0]?.caseId ?? "case-2026-014";
    const caseLabel = caseOptions.find((option) => option.value === caseId)?.label ?? "CAS-NEW - Case";
    const [caseReference, caseTitle] = caseLabel.split(" - ");
    const next: DocumentRecord = {
      id: `doc-${Math.random().toString(36).slice(2, 8)}`,
      caseId,
      caseReference,
      caseTitle,
      clientName: caseDetail?.clientName ?? "Client pending confirmation",
      title: values.title,
      documentType: values.documentType,
      sourceKind: "upload",
      latestVersionNumber: 1,
      ocrStatus: "pending",
      aiStatus: "idle",
      requestStatus: "none",
      isClientShared: false,
      tags: values.tags.split(",").map((item) => item.trim()).filter(Boolean),
      updatedAt: new Date().toISOString(),
      uploadedBy: "K. Boateng",
      previewSummary: "Fresh upload queued for OCR and metadata review.",
      versions: [{ id: "new-v1", versionNumber: 1, createdAt: new Date().toISOString(), createdBy: "K. Boateng", summary: "Initial upload.", ocrStatus: "pending", providerRevisionId: null }],
      aiReview: { status: "idle", summary: "AI analysis has not been requested yet.", flags: [], lastAnalyzedAt: null },
      providerLink: null,
      activity: [{ id: "new-activity", at: new Date().toISOString(), actor: "K. Boateng", detail: "Uploaded from practitioner workspace." }],
    };
    setDocuments((current) => [next, ...current]);
    setSelectedDocumentId(next.id);
    setIsUploadOpen(false);
    pushMessage(`Uploaded "${values.title}" and queued OCR.`);
  }

  function handleAnalyze(documentId: string) {
    setDocuments((current) =>
      current.map((doc) =>
        doc.id === documentId
          ? {
              ...doc,
              aiStatus: "ready",
              aiReview: {
                status: "ready",
                summary: doc.aiReview.flags.length ? doc.aiReview.summary : "1 deadline flagged for practitioner review.",
                flags: doc.aiReview.flags.length
                  ? doc.aiReview.flags
                  : [{ id: "generated-flag", label: "Review extracted date", detail: "Confirm the document's next action date before filing.", confidence: "medium" }],
                lastAnalyzedAt: new Date().toISOString(),
              },
            }
          : doc,
      ),
    );
    pushMessage("AI review completed.");
  }

  function handleToggleShare(documentId: string) {
    setDocuments((current) => current.map((doc) => (doc.id === documentId ? { ...doc, isClientShared: !doc.isClientShared } : doc)));
    pushMessage("Sharing state updated.");
  }

  function handleRequest(documentId: string) {
    setDocuments((current) =>
      current.map((doc) =>
        doc.id === documentId
          ? { ...doc, requestStatus: doc.requestStatus === "requested" ? "uploaded" : "requested" }
          : doc,
      ),
    );
    pushMessage("Request state updated.");
  }

  function handleProvider(provider: "word" | "google_docs") {
    setProviders((current) =>
      current.map((item) =>
        item.provider === provider ? { ...item, status: "connected", lastSyncedAt: new Date().toISOString() } : item,
      ),
    );
    pushMessage(`${labelForSource(provider)} integration is now marked connected in the mock workspace.`);
  }

  function handleCreateTemplate(template: DocumentTemplate) {
    setTemplates((current) => [template, ...current]);
    setIsTemplateOpen(false);
    pushMessage(`Template "${template.name}" saved.`);
  }

  function handleGenerate(values: { templateId: string; caseId: string; outputTarget: string; title: string }) {
    const template = templates.find((item) => item.id === values.templateId);
    const caseLabel = caseOptions.find((item) => item.value === values.caseId)?.label;
    if (!template || !caseLabel) return;
    const [caseReference, caseTitle] = caseLabel.split(" - ");
    const next: DocumentRecord = {
      id: `doc-${Math.random().toString(36).slice(2, 8)}`,
      caseId: values.caseId,
      caseReference,
      caseTitle,
      clientName: caseDetail?.clientName ?? "Generated Draft Client",
      title: values.title,
      documentType: template.defaultDocumentType,
      sourceKind: values.outputTarget === "legalos" ? "generated" : (values.outputTarget as DocumentRecord["sourceKind"]),
      latestVersionNumber: 1,
      ocrStatus: "complete",
      aiStatus: "idle",
      requestStatus: "none",
      isClientShared: false,
      tags: [...template.defaultTags],
      updatedAt: new Date().toISOString(),
      uploadedBy: "LegalOS Templates",
      previewSummary: `Generated from ${template.name}.`,
      versions: [{ id: "generated-v1", versionNumber: 1, createdAt: new Date().toISOString(), createdBy: "LegalOS Templates", summary: "Initial generated draft.", ocrStatus: "complete", providerRevisionId: null }],
      aiReview: { status: "idle", summary: "No AI review has run yet.", flags: [], lastAnalyzedAt: null },
      providerLink: values.outputTarget === "word" || values.outputTarget === "google_docs" ? { provider: values.outputTarget as "word" | "google_docs", documentUrl: "https://example.com/generated", templateUrl: "https://example.com/template", syncStatus: "syncing", lastSyncedAt: new Date().toISOString() } : null,
      activity: [{ id: "generated-activity", at: new Date().toISOString(), actor: "LegalOS Templates", detail: `Generated from ${template.name}.` }],
    };
    setDocuments((current) => [next, ...current]);
    setSelectedDocumentId(next.id);
    setActiveTab("all");
    setIsGenerateOpen(false);
    pushMessage(`Created "${values.title}" from template.`);
  }

  return (
    <section className={cn("documents-workspace", caseDetail && "is-case")}>
      <div className="surface-card documents-panel">
        <div className="documents-panel-header">
          <div className="documents-panel-copy">
            <p className="eyebrow-label">{caseDetail ? "Case Documents" : "Document Center"}</p>
            <h2 className="case-title">{caseDetail ? `${caseDetail.reference} document workflow` : "Search-first document operations"}</h2>
            <p className="documents-panel-subcopy">
              {caseDetail
                ? "Upload, classify, generate, and share case documents with provider-aware authoring."
                : "Search, upload, classify, and share documents across active cases with OCR, AI review, and template automation."}
            </p>
          </div>
          <div className="documents-panel-actions">
            <Button onClick={() => setIsUploadOpen(true)} variant="ghost">Upload</Button>
            <Button onClick={() => setIsGenerateOpen(true)}>Create from Template</Button>
            <Button onClick={() => handleProvider("word")} variant="ghost">Open in Word</Button>
            <Button onClick={() => handleProvider("google_docs")} variant="ghost">Open in Google Docs</Button>
          </div>
        </div>

        <div className="documents-provider-strip" aria-label="Document provider status">
          {providers.map((provider) => (
            <div className="documents-provider-inline" key={provider.provider}>
              <div className="documents-provider-inline-copy">
                <span className="documents-provider-label">{provider.label}</span>
                <span className={cn("workspace-pill", `is-${provider.status}`)}>{labelForProvider(provider.status)}</span>
                <span className="case-inline-note">
                  {provider.lastSyncedAt ? `Synced ${formatRelativeDate(provider.lastSyncedAt)}` : "No recent sync"}
                </span>
              </div>
              {provider.status !== "connected" ? (
                <Button onClick={() => handleProvider(provider.provider)} size="sm" variant="ghost">
                  Connect
                </Button>
              ) : null}
            </div>
          ))}
        </div>

        {message ? <div className="documents-inline-alert">{message}</div> : null}

        <div className="documents-tabs">
          <TabButton active={activeTab === "all"} label="All Documents" onClick={() => setActiveTab("all")} />
          <TabButton active={activeTab === "templates"} label="Templates" onClick={() => setActiveTab("templates")} />
          <TabButton active={activeTab === "review"} label="Needs Review" onClick={() => setActiveTab("review")} />
          <TabButton active={activeTab === "requests"} label="Requests" onClick={() => setActiveTab("requests")} />
        </div>

        {activeTab === "templates" ? (
          <TemplateLibrary caseDetail={caseDetail} onGenerate={() => setIsGenerateOpen(true)} onNewTemplate={() => setIsTemplateOpen(true)} templates={templates} />
        ) : (
          <>
            <div className="documents-filter-grid">
              <label className="case-search-field documents-search-field" aria-label="Search documents">
                <SearchIcon />
                <input
                  onChange={(event) => updateFilter("query", event.target.value)}
                  placeholder={caseDetail ? "Search case documents..." : "Search documents, OCR text, tags..."}
                  type="search"
                  value={filters.query}
                />
              </label>
              {!caseDetail ? (
                <FilterSelect label="Case" onChange={(value) => updateFilter("caseId", value)} options={caseOptions} value={filters.caseId} />
              ) : null}
              <FilterSelect label="Type" onChange={(value) => updateFilter("documentType", value)} options={facetValues(documents, "documentType")} value={filters.documentType} />
              <FilterSelect label="Source" onChange={(value) => updateFilter("sourceKind", value)} options={facetValues(documents, "sourceKind")} value={filters.sourceKind} />
              <FilterSelect label="AI" onChange={(value) => updateFilter("aiStatus", value)} options={facetValues(documents, "aiStatus")} value={filters.aiStatus} />
              <FilterSelect label="OCR" onChange={(value) => updateFilter("ocrStatus", value)} options={facetValues(documents, "ocrStatus")} value={filters.ocrStatus} />
              <FilterSelect label="Share" onChange={(value) => updateFilter("sharedState", value)} options={[{ value: "shared", label: "Shared" }, { value: "internal", label: "Internal only" }]} value={filters.sharedState} />
              <FilterSelect label="Requests" onChange={(value) => updateFilter("requestState", value)} options={facetValues(documents, "requestStatus").filter((item) => item.value !== "none")} value={filters.requestState} />
            </div>

            <div className="documents-main-grid">
              <div className="documents-table-shell">
                <div className="documents-table-head">
                  <span>Title</span>
                  {!caseDetail ? <span>Case</span> : null}
                  <span>Type</span>
                  <span>Source</span>
                  <span>Latest</span>
                  <span>OCR</span>
                  <span>AI</span>
                  <span>Shared / Request</span>
                  <span>Updated</span>
                  <span>Owner</span>
                </div>

                {filteredDocuments.length === 0 ? (
                  <div className="documents-empty-state">
                    <p className="section-title">No documents match the current workspace view.</p>
                    <p className="placeholder-copy">Adjust your filters, create a document from a template, or upload a new file to populate the queue.</p>
                  </div>
                ) : (
                  filteredDocuments.map((doc) => (
                    <button
                      className={cn("documents-row", selectedDocument?.id === doc.id && "is-selected")}
                      key={doc.id}
                      onClick={() => setSelectedDocumentId(doc.id)}
                      onDoubleClick={() => pushMessage(doc.providerLink?.documentUrl ? "Opening provider-authored file." : "Opening LegalOS download.")}
                      type="button"
                    >
                      <span><strong>{doc.title}</strong><small>{doc.tags.join(" - ")}</small></span>
                      {!caseDetail ? <span>{doc.caseReference}<small>{doc.clientName}</small></span> : null}
                      <span>{doc.documentType}</span>
                      <span>{labelForSource(doc.sourceKind)}</span>
                      <span>v{doc.latestVersionNumber}</span>
                      <span className={cn("workspace-pill", `is-${doc.ocrStatus}`)}>{labelForStatus(doc.ocrStatus)}</span>
                      <span className={cn("workspace-pill", `is-${doc.aiStatus}`)}>{labelForStatus(doc.aiStatus)}</span>
                      <span>{doc.isClientShared ? "Shared" : "Internal"}<small>{labelForRequest(doc.requestStatus)}</small></span>
                      <span>{formatRelativeDate(doc.updatedAt)}</span>
                      <span>{doc.uploadedBy}</span>
                    </button>
                  ))
                )}
              </div>

              <div className="surface-card documents-detail-rail">
                {selectedDocument ? (
                  <DocumentDetailPanel document={selectedDocument} onAnalyze={() => handleAnalyze(selectedDocument.id)} onRequest={() => handleRequest(selectedDocument.id)} onShare={() => handleToggleShare(selectedDocument.id)} />
                ) : (
                  <div className="documents-empty-state">
                    <p className="section-title">Select a document</p>
                    <p className="placeholder-copy">The detail rail shows versions, AI review, sharing state, and recent activity.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <UploadDocumentModal open={isUploadOpen} onClose={() => setIsUploadOpen(false)} onSave={handleUpload} />
      <GenerateDocumentModal caseDetail={caseDetail} caseOptions={caseOptions} open={isGenerateOpen} onClose={() => setIsGenerateOpen(false)} onSave={handleGenerate} templates={templates} />
      <TemplateBuilderModal open={isTemplateOpen} onClose={() => setIsTemplateOpen(false)} onSave={handleCreateTemplate} />
    </section>
  );
}

function TabButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return <button className={cn("documents-tab-button", active && "is-active")} onClick={onClick} type="button">{label}</button>;
}

function FilterSelect({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  value: string;
}) {
  return (
    <label className="documents-filter-field">
      <span>{label}</span>
      <select onChange={(event) => onChange(event.target.value)} value={value}>
        <option value="">All</option>
        {options.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
      </select>
    </label>
  );
}

function DocumentDetailPanel({
  document,
  onAnalyze,
  onRequest,
  onShare,
}: {
  document: DocumentRecord;
  onAnalyze: () => void;
  onRequest: () => void;
  onShare: () => void;
}) {
  return (
    <div className="documents-detail-body">
      <div className="documents-detail-header">
        <div>
          <p className="eyebrow-label">{document.caseReference}</p>
          <h3 className="section-title">{document.title}</h3>
          <p className="placeholder-copy">{document.previewSummary}</p>
        </div>
        <div className="documents-detail-actions">
          <Button onClick={onAnalyze} size="sm" variant="ghost">Analyze</Button>
          <Button onClick={onRequest} size="sm" variant="ghost">Request</Button>
          <Button onClick={onShare} size="sm">{document.isClientShared ? "Unshare" : "Share"}</Button>
        </div>
      </div>

      <div className="documents-detail-grid">
        <DetailBlock label="Type" value={document.documentType} />
        <DetailBlock label="Source" value={labelForSource(document.sourceKind)} />
        <DetailBlock label="Updated" value={formatDateTime(document.updatedAt)} />
        <DetailBlock label="Owner" value={document.uploadedBy} />
      </div>

      <section className="documents-detail-section">
        <div className="documents-detail-section-head">
          <p className="section-title">AI Review</p>
          <span className={cn("workspace-pill", `is-${document.aiStatus}`)}>{labelForStatus(document.aiStatus)}</span>
        </div>
        <p className="placeholder-copy">{document.aiReview.summary}</p>
        {document.aiReview.flags.length > 0 ? (
          <div className="documents-flag-list">
            {document.aiReview.flags.map((flag) => (
              <div className="documents-flag-card" key={flag.id}>
                <strong>{flag.label}</strong>
                <span>{flag.detail}</span>
                <small>{flag.confidence} confidence</small>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <section className="documents-detail-section">
        <div className="documents-detail-section-head">
          <p className="section-title">Version Rail</p>
          <span className="case-inline-note">v{document.latestVersionNumber}</span>
        </div>
        <div className="documents-version-list">
          {document.versions.map((version) => (
            <div className="documents-version-card" key={version.id}>
              <strong>Version {version.versionNumber}</strong>
              <span>{version.summary}</span>
              <small>{formatDateTime(version.createdAt)} - {version.createdBy}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="documents-detail-section">
        <p className="section-title">Recent Activity</p>
        <div className="documents-activity-list">
          {document.activity.map((entry) => (
            <div className="documents-activity-item" key={entry.id}>
              <strong>{entry.detail}</strong>
              <span>{entry.actor} - {formatRelativeDate(entry.at)}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function DetailBlock({ label, value }: { label: string; value: string }) {
  return <div className="documents-detail-block"><span>{label}</span><strong>{value}</strong></div>;
}

function TemplateLibrary({
  caseDetail,
  onGenerate,
  onNewTemplate,
  templates,
}: {
  caseDetail?: CaseDetail | null;
  onGenerate: () => void;
  onNewTemplate: () => void;
  templates: DocumentTemplate[];
}) {
  const [statusFilter, setStatusFilter] = useState<DocumentTemplateStatus | "all">("all");
  const visibleTemplates = templates.filter((template) => {
    if (statusFilter !== "all" && template.status !== statusFilter) return false;
    if (!caseDetail) return true;
    return template.caseTypes.includes(caseDetail.caseType) || template.practiceAreas.includes(caseDetail.practiceArea);
  });

  return (
    <div className="documents-template-shell">
      <div className="documents-template-toolbar">
        <div className="documents-tabs">
          <TabButton active={statusFilter === "all"} label="All" onClick={() => setStatusFilter("all")} />
          <TabButton active={statusFilter === "active"} label="Active" onClick={() => setStatusFilter("active")} />
          <TabButton active={statusFilter === "draft"} label="Draft" onClick={() => setStatusFilter("draft")} />
        </div>
        <div className="documents-template-actions">
          <Button onClick={onNewTemplate} variant="ghost">New Template</Button>
          <Button onClick={onGenerate}>Generate Document</Button>
        </div>
      </div>

      <div className="documents-template-grid">
        {visibleTemplates.map((template) => (
          <div className="surface-card template-card" key={template.id}>
            <div className="template-card-head">
              <div>
                <p className="eyebrow-label">{template.category}</p>
                <h3 className="section-title">{template.name}</h3>
              </div>
              <span className={cn("workspace-pill", `is-${template.status}`)}>{template.status}</span>
            </div>
            <p className="placeholder-copy">{labelForSource(template.sourceKind)} - {template.defaultDocumentType} - {template.fields.length} mapped fields</p>
            <div className="template-token-list">
              {template.fields.map((field) => <span className="case-detail-chip" key={field.id}>{field.token}</span>)}
            </div>
            <div className="template-meta-grid">
              <DetailBlock label="Owner" value={template.ownerName} />
              <DetailBlock label="Updated" value={formatDate(template.updatedAt)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UploadDocumentModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (values: { title: string; documentType: string; tags: string }) => void;
}) {
  const [title, setTitle] = useState("");
  const [documentType, setDocumentType] = useState("Court Notice");
  const [tags, setTags] = useState("uploaded, pending-review");

  return (
    <Modal
      footer={<><Button onClick={onClose} variant="ghost">Cancel</Button><Button onClick={() => onSave({ title, documentType, tags })}>Queue Upload</Button></>}
      onClose={onClose}
      open={open}
      title="Upload Document"
    >
      <div className="documents-modal-grid">
        <label className="documents-filter-field"><span>Title</span><input onChange={(event) => setTitle(event.target.value)} value={title} /></label>
        <label className="documents-filter-field"><span>Document type</span><input onChange={(event) => setDocumentType(event.target.value)} value={documentType} /></label>
        <label className="documents-filter-field"><span>Tags</span><input onChange={(event) => setTags(event.target.value)} value={tags} /></label>
      </div>
    </Modal>
  );
}

function TemplateBuilderModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (template: DocumentTemplate) => void;
}) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("New Document Automation");
  const [category, setCategory] = useState("Advisory");
  const [sourceKind, setSourceKind] = useState<DocumentTemplate["sourceKind"]>("word");
  const [titlePattern, setTitlePattern] = useState("{{case.reference}} - Draft");
  const [status, setStatus] = useState<DocumentTemplateStatus>("draft");

  return (
    <Modal
      footer={
        <>
          <Button onClick={onClose} variant="ghost">Close</Button>
          {step > 0 ? <Button onClick={() => setStep((current) => current - 1)} variant="ghost">Back</Button> : null}
          {step < 3 ? (
            <Button onClick={() => setStep((current) => current + 1)}>Next</Button>
          ) : (
            <Button
              onClick={() =>
                onSave({
                  id: `tpl-${Math.random().toString(36).slice(2, 8)}`,
                  name,
                  category,
                  sourceKind,
                  status,
                  ownerName: "K. Boateng",
                  caseTypes: ["Commercial Litigation", "Advisory"],
                  practiceAreas: ["Commercial", "Dispute Resolution"],
                  updatedAt: new Date().toISOString(),
                  defaultDocumentType: "Advice Letter",
                  defaultTags: ["automation", "new-template"],
                  titlePattern,
                  supportsInternalGeneration: sourceKind === "generated" || sourceKind === "upload",
                  outputTargets: sourceKind === "google_docs" ? ["google_docs"] : sourceKind === "word" ? ["word"] : ["legalos", "word"],
                  sourceFileName: `${name.toLowerCase().replace(/\s+/g, "-")}.docx`,
                  fields: [
                    { id: "field-new-1", token: "{{client.name}}", label: "Client Name", source: "client.name", required: true },
                    { id: "field-new-2", token: "{{case.reference}}", label: "Case Reference", source: "case.reference", required: true },
                    { id: "field-new-3", token: "{{today.long}}", label: "Today", source: "today.long", required: true },
                  ],
                })
              }
            >
              Publish Template
            </Button>
          )}
        </>
      }
      onClose={onClose}
      open={open}
      title={`Template Builder - ${["Source", "Fields", "Output Rules", "Publish"][step]}`}
    >
      <div className="documents-modal-grid">
        {step === 0 ? (
          <>
            <label className="documents-filter-field"><span>Template name</span><input onChange={(event) => setName(event.target.value)} value={name} /></label>
            <label className="documents-filter-field"><span>Category</span><input onChange={(event) => setCategory(event.target.value)} value={category} /></label>
            <FilterSelect label="Source provider" onChange={(value) => setSourceKind(value as DocumentTemplate["sourceKind"])} options={[{ value: "word", label: "Microsoft Word" }, { value: "google_docs", label: "Google Docs" }, { value: "generated", label: "Generate in LegalOS" }, { value: "upload", label: "Uploaded DOCX" }]} value={sourceKind} />
          </>
        ) : null}
        {step === 1 ? <p className="placeholder-copy">Auto-detected placeholders: {"{{client.name}}"}, {"{{case.reference}}"}, {"{{today.long}}"}.</p> : null}
        {step === 2 ? <label className="documents-filter-field"><span>Title pattern</span><input onChange={(event) => setTitlePattern(event.target.value)} value={titlePattern} /></label> : null}
        {step === 3 ? <FilterSelect label="Publish status" onChange={(value) => setStatus(value as DocumentTemplateStatus)} options={[{ value: "draft", label: "Draft" }, { value: "active", label: "Active" }]} value={status} /> : null}
      </div>
    </Modal>
  );
}

function GenerateDocumentModal({
  caseDetail,
  caseOptions,
  open,
  onClose,
  onSave,
  templates,
}: {
  caseDetail?: CaseDetail | null;
  caseOptions: Array<{ value: string; label: string }>;
  open: boolean;
  onClose: () => void;
  onSave: (values: { templateId: string; caseId: string; outputTarget: string; title: string }) => void;
  templates: DocumentTemplate[];
}) {
  const [templateId, setTemplateId] = useState(templates[0]?.id ?? "");
  const [caseId, setCaseId] = useState(caseDetail?.id ?? caseOptions[0]?.value ?? "");
  const [outputTarget, setOutputTarget] = useState("word");
  const [title, setTitle] = useState("Generated draft");
  const selectedTemplate = templates.find((item) => item.id === templateId);
  const outputOptions = selectedTemplate?.outputTargets ?? ["word"];

  return (
    <Modal
      footer={<><Button onClick={onClose} variant="ghost">Cancel</Button><Button onClick={() => onSave({ templateId, caseId, outputTarget, title })}>Generate</Button></>}
      onClose={onClose}
      open={open}
      title="Create from Template"
    >
      <div className="documents-modal-grid">
        <FilterSelect label="Template" onChange={setTemplateId} options={templates.map((item) => ({ value: item.id, label: item.name }))} value={templateId} />
        {!caseDetail ? <FilterSelect label="Case" onChange={setCaseId} options={caseOptions} value={caseId} /> : null}
        <FilterSelect label="Output target" onChange={setOutputTarget} options={outputOptions.map((item) => ({ value: item, label: labelForOutput(item) }))} value={outputTarget} />
        <label className="documents-filter-field"><span>Document title</span><input onChange={(event) => setTitle(event.target.value)} value={title} /></label>
      </div>
    </Modal>
  );
}

function facetValues<T extends keyof DocumentRecord>(documents: DocumentRecord[], key: T) {
  return Array.from(new Set(documents.map((item) => String(item[key]))))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b))
    .map((value) => ({ value, label: labelForStatus(value) }));
}

function labelForSource(source: string) {
  if (source === "google_docs") return "Google Docs";
  if (source === "generated") return "Generated";
  if (source === "upload") return "Upload";
  if (source === "word") return "Word";
  return source;
}

function labelForOutput(source: string) {
  return source === "legalos" ? "Generate and keep in LegalOS" : labelForSource(source);
}

function labelForRequest(status: ClientRequestStatus) {
  return status === "none" ? "No request" : labelForStatus(status);
}

function labelForStatus(value: string) {
  return value.split("_").map((item) => item.charAt(0).toUpperCase() + item.slice(1)).join(" ");
}

function labelForProvider(status: string) {
  return status === "attention" ? "Needs attention" : labelForStatus(status);
}

function needsReview(document: DocumentRecord) {
  return document.aiStatus === "ready" || document.aiStatus === "failed" || document.ocrStatus === "processing" || document.ocrStatus === "failed";
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" x2="16.65" y1="21" y2="16.65" />
    </svg>
  );
}
