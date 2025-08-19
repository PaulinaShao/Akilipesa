// Firebase connection test utility
import { getDb } from './firebaseEnhanced';
import { doc, getDoc } from 'firebase/firestore';

export async function testFirebaseConnection(): Promise<boolean> {
  try {
    console.log('🔧 Testing Firebase connection...');
    const db = getDb();
    
    // Try to read a simple document (this will create a connection)
    const testDoc = doc(db, '_connection_test', 'test');
    await getDoc(testDoc);
    
    console.log('✅ Firebase connection test successful');
    return true;
  } catch (error: any) {
    console.error('❌ Firebase connection test failed:', error?.message || error);
    
    // Check if it's a network-related error
    if (error?.message?.includes('Failed to fetch') || 
        error?.message?.includes('NetworkError') ||
        error?.code === 'unavailable') {
      console.warn('🌐 Network connectivity issue detected');
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
