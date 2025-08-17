import { GoogleAuthProvider, linkWithPopup, signInWithPopup, getAuth, UserCredential } from "firebase/auth";

export async function signInWithGoogle(): Promise<UserCredential> {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  
  // Add additional scopes if needed
  provider.addScope('profile');
  provider.addScope('email');

  const user = auth.currentUser;
  
  if (user?.isAnonymous) {
    // Convert guest -> real account by linking
    console.log("Linking anonymous user with Google account");
    return await linkWithPopup(user, provider);
  } else {
    // No anonymous user, sign in normally
    console.log("Signing in with Google");
    return await signInWithPopup(auth, provider);
  }
}
