import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "./supabase";

// Login function (Server Function)
export const loginFn = createServerFn({ method: "POST" })
  .validator((data: any) => data as { email: string; password: string })
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { email, password } = data;
    
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return authData;
  });

// Signup function (Server Function)
export const signupFn = createServerFn({ method: "POST" })
  .validator((data: any) => data as { email: string; password: string; fullName: string; role: 'admin' | 'teacher' | 'student' })
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { email, password, fullName, role } = data;
    
    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
      },
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return authData;
  });

// Logout function (Server Function)
export const logoutFn = createServerFn({ method: "POST" })
  .handler(async () => {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
    return { success: true };
  });

// Admin-only Create User function (Server Function)
// We use a standalone supabase client here so it does not mutate the logged-in admin's cookies
export const createUserFn = createServerFn({ method: "POST" })
  .validator((data: any) => data as { email: string; fullName: string; role: 'admin' | 'teacher' | 'student'; isApproved?: boolean })
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    
    // 1. Authenticate that the actor is an admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not logged in");

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      throw new Error("Forbidden: Only administrators can create new users");
    }

    // 2. Create the user using a separate client instance (so we don't overwrite current admin cookies)
    const creatorClient = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!);
    const { email, fullName, role } = data;
    
    // We register the user with a default temporary password
    const temporaryPassword = "TempPassword123!";
    const { data: createData, error } = await creatorClient.auth.signUp({
      email,
      password: temporaryPassword,
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      userId: createData.user?.id,
    };
  });
