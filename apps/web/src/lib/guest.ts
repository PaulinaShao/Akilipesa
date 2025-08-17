import { Auth, signInAnonymously, User } from 'firebase/auth';

const GUEST_TRY_KEY = 'akili:lastGuestTry';
const GUEST_DISABLED_KEY = 'akili:guestDisabled';
const RETRY_INTERVAL = 5 * 60 * 1000; // 5 minutes

/**
 * Check if we should attempt guest authentication
 * Only allows one attempt per 5 minutes
 */
export function shouldTryGuest(): boolean {
  const lastTry = localStorage.getItem(GUEST_TRY_KEY);
  if (!lastTry) return true;
  
  const lastTryTime = parseInt(lastTry, 10);
  const now = Date.now();
  
  return (now - lastTryTime) > RETRY_INTERVAL;
}

/**
 * Mark guest authentication attempt with timestamp and result
 */
export function markGuestTry(success: boolean, error?: any): void {
  localStorage.setItem(GUEST_TRY_KEY, Date.now().toString());
  
  if (!success && error) {
    const errorCode = error?.code || '';
    // Disable guest auth for specific admin-only errors
    if (errorCode === 'auth/operation-not-allowed' || 
        errorCode === 'auth/admin-restricted-operation') {
      localStorage.setItem(GUEST_DISABLED_KEY, 'true');
      console.warn('Guest auth disabled due to admin restriction');
    }
  }
}

/**
 * Ensure guest authentication with rate limiting and error handling
 * Returns existing user, new anonymous user, or null if disabled/failed
 */
export async function ensureGuest(auth: Auth): Promise<User | null> {
  // Return existing user if already authenticated
  if (auth.currentUser) {
    return auth.currentUser;
  }
  
  // Skip if guest auth is disabled
  if (localStorage.getItem(GUEST_DISABLED_KEY) === 'true') {
    return null;
  }
  
  // Skip if too many recent attempts
  if (!shouldTryGuest()) {
    return null;
  }
  
  try {
    const result = await signInAnonymously(auth);
    markGuestTry(true);
    console.log('Guest auth successful');
    return result.user;
  } catch (error: any) {
    markGuestTry(false, error);
    console.warn('Guest auth failed:', error?.code, error?.message);
    return null;
  }
}
