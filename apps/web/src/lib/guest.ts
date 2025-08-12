import { getAuth, signInAnonymously } from "firebase/auth";

export async function ensureGuestAuth(): Promise<string> {
  const auth = getAuth();
  // If someone is already signed in (phone/google), keep it.
  if (auth.currentUser && !auth.currentUser.isAnonymous) return auth.currentUser.uid;
  // If no user or anonymous, make sure we at least have an anon session.
  if (!auth.currentUser) {
    await signInAnonymously(auth).catch(() => {/* ignore for read-only browsing */});
  }
  return auth.currentUser?.uid || "guest";
}
