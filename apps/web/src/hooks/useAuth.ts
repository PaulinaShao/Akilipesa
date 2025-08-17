import { useAppStore } from '@/store';
import { hasRole, hasPermission, canAccessAdmin, isAdmin, canModerate, isCreator, type UserRole } from '@/lib/roleGuards';

export function useAuth() {
  const { user, setUser } = useAppStore();

  // Check both app user and Firebase user for authentication
  const isAuthenticated = user && !user.id.includes('guest') && !user.id.includes('demo') && isRealUser();
  const isGuest = !user || user.id.includes('guest') || user.id.includes('demo') || !isRealUser();

  const signOut = () => {
    // Clear all authentication state
    setUser(null);
    localStorage.removeItem('user');
    sessionStorage.removeItem('postLoginIntent');

    // Redirect to home
    window.location.href = '/reels';
  };

  // Role checking functions
  const checkRole = (requiredRole: UserRole) => hasRole(user, requiredRole);
  const checkPermission = (permission: string) => hasPermission(user, permission);

  return {
    user,
    isAuthenticated,
    isGuest,
    status: isAuthenticated ? 'authenticated' : 'guest',
    signIn: (userData: any) => setUser(userData),
    signOut,
    // Role functions
    hasRole: checkRole,
    hasPermission: checkPermission,
    canAccessAdmin: () => canAccessAdmin(user),
    isAdmin: () => isAdmin(user),
    canModerate: () => canModerate(user),
    isCreator: () => isCreator(user),
  };
}
