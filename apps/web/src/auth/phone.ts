// apps/web/src/auth/phone.ts
import { auth } from "@/lib/firebaseEnhanced";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";

let verifier: RecaptchaVerifier | null = null;

export function getPhoneRecaptcha(): RecaptchaVerifier {
  if (typeof window === "undefined") throw new Error("reCAPTCHA is browser-only");
  // The container must exist; add it if missing
  const containerId = "recaptcha-container";
  const el = document.getElementById(containerId);
  if (!el) throw new Error("Missing #recaptcha-container in DOM");

  if (!verifier) {
    verifier = new RecaptchaVerifier(auth, containerId, { size: "invisible" });
  }
  return verifier;
}

export async function startPhoneSignIn(e164Phone: string): Promise<ConfirmationResult> {
  const r = getPhoneRecaptcha();
  // For invisible captchas, render is safe and ensures a widget is present.
  await r.render();
  return signInWithPhoneNumber(auth, e164Phone, r);
}

export function resetRecaptcha() {
  if (verifier) {
    // Clear removes widget and allows clean recreation if needed (e.g., after sign-out)
    verifier.clear();
    verifier = null;
  }
}
