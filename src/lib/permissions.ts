// src/lib/permissions.ts

import { createServerFn } from "@tanstack/react-start";

import { getSupabaseServerClient } from "#/utils/supabase";

// ─── Types ───────────────────────────────────────────────────────────────────

/**
 * All permission actions supported by the platform.
 * Mirrors the `permission_action` enum in the Supabase schema.
 */
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

// ─── Server Function ─────────────────────────────────────────────────────────

/**
 * Fetches the current user's permissions via `get_my_permissions()`.
 * Returns [] when unauthenticated or the RPC errors — real enforcement
 * happens at the DB layer via RLS; this only drives UI visibility.
 */
export const fetchPermissionsFn = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.rpc("get_my_permissions");

  if (error || !data) return [] as Permission[];

  return data as Permission[];
});

// ─── Utility ─────────────────────────────────────────────────────────────────

/**
 * Returns true if the given permissions list includes the specified resource + action pair.
 * Pure function — safe to call anywhere including outside React.
 */
export function hasPermission(
  permissions: Permission[],
  resource: string,
  action: PermissionAction,
): boolean {
  return permissions.some((p) => p.resource === resource && p.action === action);
}
