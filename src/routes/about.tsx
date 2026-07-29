import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">About</p>
        <h1 className="display-title mb-3 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">
          Zygno Education Institute
        </h1>
        <p className="m-0 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)] mb-6">
          This is a simplified Education Institute Management System built as a Mini-MVP. It
          demonstrates role-based access control, module management, and dashboard views using
          modern web technologies.
        </p>

        <h2 className="text-xl font-bold text-[var(--sea-ink)] mb-3 mt-8">Tech Stack</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm text-[var(--sea-ink-soft)]">
          <li>
            <strong>Framework:</strong> TanStack Start (SSR full-stack React)
          </li>
          <li>
            <strong>Routing:</strong> TanStack Router (file-based, type-safe)
          </li>
          <li>
            <strong>Auth & Database:</strong> Supabase (PostgreSQL + Auth)
          </li>
          <li>
            <strong>Styling:</strong> Tailwind CSS v4 + Shadcn UI
          </li>
          <li>
            <strong>Language:</strong> TypeScript
          </li>
          <li>
            <strong>Forms:</strong> TanStack Form + Zod validation
          </li>
          <li>
            <strong>Data Fetching:</strong> TanStack Query
          </li>
        </ul>

        <h2 className="text-xl font-bold text-[var(--sea-ink)] mb-3 mt-8">Features</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm text-[var(--sea-ink-soft)]">
          <li>
            <strong>User Management:</strong> Admin, Teacher, Student roles with Supabase Auth
          </li>
          <li>
            <strong>Module CRUD:</strong> Create, browse, update, and delete educational modules
          </li>
          <li>
            <strong>Admin Dashboard:</strong> Stats overview, user registry, teacher approval system
          </li>
          <li>
            <strong>Teacher Workspace:</strong> View and manage assigned modules
          </li>
          <li>
            <strong>Module Explorer:</strong> Students can browse all available courses
          </li>
        </ul>
      </section>
    </main>
  );
}
