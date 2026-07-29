# Zygno Education Institute Management System (Mini-MVP)

A simplified Education Institute Management System built as a Mini-MVP for the Full-Stack Developer Intern Assignment.

**Engines:** Node ≥ 24, pnpm ≥ 11.

---

## How to Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/lakshan2001sachintha/MVP_zygno-.git
cd MVP_zygno-
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Supabase

1. Create a free project at [supabase.com](https://supabase.com/).
2. Go to **SQL Editor** and run the database schema script found in [`ASSIGNMENT_GUIDE.md`](./ASSIGNMENT_GUIDE.md) (Step 1).
3. Go to **Project Settings → API** and copy your **Project URL** and **Anon Key**.

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
```

### 5. Start the Dev Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Tech Stack

| Layer          | Technology                                                    |
| -------------- | ------------------------------------------------------------- |
| Framework      | [TanStack Start](https://tanstack.com/start) (SSR React)     |
| Routing        | [TanStack Router](https://tanstack.com/router) (file-based)  |
| Server         | [Nitro](https://nitro.build/) (`node-server` preset)          |
| Auth & DB      | [Supabase](https://supabase.com/) (PostgreSQL + Auth)         |
| Styling        | [Tailwind CSS v4](https://tailwindcss.com/) + Shadcn UI       |
| Language       | TypeScript                                                    |
| Forms          | [TanStack Form](https://tanstack.com/form) + Zod              |
| Data Fetching  | [TanStack Query](https://tanstack.com/query)                  |
| Testing        | [Vitest](https://vitest.dev/)                                 |

### Why This Stack?

- **TanStack Start** provides full-stack SSR React with type-safe routing and server functions, eliminating the need for a separate API layer.
- **Supabase** gives us authentication, a PostgreSQL database, and Row Level Security policies out of the box — no need to build auth from scratch.
- **Tailwind CSS + Shadcn UI** enables rapid, consistent UI development with utility-first styling.
- **TypeScript** catches bugs at compile time and provides excellent DX with autocomplete and type inference.

---

## Core Features

1. **User Management (Role-Based):** Admin, Teacher, Student roles via Supabase Auth. Admins can view all users and create new ones.
2. **Module/Course Management:** CRUD operations on educational modules with title, description, credits, and assigned teacher.
3. **Admin Dashboard:** Stats overview (students, teachers, modules), user registry, teacher approval system.
4. **Module Explorer:** Students browse available modules and see assigned instructors.
5. **Teacher Workspace:** Teachers view and edit only their assigned modules.

---

## AI Usage

I used **Antigravity (AI coding assistant)** during this project for:
- Scaffolding new routes and server functions to match the existing TanStack Start patterns in the repository.
- Generating Supabase RLS policies and database trigger functions.
- Debugging cross-platform environment variable issues (Windows `NODE_OPTIONS` fix).
- All architectural decisions, component structure, and state management patterns were my own choices — AI assisted with implementation speed, not design.

---

## Database Schema

The full SQL schema (including tables, RLS policies, and triggers) is documented in [`ASSIGNMENT_GUIDE.md`](./ASSIGNMENT_GUIDE.md).

Key tables:
- **`profiles`**: User profiles with role (admin/teacher/student) and approval status
- **`modules`**: Educational modules with teacher assignment

---

## Scripts

| Command                | Description                                             |
| ---------------------- | ------------------------------------------------------- |
| `pnpm dev`             | Start dev server on port 3000                           |
| `pnpm build`           | Production build → `.output/`                           |
| `pnpm start`           | Run production server                                   |
| `pnpm test`            | Run Vitest                                              |
| `pnpm typecheck`       | TypeScript type check                                   |
| `pnpm lint`            | oxlint                                                  |
| `pnpm fmt`             | oxfmt (format)                                          |
