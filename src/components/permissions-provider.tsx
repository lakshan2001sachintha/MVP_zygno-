// src/components/permissions-provider.tsx

import { createContext, useContext } from "react";
import type { ReactNode } from "react";

import type { Permission } from "#/lib/permissions";

// ─── Context ─────────────────────────────────────────────────────────────────

const PermissionsContext = createContext<Permission[]>([]);

// ─── Provider ─────────────────────────────────────────────────────────────────

/**
 * Bridges permissions from the TanStack Router context (fetched server-side
 * in __root.tsx beforeLoad) into a React context so generic components like
 * <Can> can consume them without being tied to a specific route.
 */
export function PermissionsProvider({
  permissions,
  children,
}: {
  permissions: Permission[];
  children: ReactNode;
}) {
  return <PermissionsContext.Provider value={permissions}>{children}</PermissionsContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Returns the current user's permission list.
 * Returns [] when called outside <PermissionsProvider> (unauthenticated pages).
 */
export function usePermissions(): Permission[] {
  return useContext(PermissionsContext);
}
