"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/settings/practice",
    label: "Practice",
    description: "Firm identity, defaults, and operational rules.",
  },
  {
    href: "/settings/team",
    label: "Team",
    description: "User seats, role coverage, and access status.",
  },
  {
    href: "/settings/account",
    label: "Account",
    description: "Your profile, sessions, and preferences.",
  },
];

export function SettingsShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <section className="settings-hub">
      <div className="surface-card settings-hub-hero">
        <div className="settings-hub-copy">
          <p className="eyebrow-label">Firm Governance</p>
          <h2 className="matter-title">A quieter control room for the practice side of the firm.</h2>
          <p className="settings-hub-text">
            Manage office defaults, staff access, and personal security posture without dropping out of the
            practitioner workflow.
          </p>
        </div>

        <div className="settings-hub-metrics" aria-label="Settings overview">
          <div className="settings-hub-metric">
            <span>Sections</span>
            <strong>3</strong>
          </div>
          <div className="settings-hub-metric">
            <span>Scope</span>
            <strong>Practice + team + self</strong>
          </div>
          <div className="settings-hub-metric">
            <span>Controls</span>
            <strong>Role-aware</strong>
          </div>
        </div>
      </div>

      <div className="settings-shell-grid">
        <aside className="surface-card settings-nav-card">
          <div className="settings-nav-head">
            <p className="settings-nav-kicker">Inside Settings</p>
            <p className="placeholder-copy">
              Keep firm-wide controls separate from personal account changes.
            </p>
          </div>

          <nav aria-label="Settings sections" className="settings-nav-list">
            {navItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn("settings-nav-link", active && "is-active")}
                >
                  <span className="settings-nav-label">{item.label}</span>
                  <span className="settings-nav-description">{item.description}</span>
                </Link>
              );
            })}
          </nav>

          <div className="settings-nav-footnote">
            Tenant scoping stays firm-bound, and admin mutations never rely on client-supplied firm IDs.
          </div>
        </aside>

        <div className="settings-shell-content">{children}</div>
      </div>
    </section>
  );
}
