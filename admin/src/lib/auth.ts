export type Role =
  | "SUPER_ADMIN"
  | "MANAGER"
  | "STOCK_MANAGER"
  | "SUPPORT"
  | "MARKETING"
  | "ACCOUNTANT";

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: Role;
}

const PERMISSIONS: Record<Role, string[]> = {
  SUPER_ADMIN: ["*"],
  MANAGER: ["orders", "products", "stock", "customers", "payments", "shipments", "promotions", "cms", "reports", "settings"],
  STOCK_MANAGER: ["products", "stock", "orders:read"],
  SUPPORT: ["orders", "customers", "orders:read", "customers:read"],
  MARKETING: ["promotions", "cms", "reports:read"],
  ACCOUNTANT: ["orders:read", "payments", "reports"],
};

export function hasPermission(role: Role, resource: string): boolean {
  const perms = PERMISSIONS[role as Role];
  if (!perms) return false;
  if (perms.includes("*")) return true;
  if (perms.includes(resource)) return true;
  const [res] = resource.split(":");
  return perms.includes(res);
}

export function requireRole(allowed: Role[]): (user: SessionUser) => boolean {
  return (user: SessionUser) => allowed.includes(user.role as Role);
}
