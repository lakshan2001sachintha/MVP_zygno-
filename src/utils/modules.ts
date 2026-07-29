import { createServerFn } from "@tanstack/react-start";

import { getSupabaseServerClient } from "./supabase";

export const fetchModulesFn = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getSupabaseServerClient();

  // Verify user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized: Please log in");

  // Fetch modules with teacher profile relation
  const { data: modules, error } = await supabase
    .from("modules")
    .select(`
        *,
        teacher:profiles(id, full_name, email)
      `)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return modules as Array<{
    id: string;
    title: string;
    description: string | null;
    credits: number;
    teacher_id: string | null;
    created_at: string;
    updated_at: string;
    teacher: { id: string; full_name: string; email: string } | null;
  }>;
});

export const fetchTeacherModulesFn = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized: Please log in");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_approved")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "teacher") throw new Error("Forbidden: Teacher access required");

  const { data, error } = await supabase
    .from("modules")
    .select("*, teacher:profiles(id, full_name, email)")
    .eq("teacher_id", user.id)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
});

export const fetchTeachersListFn = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getSupabaseServerClient();

  // Verify user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Grab all approved teacher profiles
  const { data: teachers, error } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .eq("role", "teacher")
    .eq("is_approved", true);

  if (error) {
    throw new Error(error.message);
  }

  return teachers;
});

export const createModuleFn = createServerFn({ method: "POST" })
  .validator(
    (data: any) =>
      data as { title: string; description?: string; credits: number; teacherId?: string },
  )
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, is_approved")
      .eq("id", user.id)
      .single();

    if (!profile || (profile.role !== "admin" && profile.role !== "teacher")) {
      throw new Error("Forbidden: Access denied");
    }

    if (profile.role === "teacher" && !profile.is_approved) {
      throw new Error("Forbidden: Teacher account is pending registration approval");
    }

    const { title, description, credits, teacherId } = data;
    const normalizedTitle = title.trim();
    if (!normalizedTitle) throw new Error("Title is required");
    if (!Number.isInteger(credits) || credits < 1 || credits > 60) {
      throw new Error("Credits must be a whole number between 1 and 60");
    }
    const { error } = await supabase.from("modules").insert({
      title: normalizedTitle,
      description: description?.trim() || null,
      credits,
      teacher_id: profile.role === "teacher" ? user.id : teacherId || null,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  });

export const updateModuleFn = createServerFn({ method: "POST" })
  .validator(
    (data: any) =>
      data as {
        id: string;
        title: string;
        description?: string;
        credits: number;
        teacherId?: string;
      },
  )
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, is_approved")
      .eq("id", user.id)
      .single();

    if (!profile || (profile.role !== "admin" && profile.role !== "teacher")) {
      throw new Error("Forbidden: Access denied");
    }

    const { id, title, description, credits, teacherId } = data;
    const normalizedTitle = title.trim();
    if (!normalizedTitle) throw new Error("Title is required");
    if (!Number.isInteger(credits) || credits < 1 || credits > 60) {
      throw new Error("Credits must be a whole number between 1 and 60");
    }

    // Teachers can only modify their own assigned modules
    if (profile.role === "teacher") {
      if (!profile.is_approved) throw new Error("Forbidden: Account pending approval");
      const { data: existing } = await supabase
        .from("modules")
        .select("teacher_id")
        .eq("id", id)
        .single();
      if (existing?.teacher_id !== user.id) {
        throw new Error("Forbidden: You can only update modules assigned to you");
      }
    }

    const { error } = await supabase
      .from("modules")
      .update({
        title: normalizedTitle,
        description: description?.trim() || null,
        credits,
        teacher_id: profile.role === "teacher" ? user.id : teacherId || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  });

export const deleteModuleFn = createServerFn({ method: "POST" })
  .validator((data: any) => data as { id: string })
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, is_approved")
      .eq("id", user.id)
      .single();

    if (!profile || (profile.role !== "admin" && profile.role !== "teacher")) {
      throw new Error("Forbidden: Access denied");
    }

    const { id } = data;

    // Teachers can only delete their own assigned modules
    if (profile.role === "teacher") {
      if (!profile.is_approved) throw new Error("Forbidden: Account pending approval");
      const { data: existing } = await supabase
        .from("modules")
        .select("teacher_id")
        .eq("id", id)
        .single();
      if (existing?.teacher_id !== user.id) {
        throw new Error("Forbidden: You can only delete modules assigned to you");
      }
    }

    const { error } = await supabase.from("modules").delete().eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  });
