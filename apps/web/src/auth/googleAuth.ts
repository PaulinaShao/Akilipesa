import { GoogleAuthProvider, linkWithPopup, signInWithPopup, getAuth, UserCredential } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function signInWithGoogle(): Promise<UserCredential> {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  // Add additional scopes if needed
  provider.addScope('profile');
  provider.addScope('email');

  const user = auth.currentUser;
  let credential: UserCredential;

  if (user?.isAnonymous) {
    // Convert guest -> real account by linking
    console.log("Linking anonymous user with Google account");
    credential = await linkWithPopup(user, provider);
  } else {
    // No anonymous user, sign in normally
    console.log("Signing in with Google");
    credential = await signInWithPopup(auth, provider);
  }

  // Create/merge user document in Firestore
  if (credential.user) {
    await setDoc(doc(db, "users", credential.user.uid), {
      displayName: credential.user.displayName ?? "",
      email: credential.user.email ?? "",
      photoURL: credential.user.photoURL ?? "",
      plan: "free",
      role: "user",
      createdAt: serverTimestamp(),
      lastSignIn: serverTimestamp()
    }, { merge: true });

    console.log("User document created/updated in Firestore");
  }

  return credential;
}
