"use client";

import { usePathname } from "next/navigation";

const routeMeta = [
  {
    match: (pathname: string) => pathname === "/",
    title: "Good morning, Kwame.",
    subtitle: "Thursday, 27 February 2025 - 4 items need attention today",
  },
  {
    match: (pathname: string) => pathname.startsWith("/cases"),
    title: "Cases",
    subtitle: "Track case activity, deadlines, and case-level work.",
  },
  {
    match: (pathname: string) => pathname.startsWith("/tasks"),
    title: "Tasks",
    subtitle: "Manage personal and case-linked work across the firm.",
  },
  {
    match: (pathname: string) => pathname.startsWith("/calendar"),
    title: "Calendar",
    subtitle: "Keep hearings, filings, and meetings visible across the firm.",
  },
  {
    match: (pathname: string) => pathname.startsWith("/documents"),
    title: "Documents",
    subtitle: "Upload, review, and search case evidence in one place.",
  },
  {
    match: (pathname: string) => pathname.startsWith("/billing"),
    title: "Billing",
    subtitle: "Manage invoices, AR, and payment collection workflows.",
  },
  {
    match: (pathname: string) => pathname.startsWith("/settings"),
    title: "Settings",
    subtitle: "Control firm preferences, roles, and workspace defaults.",
  },
];

export function Topbar() {
  const pathname = usePathname();
  const meta =
    routeMeta.find((entry) => entry.match(pathname)) ?? routeMeta[0];
  const isTaskWorkspace = pathname === "/tasks" || pathname.endsWith("/tasks");

  return (
    <header className="app-topbar">
      <div>
        <h1 className="topbar-title">{meta.title}</h1>
        <p className="topbar-subtitle">{meta.subtitle}</p>
      </div>

      <div className="topbar-actions">
        {isTaskWorkspace ? null : (
          <label className="topbar-search" aria-label="Search">
            <SearchIcon />
            <input type="search" placeholder="Search cases, clients..." />
          </label>
        )}

        <button className="icon-button" type="button" aria-label="Notifications">
          <BellIcon />
          <span className="notification-dot" />
        </button>

        <button className="avatar-button" type="button" aria-label="Profile">
          KB
        </button>
      </div>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
