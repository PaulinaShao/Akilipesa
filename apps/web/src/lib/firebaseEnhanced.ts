import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { getFirestoreInstance, safeFirestoreOperation } from './firestoreManager';

const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Validate configuration
const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'];
const missingFields = requiredFields.filter(field => !cfg[field as keyof typeof cfg]);

if (missingFields.length > 0) {
  console.error('❌ Missing Firebase configuration:', missingFields);
  throw new Error(`Missing Firebase configuration: ${missingFields.join(', ')}`);
}

console.log('🔥 Initializing Firebase with config:', {
  ...cfg,
  apiKey: cfg.apiKey?.slice(0, 10) + '...',
});

export const app = initializeApp(cfg);

// Authentication setup
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);

// Enhanced Firestore setup with error handling
export async function getDb() {
  return getFirestoreInstance();
}

// Safe Firestore operations export
export { safeFirestoreOperation };

// Functions setup
export const fns = getFunctions(app, import.meta.env.VITE_FUNCTIONS_REGION || 'us-central1');
export const functions = fns; // Backward compatibility

export const call = <T=unknown, R=unknown>(name: string) =>
  httpsCallable<T, R>(fns, name);

// App Check setup with enhanced error handling
const appCheckKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
const isProduction = import.meta.env.PROD;
const hostname = typeof window !== 'undefined' ? window.location.hostname : '';

console.log('🔐 App Check setup:', {
  hasKey: !!appCheckKey,
  isProduction,
  hostname,
});

if (appCheckKey && isProduction) {
  try {
    // More permissive domain checking for fly.dev and other hosting platforms
    const isAuthorizedDomain = hostname.includes('akilipesa.com') ||
                              hostname.includes('akilipesa-prod.web.app') ||
                              hostname.includes('akilipesa-prod.firebaseapp.com') ||
                              hostname.includes('fly.dev'); // Add fly.dev support

    if (isAuthorizedDomain) {
      console.log('✅ Initializing App Check for authorized domain:', hostname);
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(appCheckKey),
        isTokenAutoRefreshEnabled: true,
      });
    } else {
      console.log('⚠️ Skipping App Check for unauthorized domain:', hostname);
    }
  } catch (error) {
    console.warn('⚠️ App Check initialization failed, continuing without App Check:', error);
  }
} else {
  console.log('📝 App Check disabled - not in production or no key provided');
}

// Export demo mode flag
export const isFirebaseDemoMode = import.meta.env.VITE_APP_ENV === 'demo' || import.meta.env.DEV;

// Enhanced connection diagnostics
export function getFirebaseStatus() {
  return {
    app: !!app,
    auth: !!auth,
    functions: !!fns,
    environment: {
      isDev: import.meta.env.DEV,
      isProduction,
      hostname,
    },
    config: {
      projectId: cfg.projectId,
      authDomain: cfg.authDomain,
      functionsRegion: import.meta.env.VITE_FUNCTIONS_REGION,
    }
  };
}
