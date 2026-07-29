import { createFileRoute, redirect } from "@tanstack/react-router";

import { ModuleCatalog } from "#/components/ModuleCatalog";
import { fetchModulesFn, fetchTeachersListFn } from "#/utils/modules";

export const Route = createFileRoute("/modules")({
  beforeLoad: ({ context }) => {
    if (!(context as any).user) throw redirect({ to: "/login" });
  },
  loader: async () => {
    const [modules, teachers] = await Promise.all([fetchModulesFn(), fetchTeachersListFn()]);
    return { modules, teachers };
  },
  component: ModuleExplorer,
});

function ModuleExplorer() {
  const { modules, teachers } = Route.useLoaderData();
  const { user } = Route.useRouteContext() as any;
  return (
    <main className="page-wrap px-4 py-10">
      <header className="mb-8">
        <p className="island-kicker mb-2">Course catalogue</p>
        <h1 className="display-title m-0 text-4xl font-bold">Module Explorer</h1>
        <p className="mt-3 max-w-2xl text-sm text-[var(--sea-ink-soft)]">
          Browse available educational modules, credit values, and assigned instructors.
        </p>
      </header>
      <ModuleCatalog modules={modules} teachers={teachers} canManage={user.role === "admin"} />
    </main>
  );
}
