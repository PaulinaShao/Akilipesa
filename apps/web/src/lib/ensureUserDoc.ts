import { auth, db } from './firebaseEnhanced';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

export async function ensureUserDoc() {
  const u = auth.currentUser;
  if (!u) return;
  
  const ref = doc(db, 'users', u.uid);
  const snap = await getDoc(ref);
  
  if (!snap.exists()) {
    await setDoc(ref, {
      displayName: u.displayName || '',
      avatar: u.photoURL || '',
      plan: 'free',
      trial: { calls: 60, likes: 3 },
      createdAt: serverTimestamp()
    });
  }
}
