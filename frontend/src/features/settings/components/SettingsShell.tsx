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
  },
  {
    href: "/settings/practice",
    step: "01",
    label: "Practice",
    description: "Firm identity, defaults, and operational rules.",
  },
  {
    href: "/settings/team",
    step: "02",
    label: "Team",
    description: "User seats, role coverage, and access status.",
  },
  {
    href: "/settings/account",
    step: "03",
    label: "Account",
    description: "Your profile, sessions, and preferences.",
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
  return (
    <section className="settings-hub">
      <div className="surface-card settings-workspace-frame">
        <div className="settings-nav-card settings-nav-card-top">

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
