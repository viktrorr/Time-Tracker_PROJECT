# Prompt Log — Time Tracker (AI-Assisted Build)

Evaluator-friendly prompt and execution log for reproducibility.

---

## A) Phase Summary

| Step | Goal | Exact Prompt Used | AI Tool Used | Result Summary | Files Created / Changed | Notes / Manual Minimal Adjustments |
|---|---|---|---|---|---|---|
| 0 | Architecture planning | See **AI LOGS / Prompt 0** | Cline | Stack/architecture plan defined before implementation | Planning only | No code generated |
| 1 | Initial scaffold | See **AI LOGS / Prompt 1** | Cline + file edits | Next.js App Router scaffold with layered structure | Project scaffold files | Setup validated locally |
| 2 | Data layer | See **AI LOGS / Prompt 2** | Cline + Prisma | Prisma schema + repository pattern implemented | `prisma/*`, repository files | SQLite local, Postgres-ready |
| 3 | Backend/API layer | See **AI LOGS / Prompt 3** | Cline + route/service edits | Route handlers + service orchestration + validation | `src/app/api/*`, `application/services/*` | Consistent response/error shape |
| 4 | Client state/data layer | See **AI LOGS / Prompt 4** | Cline + React Query hooks | Typed API clients and feature hooks | `infrastructure/client/*`, `presentation/hooks/*` | Proper cache invalidation added |
| 5 | Dashboard UI | See **AI LOGS / Prompt 5** | Cline + UI components | Sticky timer, timer form, today list, project totals | `presentation/components/dashboard/*`, `DashboardPage.tsx` | Presentational split preserved |
| 6 | Today entries management | See **AI LOGS / Prompt 6** | Cline + UI/service updates | Edit/delete/manual duration correction completed | `TodayEntryRow.tsx`, `EntryDurationForm.tsx`, service/utils updates | Strict `hh:mm` + completed-only rule |
| 7 | Grouping summary | See **AI LOGS / Prompt 7** | Cline | Reusable project grouping summary integrated | `project-grouping.ts`, totals component/hook updates | Defensive no-project handling |
| 8 | Projects page | See **AI LOGS / Prompt 8** | Cline + UI/hooks | Full `/projects` management implemented | `ProjectsSection.tsx`, `ProjectForm.tsx`, `useProjectsManagement.ts`, etc. | Color consistency via shared dot component |
| 9 | Reports page | See **AI LOGS / Prompt 9** | Cline + API/UI/hooks | `/reports` with filters, summaries, entries table, CSV export | reports components/hooks + API/service updates | Filter-matched CSV export |
| 10 | Reliability/UX audit | See **AI LOGS / Prompt 10** | Cline + refactors | Edge-case hardening and accessibility/mobile polish | dashboard/projects/reports hooks/components + parsers/http client | Double-submit + date validation + export-empty UX fixed |
| 11 | README | See **AI LOGS / Prompt 11** | Cline | Professional evaluator-facing README created | `README.md` | Includes placeholders for demo/repo/log |
| 12 | Prompt log artifact | See **AI LOGS / Prompt 12** | Cline | Initial prompt log document created | `docs/prompt-log.md` | This file |
| 13 | Final release-readiness review | See **AI LOGS / Prompt 13** | Pending/next | Checklist pass/fail + missing items + final fixes | *(to be filled after review step)* | Reserved phase |

---

## B) AI LOGS (Verbatim Prompt Set)

### Prompt 0
```text
You are a senior full-stack architect.
Help me design a production-ready implementation plan for a Time Tracker test task.

Context:
I need to build a full web app with:
- Start/Stop timer
- task name input with autocomplete from previous tasks
- project/client selection
- always-visible active timer at the top
- today entries list with edit task/project, manual duration correction in hh:mm, delete
- grouping by project with total time
- projects management page with add/edit and color
- reports by day/week/month
- CSV export

Technical constraints:
- clean architecture
- separate presentation / state-logic / API layer / data layer
- no “everything in one file”
- use modern frontend framework, recommended Next.js / React
- DB via ORM with SQLite/Postgres
- public deploy URL required
- README required
- prompt log required because development must be reproducible through AI tools

Task:
1. Propose the best stack for fastest and cleanest implementation.
2. Propose folder structure.
3. Define entities, DB schema, API endpoints, pages, components.
4. Identify edge cases and acceptance criteria.
5. Output a phased implementation plan with priorities.

Do not generate code yet. Be concrete and opinionated.
```

