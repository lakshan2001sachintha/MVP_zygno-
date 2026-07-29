import { createFileRoute, Link } from "@tanstack/react-router";
import { useRouteContext } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  const context = useRouteContext({ from: "__root__" }) as any;
  const user = context?.user;

  return (
    <main className="page-wrap px-4 pt-14 pb-8">
      {/* Hero Section */}
      <section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute -top-24 -left-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]" />
        <p className="island-kicker mb-3">Education Institute Management System</p>
        <h1 className="display-title mb-5 max-w-3xl text-4xl leading-[1.02] font-bold tracking-tight text-[var(--sea-ink)] sm:text-6xl">
          Manage your institute, simplified.
        </h1>
        <p className="mb-8 max-w-2xl text-base text-[var(--sea-ink-soft)] sm:text-lg">
          A modern platform for administrators, teachers, and students to manage courses, track
          modules, and collaborate — all from one unified dashboard.
        </p>
        <div className="flex flex-wrap gap-3">
          {user ? (
            <>
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm font-semibold text-[var(--lagoon-deep)] no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]"
                >
                  Admin Dashboard
                </Link>
              )}
              {user.role === "teacher" && (
                <Link
                  to="/teacher"
                  className="rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm font-semibold text-[var(--lagoon-deep)] no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]"
                >
                  My Workspace
                </Link>
              )}
              <Link
                to="/modules"
                className="rounded-full border border-[rgba(23,58,64,0.2)] bg-white/50 px-5 py-2.5 text-sm font-semibold text-[var(--sea-ink)] no-underline transition hover:-translate-y-0.5 hover:border-[rgba(23,58,64,0.35)]"
              >
                Browse Modules
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm font-semibold text-[var(--lagoon-deep)] no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]"
              >
                Get Started
              </Link>
              <Link
                to="/about"
                className="rounded-full border border-[rgba(23,58,64,0.2)] bg-white/50 px-5 py-2.5 text-sm font-semibold text-[var(--sea-ink)] no-underline transition hover:-translate-y-0.5 hover:border-[rgba(23,58,64,0.35)]"
              >
                Learn More
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Feature Cards */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          [
            "Role-Based Access",
            "Admin, Teacher, and Student dashboards with tailored permissions and views.",
          ],
          [
            "Module Management",
            "Create, edit, and browse educational modules with teacher assignments.",
          ],
          [
            "Teacher Approval",
            "Admins approve teacher profiles before granting module management access.",
          ],
          [
            "Real-Time Stats",
            "Dashboard counters and user registries update instantly from the database.",
          ],
        ].map(([title, desc], index) => (
          <article
            key={title}
            className="island-shell feature-card rise-in rounded-2xl p-5"
            style={{ animationDelay: `${index * 90 + 80}ms` }}
          >
            <h2 className="mb-2 text-base font-semibold text-[var(--sea-ink)]">{title}</h2>
            <p className="m-0 text-sm text-[var(--sea-ink-soft)]">{desc}</p>
          </article>
        ))}
      </section>

      {/* Welcome / Quick Links */}
      {user && (
        <section className="island-shell mt-8 rounded-2xl p-6">
          <p className="island-kicker mb-2">Welcome, {user.fullName}</p>
          <p className="text-sm text-[var(--sea-ink-soft)]">
            You are logged in as <strong className="text-[var(--sea-ink)]">{user.role}</strong>. Use
            the navigation above to access your workspace.
          </p>
        </section>
      )}
    </main>
  );
}
