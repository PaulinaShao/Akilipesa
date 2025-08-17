import {
  PhoneAuthProvider,
  linkWithCredential,
  signInWithCredential,
  signInWithPhoneNumber,
  getAuth,
  RecaptchaVerifier,
  ConfirmationResult,
  UserCredential
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Extend Window interface for reCAPTCHA
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

export async function sendPhoneCode(phoneNumber: string): Promise<ConfirmationResult> {
  const auth = getAuth();

  // Ensure reCAPTCHA container exists
  if (!document.getElementById('recaptcha-container')) {
    const container = document.createElement('div');
    container.id = 'recaptcha-container';
    container.style.display = 'none';
    document.body.appendChild(container);
  }

  // Initialize reCAPTCHA if not already done
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: () => {
        console.log("reCAPTCHA verified");
      }
    });
  }

  // Use signInWithPhoneNumber to get ConfirmationResult
  return await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier!);
}

export async function verifyPhoneCode(confirmationResult: ConfirmationResult, code: string): Promise<UserCredential> {
  const auth = getAuth();
  const credential = PhoneAuthProvider.credential(confirmationResult.verificationId, code);

  const user = auth.currentUser;
  let result: UserCredential;

  if (user?.isAnonymous) {
    // Convert guest -> real account by linking
    console.log("Linking anonymous user with phone number");
    result = await linkWithCredential(user, credential);
  } else {
    // No anonymous user, sign in normally
    console.log("Signing in with phone number");
    result = await signInWithCredential(auth, credential);
  }

  // Create/merge user document in Firestore
  if (result.user) {
    await setDoc(doc(db, "users", result.user.uid), {
      displayName: result.user.displayName ?? "",
      phoneNumber: result.user.phoneNumber ?? "",
      plan: "free",
      role: "user",
      createdAt: serverTimestamp(),
      lastSignIn: serverTimestamp()
    }, { merge: true });

    console.log("User document created/updated in Firestore");
  }

  return result;
}

// Utility to check if user is real (not anonymous)
export function isRealUser(): boolean {
  const auth = getAuth();
  return !!auth.currentUser && !auth.currentUser.isAnonymous;
}
