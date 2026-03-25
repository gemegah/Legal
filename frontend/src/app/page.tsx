import Link from "next/link";

const navItems = [
  { href: "#platform", label: "Platform" },
  { href: "#proof", label: "Proof" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#testimonial", label: "Customers" },
];

const trustFirms = [
  "Boateng & Co.",
  "Afenyo Legal",
  "Meridian Counsel",
  "Accra Capital",
  "Ofori & Associates",
];

const capabilityItems = [
  {
    eyebrow: "Matter workspace",
    title: "Every case detail lives in one operating layer.",
    copy:
      "Tasks, documents, billing, and client updates stay anchored to the matter — so your team moves without losing context across tools.",
    featured: true,
  },
  {
    eyebrow: "Review-first AI",
    title: "Suggestions wait for your team.",
    copy:
      "Extracted deadlines, draft narratives, and next-step prompts appear as pending — clearly separated from the permanent record.",
  },
  {
    eyebrow: "Collections",
    title: "Revenue moves with the matter.",
    copy:
      "Time entries, invoice drafts, and payment follow-up share the same workspace so billing never stalls at the end.",
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
    value: "24 h",
    title: "Faster invoice turnaround",
    copy: "Drafts, narratives, and collections move without leaving the workspace.",
  },
  {
    value: "3×",
    title: "Fewer dropped follow-ups",
    copy: "Integrated task and deadline tracking cuts the gaps that cost client trust.",
  },
];

const workflowSteps = [
  {
    step: "01",
    title: "Open the matter",
    copy: "Create a case record and invite your team. Every document, task, and invoice attaches here from day one.",
  },
  {
    step: "02",
    title: "Work inside it",
    copy: "Log deadlines, upload documents, review AI suggestions, and track billing — all from the matter view.",
  },
  {
    step: "03",
    title: "Bill with confidence",
    copy: "Generate invoices anchored to case activity. Reconcile payments without rebuilding context from scratch.",
  },
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

const practiceVisibilityCards = [
  {
    title: "Entire team aligned",
    copy: "Keep case tasks, shared goals, and live updates visible in the same operating layer.",
    symbol: "⚖",
  },
  {
    title: "5 hours saved per week",
    copy: "Reduce routine follow-up by keeping deadlines, review points, and billing cues in view.",
    symbol: "◷",
  },
  {
    title: "10% lower client churn",
    copy: "Smoother handoffs and clearer client visibility help the practice feel more dependable.",
    symbol: "↗",
  },
  {
    title: "200+ review signals",
    copy: "Track approvals, upload requests, and invoice touchpoints without losing the matter context.",
    symbol: "✦",
  },
];

const footerColumns = [
  {
    title: "Platform",
    links: [
      { href: "#platform", label: "Matter workspace" },
      { href: "#proof", label: "Proof points" },
      { href: "#platform", label: "Billing & collections" },
      { href: "#platform", label: "Client portal" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/register", label: "Create workspace" },
      { href: "/login", label: "Staff sign in" },
      { href: "#", label: "About LegalOS" },
      { href: "#", label: "Contact us" },
    ],
  },
  {
    title: "Connect",
    links: [
      { href: "#", label: "LinkedIn" },
      { href: "#", label: "X / Twitter" },
    ],
  },
];

export default function HomePage() {
  return (
    <main className="landing-shell">

      {/* Scales of Justice — geometric background motif */}
      <div className="landing-bg-scales" aria-hidden="true">
        <svg viewBox="0 0 640 720" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="320" cy="90" r="18" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="320" cy="90" r="8" fill="currentColor" />
          <line x1="320" y1="108" x2="320" y2="600" stroke="currentColor" strokeWidth="2" />
          <line x1="100" y1="210" x2="540" y2="210" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="320" cy="210" r="7" fill="currentColor" />
          <line x1="120" y1="210" x2="100" y2="360" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" />
          <line x1="100" y1="210" x2="80" y2="360" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" />
          <line x1="140" y1="210" x2="120" y2="360" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" />
          <line x1="500" y1="210" x2="520" y2="360" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" />
          <line x1="520" y1="210" x2="540" y2="360" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" />
          <line x1="480" y1="210" x2="500" y2="360" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" />
          <path d="M55 362 Q100 382 145 362" stroke="currentColor" strokeWidth="1.8" fill="none" />
          <line x1="55" y1="362" x2="145" y2="362" stroke="currentColor" strokeWidth="1" />
          <path d="M475 362 Q520 382 565 362" stroke="currentColor" strokeWidth="1.8" fill="none" />
          <line x1="475" y1="362" x2="565" y2="362" stroke="currentColor" strokeWidth="1" />
          <line x1="220" y1="600" x2="420" y2="600" stroke="currentColor" strokeWidth="2" />
          <line x1="240" y1="620" x2="400" y2="620" stroke="currentColor" strokeWidth="1.5" />
          <line x1="260" y1="636" x2="380" y2="636" stroke="currentColor" strokeWidth="1" />
          <circle cx="100" cy="210" r="6" stroke="currentColor" strokeWidth="1.2" fill="none" />
          <circle cx="540" cy="210" r="6" stroke="currentColor" strokeWidth="1.2" fill="none" />
          <circle cx="100" cy="370" r="30" stroke="currentColor" strokeWidth="0.7" fill="none" />
          <circle cx="520" cy="370" r="30" stroke="currentColor" strokeWidth="0.7" fill="none" />
        </svg>
      </div>

      {/* Section mark — typographic legal accent */}
      <div className="landing-bg-section-mark" aria-hidden="true">§</div>

      {/* Full-bleed dark hero band */}
      <div className="landing-hero-band">
        <div className="landing-frame">
          <header className="landing-nav landing-nav-dark">
            <Link className="landing-brand" href="/">
              <span className="landing-brand-mark" aria-hidden="true" />
              <span>LegalOS</span>
            </Link>

            <nav className="landing-nav-links" aria-label="Primary navigation">
              {navItems.map((item) => (
                <a className="landing-nav-link" href={item.href} key={item.label}>
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="landing-nav-actions">
              <Link className="btn btn-gold ui-button-md" href="/login">
                Get started
              </Link>
            </div>
          </header>
        </div>

        <div className="landing-frame">
          <section className="landing-hero" id="platform">
            <div className="landing-hero-copy">
              <p className="landing-eyebrow">Ghana-first legal OS</p>
              <h1 className="landing-title">The matter is your operating system.</h1>
              <p className="landing-copy">
                Deadlines, documents, billing, and client updates stay anchored to the case they belong to — so your team moves without rebuilding context every morning.
              </p>

              <div className="landing-actions">
                <Link className="btn btn-gold ui-button-lg" href="/register">
                  Create your workspace
                </Link>
                <Link className="btn btn-ghost ui-button-lg" href="/login">
                  Sign in
                </Link>
              </div>

              <div className="landing-inline-proof">
                <div className="landing-inline-proof-item">
                  <strong>4.9 hrs</strong>
                  <span>Saved weekly per attorney</span>
                </div>
                <div className="landing-inline-proof-item">
                  <strong>Audit-first</strong>
                  <span>Every action stays traceable</span>
                </div>
                <div className="landing-inline-proof-item">
                  <strong>AI pending</strong>
                  <span>Suggestions wait for review</span>
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
        </div>
      </div>

      {/* Body: all sections below the hero band */}
      <div className="landing-frame landing-page-body">

        {/* Trust strip */}
        <section className="landing-trust-row" aria-label="Trusted by practice teams">
          <span className="landing-trust-label">Trusted by practice teams across Ghana</span>
          {trustFirms.map((firm) => (
            <span className="landing-trust-mark" key={firm}>{firm}</span>
          ))}
        </section>

        {/* Capabilities — asymmetric bento */}
        <section className="landing-capabilities-section" id="capabilities">
          <div className="landing-section-head">
            <div>
              <p className="landing-section-kicker">Core capabilities</p>
              <h2 className="landing-section-title">Three foundations. One record.</h2>
            </div>
            <p className="landing-section-copy">
              Built to keep the practice from fragmenting across tools and inboxes.
            </p>
          </div>

          <div className="landing-capability-bento">
            <article className="landing-capability-bento-main">
              <p className="landing-feature-eyebrow">{capabilityItems[0].eyebrow}</p>
              <h3>{capabilityItems[0].title}</h3>
              <p>{capabilityItems[0].copy}</p>
              <div className="landing-bento-stats" aria-label="Live practice metrics">
                <div className="landing-bento-stat">
                  <strong>126</strong>
                  <span>Active matters</span>
                </div>
                <div className="landing-bento-stat">
                  <strong>GHS 184k</strong>
                  <span>Collected this month</span>
                </div>
                <div className="landing-bento-stat">
                  <strong>18</strong>
                  <span>Deadlines this week</span>
                </div>
              </div>
            </article>

            <div className="landing-capability-bento-stack">
              {capabilityItems.slice(1).map((item) => (
                <article className="landing-capability-bento-card" key={item.eyebrow}>
                  <p className="landing-feature-eyebrow">{item.eyebrow}</p>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Performance section */}
        <section className="landing-performance-section" id="proof">
          <div className="landing-section-head">
            <div>
              <p className="landing-section-kicker is-inverse">Operational calm</p>
              <h2 className="landing-section-title">The team moves faster when the record stays intact.</h2>
            </div>
          </div>

          <div className="landing-performance-grid">
            {performanceTiles.map((item, i) => (
              <article className={`landing-performance-card${i % 2 !== 0 ? " is-gold" : ""}`} key={item.title}>
                <strong>{item.value}</strong>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="landing-how-section" id="how-it-works">
          <div className="landing-section-head">
            <div>
              <p className="landing-section-kicker">How it works</p>
              <h2 className="landing-section-title">From first instruction to final payment.</h2>
            </div>
            <p className="landing-section-copy">
              Three steps. One record. No context lost between them.
            </p>
          </div>

          <div className="landing-how-steps">
            {workflowSteps.map((item) => (
              <div className="landing-how-step" key={item.step}>
                <div className="landing-how-number" aria-hidden="true">{item.step}</div>
                <h3 className="landing-how-title">{item.title}</h3>
                <p className="landing-how-copy">{item.copy}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Integration story */}
        <section className="landing-story-section">
          <div className="landing-story-copy">
            <p className="landing-section-kicker is-gold">Organized by design</p>
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

        {/* Testimonial */}
        <section className="landing-testimonial" id="testimonial" aria-label="Customer testimonial">
          <div className="landing-testimonial-quote">
            <span className="landing-testimonial-mark" aria-hidden="true">"</span>
            <blockquote>
              Before LegalOS, our billing always ran a week behind the work. The invoice is now ready the same day the matter closes — that alone justified the subscription.
            </blockquote>
            <footer className="landing-testimonial-attr">
              <span className="landing-testimonial-name">Ama Owusu-Barimah</span>
              <span className="landing-testimonial-role">Managing Partner, Owusu &amp; Partners Legal</span>
            </footer>
          </div>
          <div className="landing-testimonial-badge" aria-hidden="true">
            <span className="landing-testimonial-initial">A</span>
          </div>
        </section>

        {/* Practice visibility */}
        <section className="landing-showcase-section">
          <div className="landing-showcase-head">
            <p className="landing-section-kicker is-gold">Practice visibility</p>
            <h2 className="landing-section-title">Simplify practice visibility for modern legal teams.</h2>
            <p className="landing-section-copy landing-showcase-copy">
              Clear case tasks, deadlines, and shared goals make the whole practice easier to steer.
            </p>
          </div>

          <div className="landing-visibility-grid" aria-label="Practice visibility highlights">
            {practiceVisibilityCards.map((item) => (
              <article className="landing-visibility-card" key={item.title}>
                <span className="landing-visibility-icon" aria-hidden="true">{item.symbol}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Pre-footer CTA */}
        <div className="landing-pre-footer-cta">
          <div className="landing-pre-footer-cta-copy">
            <p className="landing-pre-footer-kicker">Ready to bring order to your practice?</p>
            <h2 className="landing-pre-footer-title">Built for legal teams that need clarity, not clutter.</h2>
          </div>
          <div className="landing-pre-footer-actions">
            <Link className="btn btn-gold ui-button-md" href="/register">Get started</Link>
            <Link className="btn landing-cta-ghost ui-button-md" href="/login">Sign in</Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="landing-footer">
          <div className="landing-footer-inner">

            <div className="landing-footer-top">
              <div className="landing-footer-brand">
                <Link className="landing-brand" href="/">
                  <span className="landing-brand-mark" aria-hidden="true" />
                  <span>LegalOS</span>
                </Link>
                <p>
                  A Ghana-first legal operating system for case clarity, billing visibility, and review-first team work.
                </p>
                <p className="landing-footer-location">Accra, Ghana</p>
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

            <div className="landing-footer-bottom">
              <span>© 2026 LegalOS · Made in Accra, Ghana</span>
              <div className="landing-footer-legal-links">
                <Link href="#">Terms</Link>
                <span aria-hidden="true">·</span>
                <Link href="#">Privacy</Link>
                <span aria-hidden="true">·</span>
                <Link href="#">Security</Link>
              </div>
            </div>

          </div>
        </footer>
      </div>
    </main>
  );
}
