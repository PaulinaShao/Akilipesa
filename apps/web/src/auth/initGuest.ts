import { getAuth, onAuthStateChanged, signInAnonymously, setPersistence, browserLocalPersistence } from "firebase/auth";

export function initGuestSignIn() {
  const auth = getAuth();
  setPersistence(auth, browserLocalPersistence);

  let tried = false;
  onAuthStateChanged(auth, async (user) => {
    if (tried) return;
    tried = true;
    if (!user) {
      try {
        await signInAnonymously(auth);
        console.log("Guest auth started");
      } catch (error) {
        console.warn("Guest auth failed:", error);
      }
    } else {
      console.log("Signed in:", user.isAnonymous ? "guest" : "real user");
    }
  });
}
