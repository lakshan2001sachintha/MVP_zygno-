// src/lib/permission-map.ts
//
// Central registry: maps UI permission keys → required { resource, action }.
// This is the single source of truth for what permission each UI element needs.
//
// Usage:
//   <Can permKey="nav.patients">...</Can>
//   usePermissionByKey("reports.export")
//
// Naming convention: "section.noun[.verb]"
//   e.g. "nav.patients", "patients.records.read", "reports.export"
//
// Add an entry here before referencing it in <Can> or usePermissionByKey().
// Removing an entry means components using that key will be treated as
// "no permission required" (i.e. always visible) — see resolvePermission().

import type { PermissionAction } from "#/lib/permissions";

// ─── Types ───────────────────────────────────────────────────────────────────

export type PermissionMapEntry = {
  resource: string;
  action: PermissionAction;
};

// ─── Map ─────────────────────────────────────────────────────────────────────

export const PERMISSION_MAP: Record<string, PermissionMapEntry> = {
  // ── Navigation ─────────────────────────────────────────────────────────────
  // Uncomment and adapt as route-level permissions are defined.
  //
  // "nav.home":    { resource: "home",    action: "read" },
  // "nav.posts":   { resource: "posts",   action: "read" },
  //
  // ── Actions ────────────────────────────────────────────────────────────────
  // "posts.create":  { resource: "posts", action: "create" },
  // "posts.delete":  { resource: "posts", action: "delete" },
  // "reports.export": { resource: "reports", action: "export" },
};

// ─── Helper ──────────────────────────────────────────────────────────────────

/**
 * Resolves a UI permission key to its resource + action entry.
 * Returns undefined when the key is absent from the map —
 * callers should treat an absent key as "no permission required".
 */
export function resolvePermission(key: string): PermissionMapEntry | undefined {
  return PERMISSION_MAP[key];
}
