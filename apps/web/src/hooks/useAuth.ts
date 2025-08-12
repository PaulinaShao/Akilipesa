import { useAppStore } from '@/store';

export function useAuth() {
  const { user, setUser } = useAppStore();
  
  const isAuthenticated = user && !user.id.includes('guest') && !user.id.includes('demo');
  const isGuest = !user || user.id.includes('guest') || user.id.includes('demo');
  
  const signOut = () => {
    // Clear all authentication state
    setUser(null);
    localStorage.removeItem('user');
    sessionStorage.removeItem('postLoginIntent');

    // Redirect to home
    window.location.href = '/reels';
  };
  
  return {
    user,
    isAuthenticated,
    isGuest,
    status: isAuthenticated ? 'authenticated' : 'guest',
    signIn: (userData: any) => setUser(userData),
    signOut
  };
}
