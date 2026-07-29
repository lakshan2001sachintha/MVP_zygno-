import { describe, expect, it } from "vitest";

import { hasPermission, type Permission } from "#/lib/permissions";

describe("hasPermission", () => {
  const permissions: Permission[] = [
    { resource: "modules", action: "read" },
    { resource: "modules", action: "update_self" },
  ];

  it("allows an exact resource and action match", () => {
    expect(hasPermission(permissions, "modules", "read")).toBe(true);
  });

  it("does not treat a self-scoped action as an unrestricted action", () => {
    expect(hasPermission(permissions, "modules", "update")).toBe(false);
  });

  it("rejects permissions for another resource", () => {
    expect(hasPermission(permissions, "profiles", "read")).toBe(false);
  });
});
