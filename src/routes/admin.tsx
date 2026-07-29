import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { fetchAdminDashboardFn, toggleApprovalFn } from "#/utils/admin";

export const Route = createFileRoute("/admin")({
  beforeLoad: ({ context }) => {
    const user = (context as any).user;
    if (!user) throw redirect({ to: "/login" });
    if (user.role !== "admin") throw redirect({ to: "/" });
  },
  loader: () => fetchAdminDashboardFn(),
  component: AdminDashboard,
});

function AdminDashboard() {
  const router = useRouter();
  const { stats, users, recentActivity } = Route.useLoaderData();
  const [approvingIds, setApprovingIds] = useState<string[]>([]);
  const [approvedIds, setApprovedIds] = useState<string[]>([]);
  const pendingTeachers = users.filter((teacher) => !approvedIds.includes(teacher.id));

  const approveTeacher = async (userId: string) => {
    setApprovingIds((ids) => [...ids, userId]);
    try {
      await toggleApprovalFn({ data: { userId, isApproved: true } });
      setApprovedIds((ids) => [...ids, userId]);
      toast.success("Teacher approved successfully");
      await router.invalidate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Teacher approval failed");
    } finally {
      setApprovingIds((ids) => ids.filter((id) => id !== userId));
    }
  };

  return (
    <main className="page-wrap px-4 pt-10 pb-16">
      <header className="mb-8">
        <h1 className="display-title mb-2 text-3xl font-bold tracking-tight text-[var(--sea-ink)] sm:text-4xl">
          Admin Dashboard
        </h1>
        <p className="text-sm text-[var(--sea-ink-soft)]">
          Review institute activity and approve pending teachers.
        </p>
      </header>

      <section className="mb-10 grid gap-4 md:grid-cols-3">
        <article className="island-shell relative overflow-hidden rounded-2xl border border-[var(--chip-line)] p-6 transition hover:-translate-y-0.5">
          <p className="island-kicker mb-1">Students</p>
          <h2 className="text-3xl font-bold text-[var(--sea-ink)]">{stats.totalStudents}</h2>
          <span className="absolute right-4 bottom-4 text-xs font-semibold text-[rgba(79,184,178,0.3)] uppercase">
            Active enrolled
          </span>
        </article>
        <article className="island-shell relative overflow-hidden rounded-2xl border border-[var(--chip-line)] p-6 transition hover:-translate-y-0.5">
          <p className="island-kicker mb-1">Teachers</p>
          <h2 className="text-3xl font-bold text-[var(--sea-ink)]">{stats.totalTeachers}</h2>
          <span className="absolute right-4 bottom-4 text-xs font-semibold text-[rgba(79,184,178,0.3)] uppercase">
            Faculty staff
          </span>
        </article>
        <article className="island-shell relative overflow-hidden rounded-2xl border border-[var(--chip-line)] p-6 transition hover:-translate-y-0.5">
          <p className="island-kicker mb-1">Modules</p>
          <h2 className="text-3xl font-bold text-[var(--sea-ink)]">{stats.totalModules}</h2>
          <span className="absolute right-4 bottom-4 text-xs font-semibold text-[rgba(79,184,178,0.3)] uppercase">
            Course registry
          </span>
        </article>
      </section>

      <section className="island-shell mb-10 rounded-2xl p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="m-0 text-lg font-bold">Recent activity</h2>
          <span className="demo-pill">Latest changes</span>
        </div>
        {recentActivity.length === 0 ? (
          <p className="m-0 text-sm text-[var(--sea-ink-soft)]">No activity recorded yet.</p>
        ) : (
          <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
            {recentActivity.map((activity) => (
              <li key={activity.id} className="demo-list-item">
                <p className="m-0 text-sm font-semibold">{activity.label}</p>
                <time
                  className="mt-1 block text-xs text-[var(--sea-ink-soft)]"
                  dateTime={activity.occurredAt}
                >
                  {new Intl.DateTimeFormat("en", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(activity.occurredAt))}
                </time>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="island-shell overflow-hidden rounded-2xl border border-[var(--chip-line)] p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="m-0 text-lg font-bold text-[var(--sea-ink)]">Pending Teachers</h2>
            <p className="mt-1 mb-0 text-sm text-[var(--sea-ink-soft)]">
              Approved teachers automatically disappear from this list.
            </p>
          </div>
          <span className="demo-pill">{pendingTeachers.length} pending</span>
        </div>

        {pendingTeachers.length === 0 ? (
          <div className="rounded-xl border border-[var(--line)] p-8 text-center">
            <p className="m-0 font-semibold">All teachers are approved.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--line)]">
                  <th className="py-3 font-semibold text-[var(--sea-ink-soft)]">Teacher name</th>
                  <th className="py-3 font-semibold text-[var(--sea-ink-soft)]">Email</th>
                  <th className="py-3 text-right font-semibold text-[var(--sea-ink-soft)]">
                    Approval
                  </th>
                </tr>
              </thead>
              <tbody>
                {pendingTeachers.map((teacher) => {
                  const isApproving = approvingIds.includes(teacher.id);
                  return (
                    <tr key={teacher.id} className="border-b border-[var(--line)] last:border-0">
                      <td className="py-4 font-medium text-[var(--sea-ink)]">
                        {teacher.full_name || "Unnamed teacher"}
                      </td>
                      <td className="py-4 text-[var(--sea-ink-soft)]">{teacher.email}</td>
                      <td className="py-4 text-right">
                        <button
                          type="button"
                          disabled={isApproving}
                          onClick={() => approveTeacher(teacher.id)}
                          className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isApproving ? "Approving…" : "Approve"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
