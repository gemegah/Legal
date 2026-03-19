"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/settings",
    step: "00",
    label: "Overview",
    description: "See the full governance picture before opening a specific room.",
    meta: "Best for orientation and quick status checks.",
  },
  {
    href: "/settings/practice",
    step: "01",
    label: "Practice",
    description: "Firm identity, defaults, and operational rules.",
    meta: "Workspace name, reminders, billing language.",
  },
  {
    href: "/settings/team",
    step: "02",
    label: "Team",
    description: "User seats, role coverage, and access status.",
    meta: "Invites, role hygiene, and billing authority.",
  },
  {
    href: "/settings/account",
    step: "03",
    label: "Account",
    description: "Your profile, sessions, and preferences.",
    meta: "Personal posture, security, and signal tuning.",
  },
];

export function SettingsShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isActivePath = (href: string) => {
    if (href === "/settings") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };
  const activeItem = navItems.find((item) => isActivePath(item.href)) ?? navItems[0];

  return (
    <section className="settings-hub">
      <div className="surface-card settings-workspace-frame">
        {/* <div className="settings-topbar">
          <div className="settings-topbar-copy">
            <p className="eyebrow-label">Settings</p>
            <div>
              <h2 className="case-title">Configure the firm in one deliberate workspace.</h2>
              <p className="settings-hub-text">
                Practice policy, team access, and personal controls should feel like one connected system.
              </p>
            </div>
          </div>

          <div className="settings-topbar-focus" aria-live="polite">
            <span>In focus now</span>
            <strong>{activeItem.label}</strong>
            <p>{activeItem.meta}</p>
          </div>
        </div> */}

        <div className="settings-nav-card settings-nav-card-top">
          {/* <div className="settings-nav-head settings-nav-head-inline">
            <p className="settings-nav-kicker">Inside Settings</p>
            <p className="placeholder-copy">Move from firm defaults to personal controls in one consistent workspace.</p>
          </div> */}

          <nav aria-label="Settings sections" className="settings-nav-list">
            {navItems.map((item) => {
              const active = isActivePath(item.href);

              return (
                <Link
                  aria-current={active ? "page" : undefined}
                  key={item.href}
                  className={cn("settings-nav-link", active && "is-active")}
                  href={item.href}
                  title={item.description}
                >
                  <span className="settings-nav-index">{item.step}</span>
                  <span className="settings-nav-label">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="settings-shell-content">{children}</div>
      </div>
    </section>
  );
}
