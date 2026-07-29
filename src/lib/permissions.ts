import { createServerFn } from "@tanstack/react-start";

import { getSupabaseServerClient } from "#/utils/supabase";

export type PermissionAction =
  | "create"
  | "read"
  | "update"
  | "delete"
  | "create_self"
  | "read_self"
  | "update_self"
  | "delete_self"
  | "manage"
  | "execute"
  | "export"
  | "approve"
  | "revoke"
  | "audit"
  | "deidentify"
  | "override";

export type Permission = {
  resource: string;
  action: PermissionAction;
};

/**
 * Derives UI permissions from the current profile. Supabase RLS remains the
 * security boundary; this list only controls visibility in React components.
 */
export const fetchPermissionsFn = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [] as Permission[];

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_approved")
    .eq("id", user.id)
    .single();

  if (profile?.role === "admin") {
    return ["create", "read", "update", "delete", "approve"].map((action) => ({
      resource: "modules",
      action: action as PermissionAction,
    }));
  }

  if (profile?.role === "teacher" && profile.is_approved) {
    return ["read", "create_self", "update_self", "delete_self"].map((action) => ({
      resource: "modules",
      action: action as PermissionAction,
    }));
  }

  return [{ resource: "modules", action: "read" }] as Permission[];
});

export function hasPermission(
  permissions: Permission[],
  resource: string,
  action: PermissionAction,
): boolean {
  return permissions.some(
    (permission) => permission.resource === resource && permission.action === action,
  );
}
