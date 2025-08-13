import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { resetRecaptcha } from "@/auth/phone";

export async function logout() {
  try {
    await signOut(auth);
    resetRecaptcha(); // avoids "already rendered" if you sign in again immediately
  } catch (error) {
    console.error('Sign out error:', error);
    // Still reset reCAPTCHA even if sign out fails
    resetRecaptcha();
    throw error;
  }
}
