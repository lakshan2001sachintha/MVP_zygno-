import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "#/components/ui/button";
import { createModuleFn, deleteModuleFn, updateModuleFn } from "#/utils/modules";

type Teacher = { id: string; full_name: string | null; email: string };
type Module = {
  id: string;
  title: string;
  description: string | null;
  credits: number;
  teacher_id: string | null;
  teacher: Teacher | null;
};

export function ModuleCatalog({
  modules,
  teachers = [],
  canManage,
  teacherMode = false,
}: {
  modules: Module[];
  teachers?: Teacher[];
  canManage: boolean;
  teacherMode?: boolean;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<Module | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [credits, setCredits] = useState(3);
  const [teacherId, setTeacherId] = useState("");
  const [busy, setBusy] = useState(false);

  const reset = () => {
    setEditing(null);
    setTitle("");
    setDescription("");
    setCredits(3);
    setTeacherId("");
  };

  const startEditing = (module: Module) => {
    setEditing(module);
    setTitle(module.title);
    setDescription(module.description ?? "");
    setCredits(module.credits);
    setTeacherId(module.teacher_id ?? "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      const payload = { title, description, credits, teacherId: teacherId || undefined };
      if (editing) await updateModuleFn({ data: { id: editing.id, ...payload } });
      else await createModuleFn({ data: payload });
      toast.success(editing ? "Module updated" : "Module created");
      reset();
      await router.invalidate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save module");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (module: Module) => {
    if (!window.confirm(`Delete “${module.title}”? This cannot be undone.`)) return;
    try {
      await deleteModuleFn({ data: { id: module.id } });
      toast.success("Module deleted");
      if (editing?.id === module.id) reset();
      await router.invalidate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete module");
    }
  };

  return (
    <div className={canManage ? "grid gap-8 lg:grid-cols-[340px_1fr]" : ""}>
      {canManage && (
        <section className="island-shell h-fit rounded-2xl p-6">
          <h2 className="mb-1 text-lg font-bold">{editing ? "Edit module" : "Create module"}</h2>
          <p className="mb-5 text-sm text-[var(--sea-ink-soft)]">
            {teacherMode
              ? "New modules are automatically assigned to you."
              : "Add course details and choose an instructor."}
          </p>
          <form className="space-y-4" onSubmit={submit}>
            <label className="block text-sm font-semibold">
              Title
              <input
                className="demo-input mt-1"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={120}
              />
            </label>
            <label className="block text-sm font-semibold">
              Description
              <textarea
                className="demo-textarea mt-1"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={1000}
              />
            </label>
            <label className="block text-sm font-semibold">
              Credits
              <input
                className="demo-input mt-1"
                type="number"
                min={1}
                max={60}
                step={1}
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
                required
              />
            </label>
            {!teacherMode && (
              <label className="block text-sm font-semibold">
                Assigned teacher
                <select
                  className="demo-select mt-1"
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.full_name || teacher.email}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <div className="flex gap-2">
              <Button type="submit" disabled={busy}>
                {busy ? "Saving…" : editing ? "Save changes" : "Create module"}
              </Button>
              {editing && (
                <Button type="button" variant="outline" onClick={reset}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </section>
      )}

      <section>
        {modules.length === 0 ? (
          <div className="island-shell rounded-2xl p-10 text-center">
            <h2 className="text-xl font-bold">No modules yet</h2>
            <p className="mt-2 text-sm text-[var(--sea-ink-soft)]">
              {canManage
                ? "Create the first module using the form."
                : "Check back when courses have been published."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {modules.map((module) => (
              <article
                key={module.id}
                className="island-shell feature-card flex flex-col rounded-2xl p-6"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <h2 className="m-0 text-lg font-bold">{module.title}</h2>
                  <span className="demo-pill shrink-0">
                    {module.credits} {module.credits === 1 ? "credit" : "credits"}
                  </span>
                </div>
                <p className="mb-5 flex-1 text-sm text-[var(--sea-ink-soft)]">
                  {module.description || "No description provided."}
                </p>
                <p className="mb-0 border-t border-[var(--line)] pt-4 text-xs font-semibold">
                  Instructor:{" "}
                  <span className="text-[var(--lagoon-deep)]">
                    {module.teacher?.full_name || module.teacher?.email || "To be assigned"}
                  </span>
                </p>
                {canManage && (
                  <div className="mt-4 flex gap-2">
                    <button
                      className="demo-button demo-button-secondary"
                      onClick={() => startEditing(module)}
                    >
                      Edit
                    </button>
                    <button
                      className="demo-button demo-button-danger"
                      onClick={() => remove(module)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
