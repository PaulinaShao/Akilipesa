import { getAuth, signInAnonymously } from "firebase/auth";

// Check if we're in demo mode
const isDemoMode = import.meta.env.VITE_FIREBASE_PROJECT_ID === 'demo-project' ||
                   import.meta.env.VITE_FIREBASE_API_KEY === 'demo-api-key' ||
                   !import.meta.env.VITE_FIREBASE_PROJECT_ID ||
                   !import.meta.env.VITE_FIREBASE_API_KEY;

export async function ensureGuestAuth(): Promise<string> {
  try {
    // In demo mode, skip Firebase authentication entirely
    if (isDemoMode) {
      console.log('Demo mode - skipping Firebase authentication');
      return "demo-guest";
    }

    const auth = getAuth();

    // If someone is already signed in (phone/google), keep it.
    if (auth.currentUser && !auth.currentUser.isAnonymous) {
      return auth.currentUser.uid;
    }

    // If no user or anonymous, try to create anonymous session
    if (!auth.currentUser) {
      try {
        await signInAnonymously(auth);
        console.log('Anonymous authentication successful');
      } catch (error: any) {
        // Handle specific Firebase errors gracefully
        console.warn('Anonymous auth failed, continuing in offline mode:', error?.message || error);

        // For offline browsing, we'll return a consistent guest ID
        return "offline-guest";
      }
    }

    return auth.currentUser?.uid || "offline-guest";
  } catch (error: any) {
    // Catch any other authentication errors
    console.warn('Guest authentication error, falling back to offline mode:', error?.message || error);
    return "offline-guest";
  }
}
