import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
// App Check imports are safe; we just won't call it without a key
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const app = initializeApp(cfg);

// 👇 Only initialize App Check if the env key exists and we're on a supported domain
const appCheckKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
const isProduction = import.meta.env.PROD;
const hostname = typeof window !== 'undefined' ? window.location.hostname : '';

// Only initialize App Check in production and on authorized domains
if (appCheckKey && isProduction) {
  try {
    // Skip App Check for development domains like fly.dev, localhost, etc.
    const isAuthorizedDomain = hostname.includes('akilipesa.com') ||
                              hostname.includes('akilipesa-prod.web.app') ||
                              hostname.includes('akilipesa-prod.firebaseapp.com');

    if (isAuthorizedDomain) {
      console.log('Initializing App Check for authorized domain:', hostname);
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(appCheckKey),
        isTokenAutoRefreshEnabled: true,
      });
    } else {
      console.log('Skipping App Check for unauthorized domain:', hostname);
    }
  } catch (error) {
    console.warn('App Check initialization failed, continuing without App Check:', error);
  }
} else {
  console.log('App Check disabled:', {
    hasKey: !!appCheckKey,
    isProduction,
    hostname
  });
}

export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);
export const db = getFirestore(app);
export const fns = getFunctions(app, import.meta.env.VITE_FUNCTIONS_REGION);

// Backward compatibility alias
export const functions = fns;

// Export demo mode flag for other modules
export const isFirebaseDemoMode = import.meta.env.VITE_APP_ENV === 'demo' || import.meta.env.DEV;

// Alias for backward compatibility
export const functions = fns;

export const call = <T=unknown, R=unknown>(name: string) =>
  httpsCallable<T, R>(fns, name);
