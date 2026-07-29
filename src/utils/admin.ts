import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServerClient } from "./supabase";

export const fetchAdminDashboardFn = createServerFn({ method: "GET" })
  .handler(async () => {
    const supabase = getSupabaseServerClient();
    
    // Verify user is logged in
    const { data: { user } } = await supabase.auth.getUser();
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
      .select("id");

    if (pError || mError) {
      throw new Error(pError?.message || mError?.message || "Failed to retrieve dashboard information");
    }

    const totalStudents = profiles.filter((p) => p.role === "student").length;
    const totalTeachers = profiles.filter((p) => p.role === "teacher").length;
    const totalModules = modules.length;

    return {
      stats: {
        totalStudents,
        totalTeachers,
        totalModules,
      },
      users: profiles,
    };
  });

export const toggleApprovalFn = createServerFn({ method: "POST" })
  .validator((data: any) => data as { userId: string; isApproved: boolean })
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();

    // Verify actor is Admin
    const { data: { user } } = await supabase.auth.getUser();
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
    const { error } = await supabase
      .from("profiles")
      .update({ is_approved: isApproved })
      .eq("id", userId);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  });
