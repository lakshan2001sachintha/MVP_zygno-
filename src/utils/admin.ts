import { createServerFn } from "@tanstack/react-start";

import { getSupabaseServerClient } from "./supabase";

export const fetchAdminDashboardFn = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getSupabaseServerClient();

  // Verify user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized: Please log in");

  // Fetch user profile
  const { data: actorProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (actorProfile?.role !== "admin") {
    throw new Error("Forbidden: Admin access required");
  }

  // Query stats and profiles
  const { data: profiles, error: pError } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: modules, error: mError } = await supabase
    .from("modules")
    .select("id, title, created_at")
    .order("created_at", { ascending: false });

  if (pError || mError) {
    throw new Error(
      pError?.message || mError?.message || "Failed to retrieve dashboard information",
    );
  }

  const totalStudents = profiles.filter((p) => p.role === "student" && p.is_approved).length;
  const totalTeachers = profiles.filter((p) => p.role === "teacher").length;
  const totalModules = modules.length;

  return {
    stats: {
      totalStudents,
      totalTeachers,
      totalModules,
    },
    users: profiles.filter((profile) => profile.role === "teacher" && !profile.is_approved),
    recentActivity: [
      ...profiles.slice(0, 5).map((profile) => ({
        id: `user-${profile.id}`,
        label: `${profile.full_name || profile.email} joined as ${profile.role}`,
        occurredAt: profile.created_at,
        type: "user" as const,
      })),
      ...modules.slice(0, 5).map((module) => ({
        id: `module-${module.id}`,
        label: `Module “${module.title}” was created`,
        occurredAt: module.created_at,
        type: "module" as const,
      })),
    ]
      .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
      .slice(0, 6),
  };
});

export const toggleApprovalFn = createServerFn({ method: "POST" })
  .validator((data: any) => data as { userId: string; isApproved: boolean })
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();

    // Verify actor is Admin
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      throw new Error("Forbidden: Admin access required");
    }

    const { userId, isApproved } = data;
    const { data: updatedTeacher, error } = await supabase
      .from("profiles")
      .update({ is_approved: isApproved })
      .eq("id", userId)
      .eq("role", "teacher")
      .select("id, is_approved")
      .single();

    if (error) {
      throw new Error(
        error.code === "PGRST116"
          ? "Approval was blocked by the database policy. Run supabase/schema.sql in the Supabase SQL Editor."
          : error.message,
      );
    }

    if (!updatedTeacher || updatedTeacher.is_approved !== isApproved) {
      throw new Error("The teacher approval status was not updated");
    }

    return { success: true };
  });
