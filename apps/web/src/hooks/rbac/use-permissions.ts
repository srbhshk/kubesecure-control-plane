import { useUser } from "@clerk/nextjs";
import { UserRole } from "@/lib/rbac/roles";
import { Permission, hasPermission as checkPermission } from "@/lib/rbac/permissions";

export function usePermissions() {
  const { user, isLoaded } = useUser();
  
  const role = (user?.publicMetadata?.role as UserRole) || UserRole.VIEWER;

  const can = (permission: Permission): boolean => {
    if (!isLoaded) return false;
    return checkPermission(role, permission);
  };

  const isAdmin = role === UserRole.ADMIN;

  return {
    role,
    can,
    isAdmin,
    isLoaded,
  };
}
