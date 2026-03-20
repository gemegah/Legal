import Link from "next/link";

import { Badge } from "@/components/ui";

const navItems = [
  { href: "#platform", label: "Platform" },
  { href: "#proof", label: "Proof" },
  // { href: "#workflow", label: "Workflow" },
  // { href: "#plans", label: "Plans" },
];

const trustMarks = ["Boateng & Co.", "Afenyo Legal", "Meridian Counsel", "Accra Capital", "Case-ready teams"];

const capabilityCards = [
  {
    eyebrow: "Matter control",
    title: "Deadlines, filings, and billing live inside the same case.",
    copy:
      "Keep the hearing calendar, internal follow-ups, and client-ready updates attached to the matter instead of scattered across tools.",
  },
  {
    eyebrow: "Review-first AI",
    title: "Suggestions stay suggestions until a lawyer approves them.",
    copy:
      "Extracted deadlines, draft narratives, and next-step prompts are visible, traceable, and clearly separated from the permanent record.",
  },
  {
    eyebrow: "Collections",
    title: "Revenue workflows move with the matter, not after it.",
    copy:
      "Time entries, invoice drafts, payment follow-up, and client context share the same workspace so billing does not stall at the end.",
  },
];

const practiceVisibilityCards = [
  {
    title: "Entire team aligned",
    copy: "Keep case tasks, shared goals, and live updates visible in the same operating layer.",
  },
  {
    title: "5 hours/week saved",
    copy: "Reduce routine follow-up by keeping deadlines, review points, and billing cues in view.",
  },
  {
    title: "10% lower churn",
    copy: "Smoother handoffs and clearer client visibility help the practice feel more dependable.",
  },
  {
    title: "200+ review signals",
    copy: "Track approvals, upload requests, and invoice touchpoints without losing the matter context.",
  },
];

const performanceTiles = [
  {
    value: "5 hrs",
    title: "Saved each week",
    copy: "Fewer follow-up loops across deadlines, billing, and internal review.",
  },
  {
    value: "98%",
    title: "Matter context retained",
    copy: "Updates, evidence, and assignees stay anchored to the underlying record.",
  },
  {
    value: "24h",
    title: "Faster invoice turnaround",
    copy: "Drafts, narratives, and collections move without leaving the workspace.",
  },
  {
    value: "3 rails",
    title: "One operating rhythm",
    copy: "Legal work, review, and client visibility stay in the same flow.",
  },
];

const proofStats = [
  { value: "126", label: "Cases under watch", meta: "Across litigation, employment, and property matters." },
  { value: "18", label: "Deadlines this week", meta: "Assigned, surfaced, and tied to the underlying case record." },
  { value: "GHS 184k", label: "Collected this month", meta: "Tracked alongside invoice status and payment history." },
];

const integrationCards = [
  {
    title: "Calendar sync",
    copy: "Hearings, filing windows, and internal deadlines stay visible in the same operating layer.",
  },
  {
    title: "Document trails",
    copy: "Evidence, drafts, and shared bundles remain attached to the matter instead of disappearing into folders.",
  },
  {
    title: "Billing visibility",
    copy: "Time, invoice drafts, and collection status are always close to the legal work that created them.",
  },
];

const workflowSteps = [
  {
    step: "01",
    title: "Open the matter workspace",
    copy: "Start from the case timeline and immediately see deadlines, documents, assignees, and active billing context.",
  },
  {
    step: "02",
    title: "Review the next actions",
    copy: "Let the system surface extracted dates, missing evidence, and invoice drafts without losing human review.",
  },
  {
    step: "03",
    title: "Share only what belongs outside",
    copy: "Push approved updates and invoices to the client portal while internal notes and drafts stay private.",
  },
];

const plans = [
  {
    name: "Chambers",
    price: "GHS 299 / mo",
    detail: "For compact teams moving from spreadsheets and shared drives into a cleaner case workflow.",
    href: "/register",
    tone: "base",
  },
  {
    name: "Practice Pro",
    price: "GHS 899 / mo",
    detail: "For growing firms that need tighter billing visibility, portal sharing, and role-based operations.",
    href: "/register",
    tone: "accent",
  },
];

