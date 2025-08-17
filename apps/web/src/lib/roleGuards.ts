import { User } from '@/store';

export type UserRole = 'user' | 'creator' | 'moderator' | 'admin';

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  user: 1,
  creator: 2,
  moderator: 3,
  admin: 4,
};

export const ROLE_PERMISSIONS = {
  // Basic user permissions
  user: [
    'view_content',
    'create_content',
    'comment',
    'like',
    'purchase',
  ],
  
  // Creator permissions (includes user permissions)
  creator: [
    'view_content',
    'create_content',
    'comment',
    'like',
    'purchase',
    'sell_products',
    'monetize_content',
    'view_analytics',
  ],
  
  // Moderator permissions (includes creator permissions)
  moderator: [
    'view_content',
    'create_content',
    'comment',
    'like',
    'purchase',
    'sell_products',
    'monetize_content',
    'view_analytics',
    'moderate_content',
    'manage_users',
    'view_reports',
  ],
  
  // Admin permissions (all permissions)
  admin: [
    'view_content',
    'create_content',
    'comment',
    'like',
    'purchase',
    'sell_products',
    'monetize_content',
    'view_analytics',
    'moderate_content',
    'manage_users',
    'view_reports',
    'admin_dashboard',
    'manage_platform',
    'view_all_data',
    'system_settings',
  ],
};

/**
 * Check if user has a specific role or higher
 */
export function hasRole(user: User | null, requiredRole: UserRole): boolean {
  if (!user || !user.role) return false;
  
  const userLevel = ROLE_HIERARCHY[user.role];
  const requiredLevel = ROLE_HIERARCHY[requiredRole];
  
  return userLevel >= requiredLevel;
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(user: User | null, permission: string): boolean {
  if (!user || !user.role) return false;
  
  const rolePermissions = ROLE_PERMISSIONS[user.role];
  return rolePermissions.includes(permission);
}

/**
 * Check if user can access admin features
 */
export function canAccessAdmin(user: User | null): boolean {
  return hasRole(user, 'moderator'); // Moderators and admins can access
}

/**
 * Check if user is a full admin (has all permissions)
 */
export function isAdmin(user: User | null): boolean {
  return hasRole(user, 'admin');
}

/**
 * Check if user can moderate content
 */
export function canModerate(user: User | null): boolean {
  return hasRole(user, 'moderator');
}

/**
 * Check if user can create/manage content
 */
export function isCreator(user: User | null): boolean {
  return hasRole(user, 'creator');
}

/**
 * Get user role display name
 */
export function getRoleDisplayName(role: UserRole): string {
  const names: Record<UserRole, string> = {
    user: 'User',
    creator: 'Creator',
    moderator: 'Moderator',
    admin: 'Administrator',
  };
  return names[role];
}

/**
 * Get role color for UI display
 */
export function getRoleColor(role: UserRole): string {
  const colors: Record<UserRole, string> = {
    user: 'text-gray-400',
    creator: 'text-blue-400',
    moderator: 'text-orange-400',
    admin: 'text-red-400',
  };
  return colors[role];
}

/**
 * Get available actions for a user role
 */
export function getRoleActions(role: UserRole): string[] {
  return ROLE_PERMISSIONS[role];
}