### Prompt 1
```text
Generate a production-ready Next.js 14+ App Router project scaffold using:
- TypeScript
- TailwindCSS
- Prisma ORM
- SQLite for local development
- clean folder structure
- ESLint + Prettier-ready conventions

Requirements:
- use src/ layout
- create pages:
  - /          dashboard
  - /projects  project management
  - /reports   reports
- create reusable shared layout with top navigation
- add placeholder sections for timer, entries, projects, reports
- create prisma client singleton
- create environment example file
- do not put business logic in page files
- keep architecture ready for presentation / services / repositories separation

Output:
1. full file tree
2. all generated files
3. setup commands
4. any notes for local run
```

### Prompt 2
```text
Design the Prisma schema and repository layer for a Time Tracker app.

Entities:
- Project
- TimeEntry
- TaskName

Functional rules:
- one active running time entry at a time
- TimeEntry stores task name, linked project, start/end timestamps, duration in minutes, running status
- TaskName is used for autocomplete from previous tasks
- Project has a color for visual highlighting
- entries must support manual duration correction
- reports must support filtering by day/week/month and grouping by project

Requirements:
- provide Prisma schema
- explain key constraints and indexes
- create repository interfaces and concrete repository files
- separate repository layer from business services
- keep code ready for SQLite locally and Postgres in production
- include seed data for a few projects and tasks

Output only files and explanations needed for the data layer.
```

### Prompt 3
```text
Implement the backend/API layer for the Time Tracker app in Next.js route handlers.

Requirements:
- create route handlers for:
  - GET/POST /api/projects
  - PUT /api/projects/[id]
  - GET /api/task-names
  - GET /api/time-entries
  - POST /api/time-entries/start
  - POST /api/time-entries/stop
  - PATCH /api/time-entries/[id]
  - DELETE /api/time-entries/[id]
  - GET /api/reports
  - GET /api/reports/export
- use service layer between routes and repositories
- validate all inputs with zod
- return consistent JSON response shape
- handle errors cleanly
- support CSV export for reports
- enforce rule that only one running timer can exist at a time
- when a timer is stopped, persist computed duration in minutes
- when task names are created/used, keep autocomplete source updated

Architecture rules:
- route handlers must stay thin
- business logic in services
- DB access only through repositories
- no duplicated logic

Output complete file implementations.
```

### Prompt 4
```text
Implement the client-side state and data access layer for the Time Tracker app.

Requirements:
- use React Query for server state
- use a small local store only if needed for UI state
- create typed API client functions for projects, task names, time entries, reports
- create feature-specific hooks:
  - useProjects
  - useTodayEntries
  - useTaskNameSuggestions
  - useActiveTimer
  - useReports
- cache and invalidate queries correctly after mutations
- keep concerns separated from presentation components
- ensure running timer UI updates every second without refetching the database every second

Output the API client files, hooks, and any provider setup required.
```

### Prompt 5
```text
Build the main dashboard UI for the Time Tracker app.

Requirements:
- create a sticky top active timer bar that is always visible
- create a timer form with:
  - task name input
  - autocomplete dropdown from previous task names
  - project select dropdown
  - Start / Stop buttons
- if a timer is already running, reflect that state clearly
- disable invalid actions
- show inline validation and loading states
- below the form show today's entries list
- also show grouped totals by project for today's entries
- use clean modern UI with Tailwind
- color-code entries/projects using project color
- keep UI components presentational and move logic to hooks/services
- make the dashboard feel fast and intuitive

Edge cases:
- prevent starting second active timer
- handle empty state
- handle long task names gracefully
- handle no projects yet
- handle API failure states

Output complete files for the dashboard page and related presentational components.
```

