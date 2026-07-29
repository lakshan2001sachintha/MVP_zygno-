# Zygno Education Institute Management System

A Supabase-backed mini-MVP for managing teacher approvals and educational modules. It provides distinct Admin, Teacher, and Student experiences while retaining the TanStack Start stack supplied in the starter repository.

## Features

- Email/password authentication with Student, Teacher, and Admin roles
- Admin dashboard with institute totals, recent activity, and a focused pending-teacher approval queue
- Full module CRUD for admins
- Teacher workspace limited to modules assigned to the signed-in teacher
- Student module explorer with credit and instructor details
- Server-side authorization plus PostgreSQL Row Level Security (RLS)
- Self-registration for Student and Teacher accounts, with new teachers pending admin approval
- Responsive light/dark interface with theme-aware controls

## Local setup

Requirements: Node.js 24 or newer and pnpm 11 or newer.

1. Clone the repository and install dependencies:

   ```bash
   git clone <your-repository-url>
   cd <repository-directory>
   pnpm install
   ```

2. Create a free [Supabase](https://supabase.com/) project. In its SQL Editor, run [`supabase/schema.sql`](./supabase/schema.sql). The query is compatible with the supplied `profiles` and `modules` tables and can also create them in a new project.

3. Create `.env` in the project root:

   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_PUBLISHABLE_KEY=your-publishable-or-anon-key
   ```

   Find these values in Supabase Project Settings under API Keys. Never commit `.env`.

4. Start the application:

   ```bash
   pnpm dev
   ```

   Open `http://localhost:3000`.

## First administrator

Public signup intentionally permits only Student and Teacher accounts. This prevents a visitor from assigning themselves administrator access.

1. Sign up once through the application with the email that should own the initial admin account.
2. In the Supabase SQL Editor, run:

   ```sql
   update public.profiles
   set role = 'admin', is_approved = true
   where email = 'your-admin@example.com';
   ```

3. Sign out and back in. The Admin Dashboard will now be available. Newly self-registered teachers remain in its pending-teacher queue until approved.

## Application workflow

### Admin

1. Sign in using the bootstrapped administrator account.
2. Open **Admin Dashboard** to view institute totals and recent activity.
3. Review pending teachers by name and email.
4. Select **Approve**. After Supabase confirms the update, that teacher disappears from the pending list.
5. Open **Module Explorer** to create, assign, edit, or delete modules.

### Teacher

1. Sign up with the Teacher role and confirm the email if confirmation is enabled in Supabase.
2. Wait for an administrator to approve the account.
3. Open **Teacher Workspace** to create modules and manage only assigned modules.

### Student

1. Sign up with the Student role.
2. Open **Module Explorer** to browse modules, credits, and assigned teachers.

## Role behavior

| Capability            | Admin      | Teacher                              | Student |
| --------------------- | ---------- | ------------------------------------ | ------- |
| View module catalogue | Yes        | Yes                                  | Yes     |
| Create modules        | Yes        | Yes, assigned to self after approval | No      |
| Edit/delete modules   | Any module | Assigned modules after approval      | No      |
| View pending teachers | Yes        | No                                   | No      |
| Approve teachers      | Yes        | No                                   | No      |

Authorization is checked in TanStack server functions and enforced again by Supabase RLS. Client-side route guards are for navigation and user experience, not the security boundary.

## Tech stack and choices

- **TanStack Start, Router, and React 19:** uses the repository's SSR and type-safe file routing foundation.
- **TypeScript:** maintains typed server-function inputs and UI data.
- **Supabase Auth and PostgreSQL:** supplies email/password authentication, relational data, and RLS without a separate API service.
- **Tailwind CSS v4 and Shadcn UI:** provides a responsive component and utility styling system consistent with the starter.
- **Sonner:** gives concise success and error feedback for mutations.

The database source of truth is [`supabase/schema.sql`](./supabase/schema.sql). It is safe to run against the supplied tables: it preserves existing rows while creating missing objects and replacing the application-specific trigger, helper functions, and RLS policies.

### Database tables

| Table      | Purpose                                                                                 |
| ---------- | --------------------------------------------------------------------------------------- |
| `profiles` | Stores the Auth user profile, role, teacher approval status, and profile creation time. |
| `modules`  | Stores module details, credits, assigned teacher, and creation/update timestamps.       |

The application connects to the Supabase project configured by `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`. The publishable key is used with authenticated sessions; authorization is enforced by server functions and database RLS policies.

## Commands

| Command          | Purpose                                |
| ---------------- | -------------------------------------- |
| `pnpm dev`       | Run the local development server       |
| `pnpm typecheck` | Type-check without emitting files      |
| `pnpm lint`      | Run Oxlint                             |
| `pnpm fmt:check` | Check formatting                       |
| `pnpm test`      | Run Vitest tests                       |
| `pnpm build`     | Validate and create a production build |
| `pnpm start`     | Run the built server                   |

## AI usage

I used a chat-based coding assistant (CODEX) to audit the supplied starter, implement focused TanStack Start server functions and views, review authorization boundaries, draft the Supabase schema/RLS policies, and help diagnose compiler and formatting feedback. The application was assembled within the provided repository rather than generated by an end-to-end app builder; architectural, security, and product decisions were reviewed during implementation.
