// src/components/can.tsx
//
// Permission gate component. Renders children based on the current user's
// permissions. Two usage patterns via a discriminated union:
//
//   Direct:    <Can resource="patients" action="read">...</Can>
//   Map key:   <Can permKey="nav.patients">...</Can>
//
// Modes (default: "hide"):
//   "hide"    — returns null when permission is missing (element not mounted)
//   "disable" — renders children with aria-disabled + pointer-events-none
//               when permission is missing (element visible but inert)

import type { ReactNode } from "react";

import { usePermissions } from "#/components/permissions-provider";
import { resolvePermission } from "#/lib/permission-map";
import { hasPermission, type PermissionAction } from "#/lib/permissions";

// ─── Types ───────────────────────────────────────────────────────────────────

type CanByResourceAction = {
  resource: string;
  action: PermissionAction;
  permKey?: never;
};

type CanByPermKey = {
  permKey: string;
  resource?: never;
  action?: never;
};

type CanProps = (CanByResourceAction | CanByPermKey) & {
  /** Controls what happens when the user lacks permission. Defaults to "hide". */
  mode?: "hide" | "disable";
  children: ReactNode;
};

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Renders children only when the current user holds the required permission.
 *
 * @example
 *   // Gate via a map key (recommended — keeps resource/action out of JSX)
 *   <Can permKey="patients.records.read">
 *     <PatientTable />
 *   </Can>
 *
 * @example
 *   // Gate directly (useful before adding to PERMISSION_MAP)
 *   <Can resource="reports" action="export" mode="disable">
 *     <ExportButton />
 *   </Can>
 */
export function Can({ mode = "hide", children, ...props }: CanProps) {
  const permissions = usePermissions();

  let allowed: boolean;

  if ("permKey" in props && props.permKey !== undefined) {
    const entry = resolvePermission(props.permKey);
    // A key absent from PERMISSION_MAP means no permission is required.
    allowed = entry === undefined || hasPermission(permissions, entry.resource, entry.action);
  } else {
    allowed = hasPermission(
      permissions,
      (props as CanByResourceAction).resource,
      (props as CanByResourceAction).action,
    );
  }

  if (allowed) return <>{children}</>;

  if (mode === "disable") {
    return (
      <span
        aria-disabled="true"
        className="pointer-events-none opacity-50 select-none"
        tabIndex={-1}
      >
        {children}
      </span>
    );
  }

  // mode === "hide"
  return null;
}
