import { UserRole } from "./roles";

export type Permission =
  | "promotions.view"
  | "promotions.create"
  | "promotions.approve"
  | "environments.view"
  | "environments.manage"
  | "cost.view"
  | "drift.view"
  | "policies.view"
  | "policies.manage"
  | "settings.view"
  | "settings.manage"
  | "users.manage";

export const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    "promotions.view",
    "promotions.create",
    "promotions.approve",
    "environments.view",
    "environments.manage",
    "cost.view",
    "drift.view",
    "policies.view",
    "policies.manage",
    "settings.view",
    "settings.manage",
    "users.manage",
  ],
  [UserRole.PLATFORM_ENGINEER]: [
    "promotions.view",
    "promotions.create",
    "environments.view",
    "environments.manage",
    "cost.view",
    "drift.view",
    "policies.view",
    "policies.manage",
    "settings.view",
  ],
  [UserRole.DEVOPS_SRE]: [
    "promotions.view",
    "promotions.approve",
    "environments.view",
    "cost.view",
    "drift.view",
    "policies.view",
    "settings.view",
  ],
  [UserRole.VIEWER]: [
    "promotions.view",
    "environments.view",
    "cost.view",
    "drift.view",
    "policies.view",
    "settings.view",
  ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}
