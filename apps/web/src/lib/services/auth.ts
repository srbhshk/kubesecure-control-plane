import { useAuth, useUser } from '@clerk/nextjs';

// This is a placeholder for actual RBAC logic
// We will implement more sophisticated RBAC in Phase 2
export enum UserRole {
  ADMIN = 'admin',
  PLATFORM_ENGINEER = 'platform_engineer',
  DEVOPS_SRE = 'devops_sre',
}

class AuthService {
  // Clerk integration helpers
  public getRole(user: { publicMetadata?: { role?: UserRole } } | null | undefined): UserRole {
    // This logic depends on how roles are stored in Clerk (e.g., privateMetadata)
    return (user?.publicMetadata?.role as UserRole) || UserRole.DEVOPS_SRE;
  }

  public hasPermission(
    user: { publicMetadata?: { role?: UserRole } } | null | undefined,
    permission: string
  ): boolean {
    const role = this.getRole(user);

    // Simple permission mapping for now
    const permissions: Record<UserRole, string[]> = {
      [UserRole.ADMIN]: ['*'],
      [UserRole.PLATFORM_ENGINEER]: ['promotions.create', 'environments.manage', 'cost.view'],
      [UserRole.DEVOPS_SRE]: ['promotions.approve', 'cost.view'],
    };

    if (role === UserRole.ADMIN) return true;

    const rolePermissions = permissions[role] || [];
    return rolePermissions.includes(permission) || rolePermissions.includes('*');
  }
}

export const authService = new AuthService();
