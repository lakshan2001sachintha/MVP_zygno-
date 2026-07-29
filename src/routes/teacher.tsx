import { createFileRoute, redirect } from "@tanstack/react-router";

import { ModuleCatalog } from "#/components/ModuleCatalog";
import { fetchTeacherModulesFn } from "#/utils/modules";

export const Route = createFileRoute("/teacher")({
  beforeLoad: ({ context }) => {
    const user = (context as any).user;
    if (!user) throw redirect({ to: "/login" });
    if (user.role !== "teacher") throw redirect({ to: "/" });
  },
  loader: () => fetchTeacherModulesFn(),
  component: TeacherWorkspace,
});

function TeacherWorkspace() {
  const modules = Route.useLoaderData();
  const { user } = Route.useRouteContext() as any;
  return (
    <main className="page-wrap px-4 py-10">
      <header className="mb-8">
        <p className="island-kicker mb-2">Faculty tools</p>
        <h1 className="display-title m-0 text-4xl font-bold">Teacher Workspace</h1>
        <p className="mt-3 text-sm text-[var(--sea-ink-soft)]">
          Manage only the modules assigned to your account.
        </p>
      </header>
      {!user.isApproved && (
        <div className="demo-alert mb-6">
          Your teacher account is awaiting admin approval. You can view assigned modules, but
          management actions are disabled.
        </div>
      )}
      <ModuleCatalog modules={modules} canManage={user.isApproved} teacherMode />
    </main>
  );
}
