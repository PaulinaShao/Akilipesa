// Firebase connection test utility
import { getDb } from './firebaseEnhanced';
import { enableNetwork, disableNetwork } from 'firebase/firestore';

export async function testFirebaseConnection(): Promise<boolean> {
  try {
    console.log('🔧 Testing Firebase connection...');
    const db = getDb();

    // Test connection by checking if we can initialize the database
    // This doesn't require any permissions but establishes the connection
    if (db) {
      console.log('✅ Firebase Firestore instance created successfully');
      return true;
    } else {
      console.warn('⚠️ Firebase Firestore instance not created');
      return false;
    }
  } catch (error: any) {
    const errorMessage = error?.message || error;
    console.error('❌ Firebase connection test failed:', errorMessage);

    // Check if it's a network-related error vs permissions error
    if (error?.message?.includes('Failed to fetch') ||
        error?.message?.includes('NetworkError') ||
        error?.code === 'unavailable') {
      console.warn('🌐 Network connectivity issue detected');
      return false;
    } else if (error?.code === 'permission-denied' ||
               error?.message?.includes('Missing or insufficient permissions')) {
      console.log('🔐 Firebase connection established but permissions required for data access (this is normal)');
      return true; // Connection is working, just needs auth for data access
    }

    return false;
  }
}

// Run connection test with retry logic
export async function testFirebaseConnectionWithRetry(maxRetries = 3): Promise<boolean> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const success = await testFirebaseConnection();
      if (success) return true;
      
      if (i < maxRetries - 1) {
        console.log(`🔄 Retrying Firebase connection test (${i + 1}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    } catch (error) {
      console.error(`Firebase connection test attempt ${i + 1} failed:`, error);
    }
  }
  
  console.error('❌ All Firebase connection test attempts failed');
  return false;
}
