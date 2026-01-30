export enum UserRole {
  ADMIN = "admin",
  PLATFORM_ENGINEER = "platform_engineer",
  DEVOPS_SRE = "devops_sre",
  VIEWER = "viewer",
}

export const roleLabels: Record<UserRole, string> = {
  [UserRole.ADMIN]: "Administrator",
  [UserRole.PLATFORM_ENGINEER]: "Platform Engineer",
  [UserRole.DEVOPS_SRE]: "DevOps / SRE",
  [UserRole.VIEWER]: "Viewer",
};
