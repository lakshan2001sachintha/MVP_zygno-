import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "#/components/ui/button";
import { fetchAdminDashboardFn, toggleApprovalFn } from "#/utils/admin";
import { createUserFn } from "#/utils/auth";

export const Route = createFileRoute("/admin")({
  beforeLoad: ({ context }) => {
    const user = (context as any).user;
    if (!user) {
      throw redirect({ to: "/login" });
    }
    if (user.role !== "admin") {
      throw redirect({ to: "/" });
    }
  },
  loader: async () => {
    return await fetchAdminDashboardFn();
  },
  component: AdminDashboard,
});

function AdminDashboard() {
  const router = useRouter();
  const { stats, users } = Route.useLoaderData();

  // Create User Form State
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<'admin' | 'teacher' | 'student'>("student");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !fullName) {
      toast.error("Please fill in email and full name");
      return;
    }
    setIsSubmitting(true);
    try {
      await createUserFn({ data: { email, fullName, role } });
      toast.success(`User created with default password "TempPassword123!"`);
      setEmail("");
      setFullName("");
      setRole("student");
      router.invalidate(); // reload dashboard stats and user table
    } catch (err: any) {
      toast.error("Failed to create user: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleApproval = async (userId: string, currentStatus: boolean) => {
    const textStr = currentStatus ? "revoke" : "grant";
    if (!confirm(`Are you sure you want to ${textStr} approval for this teacher?`)) return;
    
    try {
      await toggleApprovalFn({ data: { userId, isApproved: !currentStatus } });
      toast.success(`Approval status updated`);
      router.invalidate();
    } catch (err: any) {
      toast.error("Approval state swap failed: " + err.message);
    }
  };

  return (
    <main className="page-wrap px-4 pt-10 pb-16">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="display-title text-3xl font-bold tracking-tight text-[var(--sea-ink)] sm:text-4xl mb-2">
          Admin Dashboard
        </h1>
        <p className="text-sm text-[var(--sea-ink-soft)]">
          Manage system users, approve teacher profiles, and view real-time platform statistics.
        </p>
      </div>

      {/* Stats Section grid-cols */}
      <section className="grid gap-4 md:grid-cols-3 mb-10">
        <article className="island-shell p-6 rounded-2xl relative overflow-hidden transition hover:-translate-y-0.5 border border-[var(--chip-line)]">
          <p className="island-kicker mb-1">Students</p>
          <h2 className="text-3xl font-bold text-[var(--sea-ink)]">{stats.totalStudents}</h2>
          <div className="absolute right-4 bottom-4 text-xs font-semibold text-[rgba(79,184,178,0.3)] uppercase">Active Enrolled</div>
        </article>

        <article className="island-shell p-6 rounded-2xl relative overflow-hidden transition hover:-translate-y-0.5 border border-[var(--chip-line)]">
          <p className="island-kicker mb-1">Teachers</p>
          <h2 className="text-3xl font-bold text-[var(--sea-ink)]">{stats.totalTeachers}</h2>
          <div className="absolute right-4 bottom-4 text-xs font-semibold text-[rgba(79,184,178,0.3)] uppercase">Faculty Staff</div>
        </article>

        <article className="island-shell p-6 rounded-2xl relative overflow-hidden transition hover:-translate-y-0.5 border border-[var(--chip-line)]">
          <p className="island-kicker mb-1">Modules</p>
          <h2 className="text-3xl font-bold text-[var(--sea-ink)]">{stats.totalModules}</h2>
          <div className="absolute right-4 bottom-4 text-xs font-semibold text-[rgba(79,184,178,0.3)] uppercase">Course Registry</div>
        </article>
      </section>

      {/* Create User & Users List Panels */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Create User Panel */}
        <section className="island-shell p-6 rounded-2xl h-fit border border-[var(--chip-line)]">
          <h3 className="text-lg font-bold text-[var(--sea-ink)] mb-4">Registration Console</h3>
          <p className="text-xs text-[var(--sea-ink-soft)] mb-6">
            Register new users directly on the system database. Newly registered users login with password <strong>TempPassword123!</strong>
          </p>

          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--sea-ink)] mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Jane Smith"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[var(--chip-line)] bg-white/70 focus:outline-none focus:ring-2 focus:ring-[rgba(79,184,178,0.4)] text-sm text-[var(--sea-ink)]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--sea-ink)] mb-1">Email Address</label>
              <input
                type="email"
                placeholder="jane.smith@institute.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[var(--chip-line)] bg-white/70 focus:outline-none focus:ring-2 focus:ring-[rgba(79,184,178,0.4)] text-sm text-[var(--sea-ink)]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--sea-ink)] mb-1">Assigned Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-[var(--chip-line)] bg-white/70 focus:outline-none focus:ring-2 focus:ring-[rgba(79,184,178,0.4)] text-sm text-[var(--sea-ink)]"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full font-semibold mt-2">
              {isSubmitting ? "Registering..." : "Add User"}
            </Button>
          </form>
        </section>

        {/* Users List Panel */}
        <section className="lg:col-span-2 island-shell p-6 rounded-2xl border border-[var(--chip-line)] overflow-hidden">
          <h3 className="text-lg font-bold text-[var(--sea-ink)] mb-4">User Registry</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[var(--line)]">
                  <th className="py-2.5 font-semibold text-[var(--sea-ink-soft)]">Name</th>
                  <th className="py-2.5 font-semibold text-[var(--sea-ink-soft)]">Email</th>
                  <th className="py-2.5 font-semibold text-[var(--sea-ink-soft)]">Role</th>
                  <th className="py-2.5 font-semibold text-[var(--sea-ink-soft)] text-center">Status</th>
                  <th className="py-2.5 font-semibold text-[var(--sea-ink-soft)] text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((usr) => (
                  <tr key={usr.id} className="border-b border-[var(--line)] hover:bg-[var(--link-bg-hover)] transition">
                    <td className="py-3 font-medium text-[var(--sea-ink)]">{usr.full_name || "—"}</td>
                    <td className="py-3 text-[var(--sea-ink-soft)]">{usr.email}</td>
                    <td className="py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                        usr.role === "admin"
                          ? "bg-[rgba(79,184,178,0.22)] text-[var(--lagoon-deep)]"
                          : usr.role === "teacher"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {usr.role}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      {usr.role === "teacher" ? (
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          usr.is_approved
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}>
                          {usr.is_approved ? "Approved" : "Pending"}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      {usr.role === "teacher" && (
                        <button
                          onClick={() => handleToggleApproval(usr.id, usr.is_approved)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                            usr.is_approved
                              ? "bg-amber-50 text-amber-600 hover:bg-amber-100 border-amber-200"
                              : "bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
                          }`}
                        >
                          {usr.is_approved ? "Revoke" : "Approve"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
