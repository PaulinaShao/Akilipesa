// Single source of truth for Firebase client & Firestore.
// Import ONLY from this file everywhere else.

import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentSingleTabManager,
  type Firestore,
} from 'firebase/firestore';
import { getAuth, setPersistence, browserLocalPersistence, type Auth } from 'firebase/auth';
import { getFunctions, httpsCallable, type Functions } from 'firebase/functions';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Singleton instances
let appInstance: FirebaseApp | undefined;
let dbInstance: Firestore | undefined;
let authInstance: Auth | undefined;
let functionsInstance: Functions | undefined;
let appCheckDone = false;

// Validate configuration
const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'];
const missingFields = requiredFields.filter(field => !firebaseConfig[field as keyof typeof firebaseConfig]);

if (missingFields.length > 0) {
  console.error('❌ Missing Firebase configuration:', missingFields);
  throw new Error(`Missing Firebase configuration: ${missingFields.join(', ')}`);
}

export function getFirebaseApp(): FirebaseApp {
  if (!appInstance) {
    appInstance = getApps().length ? getApp() : initializeApp(firebaseConfig);
    console.log('🔥 Firebase app initialized:', firebaseConfig.projectId);
  }
  return appInstance;
}

export function getDb(): Firestore {
  if (dbInstance) return dbInstance;
  
  const app = getFirebaseApp();
  
  // Try to initialize once with your preferred options…
  try {
    console.log('🗄️ Initializing Firestore with persistent cache...');
    dbInstance = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentSingleTabManager({})
      }),
    });
    console.log('✅ Firestore initialized with persistent cache');
  } catch (error) {
    // …but if another module already initialized with different options,
    // fall back to the existing instance to avoid the crash.
    console.warn('⚠️ Firestore already initialized, using existing instance:', error);
    dbInstance = getFirestore(app);
  }
  
  return dbInstance;
}

export function getAuthInstance(): Auth {
  if (!authInstance) {
    authInstance = getAuth(getFirebaseApp());
    setPersistence(authInstance, browserLocalPersistence);
    console.log('🔐 Firebase Auth initialized');
  }
  return authInstance;
}

export function getFunctionsInstance(): Functions {
  if (!functionsInstance) {
    functionsInstance = getFunctions(getFirebaseApp(), import.meta.env.VITE_FUNCTIONS_REGION || 'us-central1');
    console.log('⚡ Firebase Functions initialized');
  }
  return functionsInstance;
}

export function ensureAppCheck() {
  if (appCheckDone) return;
  
  const key = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  const isProduction = import.meta.env.PROD;
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  
  console.log('🔐 App Check setup:', {
    hasKey: !!key,
    isProduction,
    hostname,
  });
  
  // Only enable App Check in production if you actually have a key set
  if (isProduction && key) {
    try {
      // More permissive domain checking for fly.dev and other hosting platforms
      const isAuthorizedDomain = hostname.includes('akilipesa.com') ||
                                hostname.includes('akilipesa-prod.web.app') ||
                                hostname.includes('akilipesa-prod.firebaseapp.com') ||
                                hostname.includes('fly.dev'); // Add fly.dev support

      if (isAuthorizedDomain) {
        console.log('✅ Initializing App Check for authorized domain:', hostname);
        initializeAppCheck(getFirebaseApp(), {
          provider: new ReCaptchaV3Provider(key),
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
  
  appCheckDone = true;
}

// Optional convenience for app start
export function initFirebase() {
  getFirebaseApp();
  getDb();
  getAuthInstance();
  getFunctionsInstance();
  ensureAppCheck();
  console.log('🚀 Firebase fully initialized');
}

// Convenience exports for compatibility
export const auth = getAuthInstance();
export const db = getDb();
export const fns = getFunctionsInstance();
export const functions = getFunctionsInstance(); // Backward compatibility

export const call = <T=unknown, R=unknown>(name: string) =>
  httpsCallable<T, R>(getFunctionsInstance(), name);

// Export demo mode flag
export const isFirebaseDemoMode = import.meta.env.VITE_APP_ENV === 'demo' || import.meta.env.DEV;

// Enhanced connection diagnostics
export function getFirebaseStatus() {
  return {
    app: !!appInstance,
    auth: !!authInstance,
    db: !!dbInstance,
    functions: !!functionsInstance,
    environment: {
      isDev: import.meta.env.DEV,
      isProduction: import.meta.env.PROD,
      hostname: typeof window !== 'undefined' ? window.location.hostname : '',
    },
    config: {
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain,
      functionsRegion: import.meta.env.VITE_FUNCTIONS_REGION,
    }
  };
}
