import { auth } from './firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';

let verifier: RecaptchaVerifier | null = null;

export function ensureInvisibleRecaptcha(containerId = 'recaptcha-container') {
  if (verifier) return verifier;
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  // Make sure a container exists in the DOM
  if (!document.getElementById(containerId)) {
    const el = document.createElement('div');
    el.id = containerId;
    el.style.display = 'none';
    document.body.appendChild(el);
  }
  verifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {}, // auto-validated on submit
    'expired-callback': () => verifier?.render()
  });
  return verifier;
}

export async function sendCode(e164Phone: string): Promise<ConfirmationResult> {
  const v = ensureInvisibleRecaptcha();
  return await signInWithPhoneNumber(auth, e164Phone, v);
}

// Phone number normalizer for Tanzania
export function normalizeTanzanianPhone(input: string): string {
  // Remove all non-digit characters
  let cleaned = input.replace(/\D/g, '');
  
  // Handle different formats:
  // 07xxxxxxxx -> +255 7xx xxx xxx
  // 2557xxxxxxxx -> +255 7xx xxx xxx  
  // +2557xxxxxxxx -> +255 7xx xxx xxx
  
  if (cleaned.startsWith('07') && cleaned.length === 10) {
    // Convert 07xxxxxxxx to +255 7xxxxxxxx
    cleaned = '255' + cleaned.substring(1);
  } else if (cleaned.startsWith('2557') && cleaned.length === 12) {
    // Already in 2557xxxxxxxx format
  } else if (cleaned.startsWith('7') && cleaned.length === 9) {
    // Convert 7xxxxxxxx to +255 7xxxxxxxx
    cleaned = '255' + cleaned;
  }
  
  // Ensure it starts with +255 and has correct length
  if (cleaned.startsWith('255') && cleaned.length === 12) {
    return '+' + cleaned;
  }
  
  // If we can't normalize, return original
  return input;
}