const footerColumns = [
  {
    title: "Platform",
    links: [
      { href: "#platform", label: "Matter workspace" },
      { href: "#proof", label: "Proof points" },
      { href: "#workflow", label: "Workflow" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/register", label: "Create workspace" },
      { href: "/login", label: "Staff sign in" },
      { href: "/portal", label: "Client portal" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/dashboard", label: "Dashboard preview" },
      { href: "/cases", label: "Case workspace preview" },
      { href: "/settings", label: "Settings preview" },
    ],
  },
];

export default function HomePage() {
  return (
    <main className="landing-shell">
      <div className="landing-frame">
        <header className="landing-nav">
          <Link className="landing-brand" href="/">
            <span className="landing-brand-mark" aria-hidden="true" />
            <span>LegalOS</span>
          </Link>

          {/* <nav className="landing-nav-links" aria-label="Landing">
            {navItems.map((item) => (
              <a className="landing-nav-link" href={item.href} key={item.label}>
                {item.label}
              </a>
            ))}
          </nav> */}

          <div className="landing-nav-actions">
            <Link className="btn btn-primary ui-button-md" href="/login">
              Get Started
            </Link>
            {/* <Link className="btn btn-primary ui-button-md" href="/register">
              Create workspace
            </Link> */}
          </div>
        </header>

        <section className="landing-hero" id="platform">
          <div className="landing-hero-copy">
            {/* <Badge tone="warning">Ghana-first legal OS</Badge> */}
            <p className="landing-eyebrow">One workspace for legal teams that need clarity.</p>
            <h1 className="landing-title">Run your firm from one case-centric workspace.</h1>
            <p className="landing-copy">
              Deadlines, documents, billing, and client updates stay anchored to the matter they belong to.
            </p>

            {/* <div className="landing-actions">
              <Link className="btn btn-primary ui-button-lg" href="/login">
                Staff login
              </Link>
              <Link className="btn btn-ghost ui-button-lg" href="/dashboard">
                View preview
              </Link>
            </div> */}

            <div className="landing-inline-proof">
              <div className="landing-inline-proof-item">
                <strong>4.9 hrs</strong>
                <span>Saved weekly</span>
              </div>
              <div className="landing-inline-proof-item">
                <strong>Audit-first</strong>
                <span>Every update stays traceable</span>
              </div>
            </div>
          </div>

          <aside className="landing-hero-stage" aria-label="Workspace preview">
            <div className="landing-stage-card">
              <div className="landing-stage-topbar">
                <div>
                  <p className="landing-stage-kicker">Matter pulse</p>
                  <h2>Asante v. Mensah Industries</h2>
                </div>
                <span className="landing-stage-chip">Hearing in 2 days</span>
              </div>

              <div className="landing-stage-stack">
                <section className="landing-stage-surface landing-stage-summary">
                  <div>
                    <span className="landing-stage-label">Outstanding invoices</span>
                    <strong>GHS 18,760</strong>
                    <p>Draft ready for review on the employment brief.</p>
                  </div>
                  <div className="landing-stage-mini-chart" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                </section>

                <div className="landing-stage-floating-card">
                  <span className="landing-floating-kicker">Today</span>
                  <strong>3 actions need partner review</strong>
                  <p>2 extracted deadlines and 1 client summary draft.</p>
                </div>

                <section className="landing-stage-surface landing-stage-activity">
                  <div className="landing-stage-row">
                    <span className="landing-stage-time">09:00</span>
                    <div>
                      <strong>Hearing bundle check</strong>
                      <p>Court filing references verified and assigned to Ama Osei.</p>
                    </div>
                  </div>
                  <div className="landing-stage-row">
                    <span className="landing-stage-time">12:30</span>
                    <div>
                      <strong>Invoice narrative prepared</strong>
                      <p>Time entries grouped into a draft for internal review.</p>
                    </div>
                  </div>
                  <div className="landing-stage-row">
                    <span className="landing-stage-time">16:10</span>
                    <div>
                      <strong>Client update staged</strong>
                      <p>Portal-ready summary linked to the latest filed document.</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </aside>
        </section>

        {/* Trust Strip */}
        {/* <section className="landing-trust-row" aria-label="Trusted by practice teams">
          <span className="landing-trust-label">Trusted by practice teams</span>
          {trustMarks.map((mark) => (
            <span className="landing-trust-mark" key={mark}>
              {mark}
            </span>
          ))}
        </section> */}

        {/* Performance Section */}
        <section className="landing-performance-section" id="proof">
          <div className="landing-section-head landing-section-head-centered">
            <div>
              <p className="landing-section-kicker">Operational calm</p>
              <h2 className="landing-section-title">The team moves faster when the record stays intact.</h2>
            </div>
          </div>

          <div className="landing-performance-grid">
            {performanceTiles.map((item) => (
              <article className="landing-performance-card" key={item.title}>
                <strong>{item.value}</strong>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </section>


{/* Integration Story Section */}
        <section className="landing-story-section">
          <div className="landing-story-copy">
            <p className="landing-section-kicker">Organized by design</p>
            <h2 className="landing-section-title">Keep the firm aligned without rebuilding context every morning.</h2>
            <p className="landing-section-copy">
              Tasks, updates, and collections feel lighter when the workspace keeps the whole practice pointed at the same record.
            </p>
          </div>

          <div className="landing-story-rail">
            {integrationCards.map((item) => (
              <article className="landing-story-rail-card" key={item.title}>
                <span className="landing-story-rail-dot" aria-hidden="true" />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </section>


        {/* Feature Showcase Section */}
        <section className="landing-showcase-section">
          <div className="landing-showcase-head">
            <p className="landing-section-kicker">Practice visibility</p>
            <h2 className="landing-section-title">Simplify practice visibility for modern legal teams.</h2>
            <p className="landing-section-copy landing-showcase-copy">
              Clear case tasks, deadlines, and shared goals make the whole practice easier to steer.
            </p>
          </div>

          <div className="landing-visibility-grid" aria-label="Practice visibility highlights">
            {practiceVisibilityCards.map((item) => (
              <article className="landing-visibility-card" key={item.title}>
                <span className="landing-visibility-icon" aria-hidden="true" />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        

        {/* Workspace Preview Section */}
        {/* <section className="landing-workspace-section" id="workflow">
          <div className="landing-section-head landing-section-head-centered">
            <div>
              <p className="landing-section-kicker">Workspace preview</p>
              <h2 className="landing-section-title">One board for matter progress, review points, and collections.</h2>
            </div>
          </div>

          <div className="landing-process-grid">
            {workflowSteps.map((item) => (
              <article className="landing-process-card" key={item.step}>
                <span className="landing-process-step">{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>

          <div className="landing-workspace-frame" aria-label="Workspace board preview">
            <div className="landing-workspace-toolbar">
              <span className="landing-brand">
                <span className="landing-brand-mark" aria-hidden="true" />
                <span>LegalOS</span>
              </span>
              <span className="landing-workspace-toolbar-label">Dashboard</span>
            </div>

            <div className="landing-workspace-board">
              <div className="landing-workspace-column">
                <span className="landing-workspace-column-title">To review</span>
                <article className="landing-workspace-task">
                  <strong>Presentation bundle</strong>
                  <p>Hearing brief needs partner sign-off.</p>
                </article>
                <article className="landing-workspace-task">
                  <strong>Client summary draft</strong>
                  <p>Portal update prepared for final approval.</p>
                </article>
              </div>

              <div className="landing-workspace-column">
                <span className="landing-workspace-column-title">In progress</span>
                <article className="landing-workspace-task">
                  <strong>Invoice narrative</strong>
                  <p>Time entries grouped and billing notes attached.</p>
                </article>
                <article className="landing-workspace-task">
                  <strong>Document request</strong>
                  <p>Evidence upload request sent with matter context.</p>
                </article>
              </div>

              <div className="landing-workspace-column">
                <span className="landing-workspace-column-title">Ready to share</span>
                <article className="landing-workspace-task">
                  <strong>Shared update</strong>
                  <p>Client-facing summary paired with the latest filing.</p>
                </article>
                <article className="landing-workspace-task">
                  <strong>Payment follow-up</strong>
                  <p>Collection reminder staged beside the open invoice.</p>
                </article>
              </div>
            </div>
          </div>

          <div className="landing-stat-strip">
            {proofStats.map((item) => (
              <article className="landing-stat-item" key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
                <p>{item.meta}</p>
              </article>
            ))}
          </div>
        </section> */}

        {/* Plans Section */}
        {/* <section className="landing-plans-section" id="plans">
          <div className="landing-section-head landing-section-head-centered">
            <div>
              <p className="landing-section-kicker">Choose your pace</p>
              <h2 className="landing-section-title">Start with a tighter practice rhythm, then grow into firm-wide visibility.</h2>
            </div>
          </div>

          <div className="landing-plan-grid">
            {plans.map((plan) => (
              <article className={`landing-plan-card${plan.tone === "accent" ? " is-accent" : ""}`} key={plan.name}>
                <div>
                  <h3>{plan.name}</h3>
                  <strong>{plan.price}</strong>
                  <p>{plan.detail}</p>
                </div>
                <Link className={`btn ${plan.tone === "accent" ? "btn-primary" : "btn-ghost"} ui-button-md`} href={plan.href}>
                  Choose {plan.name}
                </Link>
              </article>
            ))}
          </div>
        </section> */}

        {/* Call To Action Section */}
        {/* <section className="landing-cta-band">
          <div>
            <p className="landing-section-kicker">Try it now</p>
            <h2 className="landing-process-title">Ready to give your legal operations a cleaner center of gravity?</h2>
            <p className="landing-section-copy landing-section-copy-inverse">
              Start with the preview flow, review the workspace, and step into a calmer operating model for the firm.
            </p>
          </div>
          <div className="landing-actions">
            <Link className="btn btn-primary ui-button-lg" href="/register">
              Get started
            </Link>
            <Link className="btn btn-ghost ui-button-lg landing-cta-ghost" href="/login">
              Staff login
            </Link>
          </div>
        </section> */}

        {/* Footer Section */}
        <footer className="landing-footer">
          <div className="landing-footer-inner">
            <div className="landing-footer-brand">
              <Link className="landing-brand" href="/">
                <span className="landing-brand-mark" aria-hidden="true" />
                <span>LegalOS</span>
              </Link>
              <p>
                A Ghana-first legal operating system for case clarity, billing visibility, and review-first team work.
              </p>
            </div>

            <div className="landing-footer-columns">
              {footerColumns.map((column) => (
                <div className="landing-footer-column" key={column.title}>
                  <h3>{column.title}</h3>
                  {column.links.map((link) => (
                    <Link href={link.href} key={link.label}>
                      {link.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
