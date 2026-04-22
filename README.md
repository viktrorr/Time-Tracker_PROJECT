Used: CLINE + GPT 5.3 codex

# Time Tracker

Production-oriented full-stack Time Tracker test task built with **Next.js + TypeScript + Prisma**.

> Live demo: **https://time-tracker-project-lguy.vercel.app/**  
> Repository: **https://github.com/viktrorr/Time-Tracker_PROJECT**

---

## 1) Project overview

This project implements a complete time-tracking web app with:
- start/stop timer
- task name autocomplete (based on previous usage)
- project/client assignment with color coding
- always-visible active timer bar
- today entries management (edit/delete/manual duration correction)
- grouped totals by project
- project management page
- reports by day/week/month
- CSV export matching current report filters

The implementation prioritizes **clean architecture**, reliable mutation handling, and evaluator-friendly code organization.

---

## 2) Implemented features

### Dashboard (`/`)
- Start/Stop active timer
- Task input + autocomplete suggestions
- Project selector
- Sticky active timer bar
- Today entries list
  - edit task name
  - edit project
  - manual duration correction in `hh:mm`
  - delete with confirmation
- Visual running vs completed state
- Grouped totals by project (+ entry count)

### Projects (`/projects`)
- List projects
- Create project
- Edit existing project
- Color assignment via predefined palette
- Duplicate-name protection (client-side + DB unique index)

### Reports (`/reports`)
- Period filter: day / week / month
- Anchor date filter
- Total tracked time KPI
- Grouped totals by project
- Detailed entries table
- CSV export that uses active filter query params

### Reliability / UX hardening
- Double-submit protection for key mutations
- Strict manual duration validation (`hh:mm`, non-zero)
- Strict date parsing for report inputs
- Robust API client handling for malformed/non-JSON responses
- Loading / empty / error states across pages
- Basic accessibility improvements (`label`, `htmlFor`, `aria-live`, `role=alert`)

---

## 3) Chosen tech stack (and why)

- **Next.js 14 (App Router)**: fast full-stack delivery with API routes + React UI in one codebase.
- **React 18 + TypeScript**: strong typing and maintainable UI composition.
- **Prisma ORM**: quick, reliable DB layer with schema-driven development.
- **SQLite (dev) / PostgreSQL (prod-ready option)**: local simplicity + production scalability.
- **TanStack Query**: predictable server-state management and mutation lifecycle handling.
- **Tailwind CSS**: fast, consistent UI styling.
- **Zod**: input validation at API boundaries.

---

## 4) Architecture explanation

The code follows a layered architecture:

- **Presentation layer** (`src/presentation`)  
  Pages, UI components, and client hooks for screen-level orchestration.

- **Application layer** (`src/application`)  
  Use-case services (`time-entry-service`, `project-service`, `report-service`) with business rules.

- **Domain layer** (`src/domain`)  
  Entities and repository interfaces.

- **Infrastructure layer** (`src/infrastructure`)  
  Prisma repositories, API route adapters, HTTP client, DB wiring.

- **Shared layer** (`src/shared`)  
  Reusable utils, error types, and cross-cutting helpers.

This separation keeps UI concerns, business rules, and persistence concerns independent and testable.

---

## 5) Folder structure overview

```txt
src/
  app/                 # Next.js routes (pages + API)
    api/
  application/         # Business services / use-cases
  domain/              # Entities + repository contracts
  infrastructure/      # Prisma repositories, API adapters, client http
  presentation/        # Components, pages, UI hooks
  shared/              # Utilities, errors, date/duration helpers

prisma/
  schema.prisma
  seed.ts
```

---

## 6) Database setup

Default development DB is SQLite.

### Prisma schema highlights
- `Project` (name, client, color, archived)
- `TimeEntry` (task, project, start/end, duration, running state, entryDate)
- `TaskName` (normalized suggestion source with usage counters)

### Commands
```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

For quick local schema sync (without migrations):
```bash
npm run prisma:push
```

---

## 7) Environment variables

Copy `.env.example` to `.env`.

```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_APP_NAME="Time Tracker"
```

Production Postgres example (from `.env.example`):
```env
DATABASE_URL="postgresql://user:password@host:5432/time_tracker?schema=public"
```

---

## 8) Local development instructions

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Useful checks:
```bash
npm run typecheck
npm run lint
```

---

## 9) Build and deploy instructions

### Production build
```bash
npm run build
npm run start
```

### Deploy notes
- Recommended: **Vercel** for fastest Next.js deployment.
- For production, prefer **PostgreSQL** over SQLite.
- Set environment variables in deployment platform.
- Run Prisma migration step during CI/CD or release.

Example deployment flow:
1. Push repo
2. Configure `DATABASE_URL`
3. Build (`npm run build`)
4. Run migrations
5. Start app

---

## 10) API overview

### Time Entries
- `GET /api/time-entries?date=YYYY-MM-DD`
- `POST /api/time-entries/start`
- `POST /api/time-entries/stop`
- `PATCH /api/time-entries/:id`
- `DELETE /api/time-entries/:id`

### Projects
- `GET /api/projects`
- `POST /api/projects`
- `PUT /api/projects/:id`

### Task Names (autocomplete)
- `GET /api/task-names?query=...&limit=...`

### Reports
- `GET /api/reports?range=day|week|month&date=YYYY-MM-DD`
- `GET /api/reports/export?range=day|week|month&date=YYYY-MM-DD`

---

## 11) Trade-offs and key implementation decisions

- **Single active timer constraint** enforced in service + DB transaction paths.
- **No optimistic UI** for critical mutations (start/stop/edit/delete) to favor correctness.
- **Duration correction only for completed entries** (business rule enforced server-side).
- **Client-side duplicate-name checks** improve UX, while DB uniqueness remains source of truth.
- **SQLite in development** for speed; **Postgres recommended** for deployment.

---

## 12) AI-assisted workflow note

This project was developed through an **AI-assisted workflow** with iterative implementation and review.

- Prompt log artifacts: **https://github.com/viktrorr/Time-Tracker_PROJECT/blob/master/docs/prompt-log.md**
- Reproducibility note: feature work was delivered in small, reviewable increments.

---

## 13) Evaluation quick links (placeholders)

- Live demo: **https://time-tracker-project-lguy.vercel.app/**
- Source repository: **https://github.com/viktrorr/Time-Tracker_PROJECT**
- Prompt log: **https://github.com/viktrorr/Time-Tracker_PROJECT/blob/master/docs/prompt-log.md**
