# Dead Buttons & CTAs Audit

> Generated: 2026-03-18
> Scope: All frontend pages and components
> Backend status: Not yet implemented — items marked "Frontend + Backend" will need an API before they can be fully wired.

---

## Dashboard

| Button / CTA | Use Case Description | What it should do | Fix needed |
|---|---|---|---|
| "All Types" filter | A practitioner on the dashboard wants to narrow the active cases table to a specific case type (e.g. only "Commercial Litigation") without leaving the dashboard. | Filter the active cases table in place by the selected case type. | Frontend |
| "+ New Case" (dashboard) | A lawyer receives a new client instruction and wants to open a matter immediately from the dashboard without navigating away. | Open the case creation flow — either a modal or redirect to an intake form. | Frontend |
| "View all 12 cases" | A user glances at the dashboard summary and wants to jump to the full cases list to see everything, not just the top few. | Navigate to the Cases workspace (`/cases`). | Frontend |
| "View calendar" | A user sees upcoming deadlines on the dashboard widget and wants to open the full calendar for context. | Navigate to the Calendar workspace (`/calendar`). | Frontend |
| "AR report" | A practice manager reviewing the recent payments widget wants to pull a full accounts receivable report for billing oversight. | Navigate to the billing/AR report page or open the billing workspace filtered to outstanding invoices. | Frontend |
| "Accept" on AI suggestions | The AI surface suggests an action — e.g. "A deadline is approaching, create a calendar event" or "This matter has outstanding time, draft an invoice." The practitioner wants to act on it in one click. | Execute the suggested action: create the calendar event, save the invoice draft, or generate the case summary, depending on the suggestion category. | Frontend + Backend |

---

## Cases Workspace

| Button / CTA | Use Case Description | What it should do | Fix needed |
|---|---|---|---|
| "Export" | A practice manager wants a snapshot of the current filtered case list — e.g. all active cases assigned to a specific lawyer — to paste into a report or share with a partner. | Generate and download the visible case list as a CSV file. | Frontend |
| "+ New Case" (cases workspace) | A lawyer opening the cases list wants to create a new matter directly from this screen without going elsewhere. | Open the case creation flow — modal or intake page. | Frontend |
| "Practice Area" filter | A user working across multiple practice areas wants to quickly narrow the cases list to just one area, e.g. "Employment" or "Commercial." | Open a dropdown or filter panel to select a practice area and update the list. | Frontend |

---

## Case Detail

| Button / CTA | Use Case Description | What it should do | Fix needed |
|---|---|---|---|
| "Edit Case" | A lawyer needs to update a case — change the lead lawyer, update the court, correct the opposing party name, or change the status. | Open a case edit modal or panel pre-filled with the current case data. | Frontend + Backend |
| "Add Task" | While reviewing a case, a lawyer identifies an action item and wants to log it immediately against this matter without switching to the tasks screen. | Open the task creation modal with the case pre-selected. | Frontend |
| "Log Time" | A lawyer has just completed work on a matter and wants to record billable time against it before they forget. | Open a time entry modal pre-filled with the current case, ready to capture hours, rate, and description. | Frontend + Backend |
| "Upload Document" | A practitioner receives a court notice or signed agreement and needs to attach it to the matter immediately from the case detail view. | Open the document upload modal with the case pre-selected. | Frontend |
| "Request AI Summary" | A lawyer picking up a case they haven't touched in a while wants a quick AI-generated summary of recent activity and key details to get up to speed fast. | Call the AI service with the case data and display the generated summary in the case detail panel. | Frontend + Backend |
| "Archive Case" | A matter has concluded and the practice manager wants to remove it from active views and mark it as archived for record-keeping. | Show a confirmation prompt, then archive the case and redirect back to the cases list. | Frontend + Backend |

---

## Navigation / Layout

| Button / CTA | Use Case Description | What it should do | Fix needed |
|---|---|---|---|
| Global search (Topbar) | A practitioner remembers a client name or case reference but doesn't know where to navigate. They want to type it in the top bar and jump straight to the relevant record. | Search across cases, clients, documents, and tasks simultaneously and show results in a dropdown or results page. | Frontend + Backend |
| Notifications button (Topbar) | A lawyer wants to see recent activity alerts — a task assigned to them, a document shared, a deadline approaching — without navigating away from their current page. | Open a notifications panel or drawer showing recent alerts. | Frontend |
| Profile / Avatar button (Topbar) | A user wants to view their profile, change their password, or sign out of the application. | Open a profile dropdown menu with options for account settings and sign out. | Frontend |

---

## Calendar

| Button / CTA | Use Case Description | What it should do | Fix needed |
|---|---|---|---|
| "Join Meeting" (event detail modal) | A lawyer opens a calendar event for a client call or court hearing and wants to jump directly into the video call without hunting for the link elsewhere. | Open the meeting URL attached to the event (Zoom, Google Meet, Teams, etc.) in a new tab. | Frontend |

---

## Messages

| Button / CTA | Use Case Description | What it should do | Fix needed |
|---|---|---|---|
| Attachments input (disabled) | A lawyer corresponding with a client via the messages thread wants to attach a document — a contract draft, a court filing — directly in the message without switching to the documents screen. | Enable file selection, upload the file to storage, and attach it to the outgoing message. | Frontend + Backend |

---

## Summary

| Category | Count |
|---|---|
| Frontend-only fixes | 14 |
| Frontend + Backend fixes | 7 |
| **Total dead elements** | **21** |
