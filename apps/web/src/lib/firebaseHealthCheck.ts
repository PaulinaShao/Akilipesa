// Simple Firebase health check that doesn't require permissions
import { getFirebaseApp, getDb, getAuthInstance } from './firebaseEnhanced';

export interface FirebaseHealthStatus {
  app: boolean;
  firestore: boolean;
  auth: boolean;
  overall: boolean;
}

export function checkFirebaseHealth(): FirebaseHealthStatus {
  const status: FirebaseHealthStatus = {
    app: false,
    firestore: false,
    auth: false,
    overall: false
  };

  try {
    // Test Firebase app initialization
    const app = getFirebaseApp();
    status.app = !!app;
    console.log('🔥 Firebase app:', status.app ? '✅ OK' : '❌ Failed');
  } catch (error) {
    console.error('Firebase app initialization failed:', error);
  }

  try {
    // Test Firestore initialization
    const db = getDb();
    status.firestore = !!db;
    console.log('🗄️ Firestore:', status.firestore ? '✅ OK' : '❌ Failed');
  } catch (error) {
    console.error('Firestore initialization failed:', error);
  }

  try {
    // Test Auth initialization
    const auth = getAuthInstance();
    status.auth = !!auth;
    console.log('🔐 Firebase Auth:', status.auth ? '✅ OK' : '❌ Failed');
  } catch (error) {
    console.error('Firebase Auth initialization failed:', error);
  }

  // Overall status
  status.overall = status.app && status.firestore && status.auth;
  
  if (status.overall) {
    console.log('✅ Firebase health check: All services initialized successfully');
  } else {
    console.warn('⚠️ Firebase health check: Some services failed to initialize');
  }

  return status;
}

// Simple async wrapper for consistency
export async function runFirebaseHealthCheck(): Promise<FirebaseHealthStatus> {
  return new Promise((resolve) => {
    try {
      const status = checkFirebaseHealth();
      resolve(status);
    } catch (error) {
      console.error('Firebase health check error:', error);
      resolve({
        app: false,
        firestore: false,
        auth: false,
        overall: false
      });
    }
  });
}
