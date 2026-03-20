"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const routeMeta = [
  {
    match: (pathname: string) => pathname === "/dashboard",
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

const mockNotifications = [
  {
    id: 1,
    title: "Deadline approaching",
    body: "Asante v. Mensah — hearing on Mar 6 is in 2 days.",
    unread: true,
  },
  {
    id: 2,
    title: "Task assigned to you",
    body: "Finalize affidavit bundle for CAS-2026-014.",
    unread: true,
  },
  {
    id: 3,
    title: "Document shared",
    body: "Ama Osei shared a draft on Darko Estate.",
    unread: false,
  },
];

export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const meta = routeMeta.find((entry) => entry.match(pathname)) ?? routeMeta[0];
  const isTaskWorkspace = pathname === "/tasks" || pathname.endsWith("/tasks");

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = mockNotifications.filter((n) => n.unread).length;

  function handleSignOut() {
    setProfileOpen(false);
    setNotifOpen(false);
    router.replace("/login");
  }

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

        <div className="topbar-dropdown-anchor" ref={notifRef}>
          <button
            className="icon-button"
            type="button"
            aria-label="Notifications"
            aria-expanded={notifOpen}
            onClick={() => { setNotifOpen((v) => !v); setProfileOpen(false); }}
          >
            <BellIcon />
            {unreadCount > 0 && <span className="notification-dot" />}
          </button>

          {notifOpen && (
            <div className="topbar-panel notif-panel">
              <div className="topbar-panel-header">
                <span className="topbar-panel-title">Notifications</span>
                {unreadCount > 0 && (
                  <span className="topbar-panel-badge">{unreadCount} new</span>
                )}
              </div>
              <ul className="notif-list">
                {mockNotifications.map((n) => (
                  <li className={`notif-item${n.unread ? " is-unread" : ""}`} key={n.id}>
                    <p className="notif-title">{n.title}</p>
                    <p className="notif-body">{n.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="topbar-dropdown-anchor" ref={profileRef}>
          <button
            className="avatar-button"
            type="button"
            aria-label="Profile"
            aria-expanded={profileOpen}
            onClick={() => { setProfileOpen((v) => !v); setNotifOpen(false); }}
          >
            KB
          </button>

          {profileOpen && (
            <div className="topbar-panel profile-panel">
              <div className="topbar-panel-header">
                <span className="topbar-panel-title">Kwame Boateng</span>
                <span className="topbar-panel-meta">Admin</span>
              </div>
              <ul className="profile-menu">
                <li>
                  <Link className="profile-menu-item" href="/settings" onClick={() => setProfileOpen(false)}>
                    Account Settings
                  </Link>
                </li>
                <li>
                  <button className="profile-menu-item is-danger" onClick={handleSignOut} type="button">
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
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
