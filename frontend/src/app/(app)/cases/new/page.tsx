"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button, Input } from "@/components/ui";

export default function NewCasePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [caseType, setCaseType] = useState("");
  const [practiceArea, setPracticeArea] = useState("");
  const [clientName, setClientName] = useState("");
  const [leadLawyer, setLeadLawyer] = useState("");
  const [status, setStatus] = useState("active");

  return (
    <div className="settings-screen">
      <section className="surface-card settings-panel">
        <div className="settings-panel-head">
          <div>
            <p className="settings-panel-kicker">Matter details</p>
            <h4 className="settings-panel-title">Basic information about the case</h4>
          </div>
          <div className="settings-inline-actions">
            <Button onClick={() => router.back()} variant="ghost">Cancel</Button>
            <Button>Create Case</Button>
          </div>
        </div>

        <div className="settings-form-grid">
          <Input
            label="Case title"
            name="title"
            placeholder="e.g. Mensah v. Accra Bank"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            label="Client name"
            name="clientName"
            placeholder="e.g. Kweku Mensah"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
          <Input
            label="Case type"
            name="caseType"
            placeholder="e.g. Commercial Litigation"
            value={caseType}
            onChange={(e) => setCaseType(e.target.value)}
          />
          <Input
            label="Practice area"
            name="practiceArea"
            placeholder="e.g. Commercial"
            value={practiceArea}
            onChange={(e) => setPracticeArea(e.target.value)}
          />
          <Input
            label="Lead lawyer"
            name="leadLawyer"
            placeholder="e.g. K. Boateng"
            value={leadLawyer}
            onChange={(e) => setLeadLawyer(e.target.value)}
          />
          <label className="ui-field">
            <span className="ui-field-label">Status</span>
            <select className="settings-select" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
            </select>
          </label>
        </div>
      </section>
    </div>
  );
}
