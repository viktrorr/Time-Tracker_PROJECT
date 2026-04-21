# Prompt Log — Time Tracker (AI-Assisted Build)

This document records the main AI-assisted implementation phases for evaluator review and reproducibility.

## Scope
- Project: **Time Tracker**
- Workflow: **AI-assisted incremental implementation**
- Purpose: traceability of prompts, tools, outputs, and touched files

---

## Prompt Log Table

| Step | Goal | Exact Prompt Used | AI Tool Used | Result Summary | Files Created / Changed | Notes / Manual Minimal Adjustments |
|---|---|---|---|---|---|---|
| 1 | Define implementation plan and architecture | "You are a senior full-stack architect... propose best stack, folder structure, entities, DB schema, API endpoints, pages, edge cases, phased plan" | Cline (analysis + planning) | Produced opinionated production-ready plan for a Next.js + Prisma implementation with clean layering | *(planning only)* | No code generated at this stage |
| 2 | Build Dashboard base experience | "Implement dashboard placeholders + presentational components + hook wiring" | Cline + file editing + typecheck | Added sticky active timer, timer form, today entries list, grouped totals, centralized `useDashboard` orchestration | `src/presentation/hooks/useDashboard.ts`, `src/presentation/pages/DashboardPage.tsx`, `src/presentation/components/dashboard/*` | Iterative UI polish during subsequent steps |
| 3 | Implement Today Entries full management | "Implement Today Entries list... edit task/project, manual duration hh:mm correction, delete, strict validation" | Cline + code edits + typecheck | Added reusable row-level editing, duration correction UI, delete flow, completed-only duration correction rule | `TodayEntriesSection.tsx`, `TodayEntryRow.tsx`, `EntryDurationForm.tsx`, `shared/utils/duration.ts`, `application/services/time-entry-service.ts`, `useDashboard.ts` | Used reliable mutation states (non-optimistic) |
| 4 | Add project grouping summary (today) | "Implement project grouping summary... color, name, total, optional count" | Cline + code edits + typecheck | Extracted reusable grouping helper and updated totals component to include entry count and defensive fallbacks | `project-grouping.ts`, `ProjectTotalsSection.tsx`, `useDashboard.ts` | Grouping recalculates from prepared entries after mutations |
| 5 | Build Projects management page | "Build /projects page... list/create/edit project, color picker/palette, validation, duplicate prevention" | Cline + code edits + typecheck | Replaced placeholder with complete project management UI and state hook | `useProjectsManagement.ts`, `ProjectsSection.tsx`, `ProjectForm.tsx`, `ProjectListItem.tsx`, `ProjectColorPicker.tsx`, `project-colors.ts`, `ui/ColorDot.tsx` | DB uniqueness remains source of truth; client duplicate check improves UX |
| 6 | Build Reports page | "Build /reports page... day/week/month + anchor date + grouped totals + entries table + CSV export" | Cline + API/service/presentation edits + typecheck | Implemented filter-driven reports UI with summary cards, project totals, detailed entries, and CSV export | `ReportsSection.tsx`, `ReportFilters.tsx`, `ReportSummaryCards.tsx`, `ReportProjectTotals.tsx`, `ReportEntriesTable.tsx`, `reports-formatters.ts`, `useReportsPage.ts`, `useReports.ts`, `reports-api.ts`, `contracts.ts`, `app/api/reports/route.ts`, `application/services/report-service.ts` | API response expanded to include detailed entries alongside grouped rows |
| 7 | Reliability + edge-case + UX audit fixes | "Audit app for edge cases, reliability, UX polish... list risks, propose fixes, implement" | Cline + targeted refactors + typecheck | Hardened double-submit protection, strict date parsing, non-JSON API resilience, timer consistency, accessibility and mobile sticky behavior | `http-client.ts`, `parse-date.ts`, `useDashboard.ts`, `useActiveTimer.ts`, `TimerForm.tsx`, `TodayEntriesSection.tsx`, `TodayEntryRow.tsx`, `EntryDurationForm.tsx`, `ActiveTimerBar.tsx`, `useProjectsManagement.ts`, `ProjectForm.tsx`, `ProjectsSection.tsx`, `useReportsPage.ts`, `ReportFilters.tsx`, `ReportsSection.tsx`, `time-entry-service.ts` | Delete confirmation added; export disabled on empty grouped data |
| 8 | Produce evaluator-friendly README | "Write a strong README... include overview, stack, architecture, setup, API, trade-offs, AI workflow, links/placeholders, prompt log reference" | Cline + documentation authoring | Added comprehensive professional README aligned with current codebase and scripts | `README.md` | Placeholders kept for live demo/repo/prompt-log URLs |
| 9 | Produce prompt log artifact | "Create a prompt log document... markdown... include step, goal, exact prompt, tool, result, files, notes" | Cline + documentation authoring | Added this reproducibility document with phased implementation entries | `docs/prompt-log.md` | Entries grouped by implementation phases for evaluator readability |

---

## Additional Notes

- Tooling used throughout: file readers/search, patch-based edits, and `npm run typecheck` verification after implementation waves.
- Manual adjustments were minimal and limited to normalizing documentation wording and preserving architecture consistency.
- The project was developed in small, reviewable increments to keep behavior stable while adding features.
