import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'demo-app-id',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const db = firestore; // Alias for convenience
export const functions = getFunctions(app);

// Connect to emulators in development (optional)
if (import.meta.env.DEV && import.meta.env.VITE_FIREBASE_PROJECT_ID === 'demo-project') {
  try {
    // Only connect to emulators if using demo project
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(firestore, 'localhost', 8080);
    connectFunctionsEmulator(functions, 'localhost', 5001);
    console.log('Connected to Firebase emulators');
  } catch (error) {
    console.warn('Firebase emulators not available, continuing in offline mode:', (error as any)?.message || error);
  }
}

// Global error handler for Firebase connection issues
const handleFirebaseError = (error: any, operation: string) => {
  const isNetworkError = error?.code === 'unavailable' ||
                         error?.message?.includes('fetch') ||
                         error?.message?.includes('network') ||
                         error?.message?.includes('offline');

  if (isNetworkError) {
    console.warn(`Firebase ${operation} failed (network issue), using offline mode:`, error?.message || error);
    return null;
  }

  console.error(`Firebase ${operation} error:`, error);
  throw error;
};

// Wrap Firebase operations with error handling
export const safeFirebaseOperation = async <T>(
  operation: () => Promise<T>,
  operationName: string,
  fallback?: T
): Promise<T | null> => {
  try {
    return await operation();
  } catch (error) {
    handleFirebaseError(error, operationName);
    return fallback || null;
  }
};

export default app;