### Prompt 6
```text
Implement the Today Entries list for the Time Tracker app.

Requirements:
- show all today's entries
- each entry supports:
  - edit task name
  - edit project
  - manual duration correction in hh:mm format
  - delete
- validate manual duration input strictly
- convert hh:mm to minutes safely
- display friendly formatted duration
- do not allow invalid negative or zero-like malformed durations
- visually distinguish running vs completed entries
- support optimistic UI only if safe, otherwise use reliable mutation states
- keep row components small and reusable

Business rules:
- manual duration correction should apply only to completed entries
- project grouping summary must update after edits/deletes
- after editing task name, autocomplete source should remain consistent

Output complete files for components, hooks usage, and necessary validation helpers.
```

### Prompt 7
```text
Implement a project grouping summary for today's time entries.

Requirements:
- group entries by project
- show project color, name, total tracked time, and optional entry count
- handle entries without project defensively if such data exists
- keep calculations correct after create/edit/delete operations
- format durations nicely
- design it as a reusable presentational component fed by prepared data

Output the component and any helper functions needed.
```

### Prompt 8
```text
Build the Projects management page for the Time Tracker app.

Requirements:
- separate /projects page
- list existing projects
- create new project
- edit existing project
- assign a color to each project
- provide a clean color picker or predefined color palette
- validate required fields
- prevent duplicate project names if possible
- show project color previews consistently across the app
- keep page architecture aligned with presentation/components + hooks + services

Output complete files for the projects page and related components.
```

### Prompt 9
```text
Build the Reports page for the Time Tracker app.

Requirements:
- route: /reports
- allow selecting report period: day, week, month
- allow selecting anchor date
- fetch report data from API
- show:
  - total tracked time
  - grouped totals by project
  - detailed entries table for the selected period
- provide CSV export button
- CSV export should match the selected report filters
- use clean, fast UI with clear loading/empty/error states

Architecture rules:
- page remains thin
- query/filter logic in hooks
- formatting helpers extracted
- reusable report summary components

Output complete files for reports UI and related helper components.
```

### Prompt 10
```text
Audit the Time Tracker app for edge cases, reliability, and UX polish.

Review these areas:
- empty states
- loading states
- mutation pending states
- double-submit protection
- timer consistency
- date boundary correctness
- malformed manual duration input
- no projects available
- report export on empty data
- graceful API failure handling
- accessibility basics
- mobile responsiveness
- sticky active timer behavior

Task:
1. list all detected risks and missing edge-case handling
2. propose precise fixes
3. implement the fixes in code
4. keep architecture clean and avoid hacks
```

### Prompt 11
```text
Write a strong README for this Time Tracker project.

README must include:
- project overview
- implemented features
- chosen tech stack and why
- architecture explanation
- folder structure overview
- database setup
- environment variables
- local development instructions
- build and deploy instructions
- API overview
- trade-offs / key implementation decisions
- note that the project was developed through AI-assisted workflow
- link/placeholders for live demo and repository
- reference to prompt log artifacts

Make it professional, concise, and evaluator-friendly.
```

### Prompt 12
```text
Create a prompt log document for this AI-built Time Tracker project.

Requirements:
- markdown format
- evaluator-friendly
- include columns or sections for:
  - step number
  - goal
  - exact prompt used
  - AI tool used
  - result summary
  - files created/changed
  - notes / manual minimal adjustments
- initialize it with entries matching the project implementation phases

Output a complete docs/prompt-log.md file.
```

### Prompt 13
```text
Perform a final release-readiness review for this Time Tracker app.

Check against this acceptance checklist:
- working public deployment URL
- repository is clean and push-ready
- README is complete
- prompt log exists and is understandable
- all required features from the task are implemented
- architecture is clean and separated
- no “everything in one file”
- local setup works
- database migrations work
- demo data/seed works
- reports and CSV export work
- project management works
- active timer works correctly
- today entries editing works
- autocomplete works

Task:
1. produce a pass/fail checklist
2. identify missing items
3. generate the exact final fixes needed
```
