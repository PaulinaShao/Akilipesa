import { getAuth, setPersistence, browserLocalPersistence, signInAnonymously } from 'firebase/auth';
import { getFirebaseApp } from './firebaseEnhanced';

let started = false;
let inFlight = false;

export async function initGuestOnce() {
  if (started) return;
  started = true;

  const auth = getAuth(getFirebaseApp());
  await setPersistence(auth, browserLocalPersistence);

  if (auth.currentUser) return;     // reuse existing session
  if (inFlight) return;             // avoid double call on fast re-renders
  inFlight = true;
  try {
    await signInAnonymously(auth);
    console.log('Signed in: guest');
  } finally {
    inFlight = false;
  }
}
