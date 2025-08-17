import { 
  getFirestore, 
  enableNetwork, 
  disableNetwork, 
  connectFirestoreEmulator,
  initializeFirestore,
  CACHE_SIZE_UNLIMITED 
} from 'firebase/firestore';
import { app } from './firebase';
import { isOnline, waitForOnline } from './connectivity';

// Connection state management
let firestoreInstance: ReturnType<typeof getFirestore> | null = null;
let connectionAttempts = 0;
let lastConnectionError: Error | null = null;
let isConnecting = false;

// Maximum connection attempts before falling back to offline mode
const MAX_CONNECTION_ATTEMPTS = 3;
const CONNECTION_TIMEOUT = 10000; // 10 seconds

/**
 * Get a properly configured Firestore instance with error handling
 */
export async function getFirestoreInstance() {
  if (firestoreInstance) {
    return firestoreInstance;
  }

  try {
    // Initialize Firestore with optimized settings
    firestoreInstance = initializeFirestore(app, {
      // Use memory cache only to avoid IndexedDB issues
      localCache: { 
        kind: 'memory',
        garbageCollector: 'lru',
        cacheSize: CACHE_SIZE_UNLIMITED
      },
      // Set connection timeout
      experimentalForceLongPolling: true, // Helps with proxy environments
    });

    // Test connection with timeout
    await testFirestoreConnection(firestoreInstance);
    
    console.log('✅ Firestore connection established');
    connectionAttempts = 0;
    lastConnectionError = null;
    
    return firestoreInstance;
  } catch (error) {
    console.warn('⚠️ Firestore initialization failed:', error);
    lastConnectionError = error as Error;
    connectionAttempts++;
    
    // Fall back to basic getFirestore if custom initialization fails
    try {
      firestoreInstance = getFirestore(app);
      return firestoreInstance;
    } catch (fallbackError) {
      console.error('❌ Firestore fallback also failed:', fallbackError);
      throw fallbackError;
    }
  }
}

/**
 * Test Firestore connection with timeout
 */
async function testFirestoreConnection(db: ReturnType<typeof getFirestore>): Promise<void> {
  return Promise.race([
    // Try to enable network (this will fail if connection is bad)
    enableNetwork(db).then(() => {
      console.log('Firestore network enabled successfully');
    }),
    // Timeout after 10 seconds
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Firestore connection timeout')), CONNECTION_TIMEOUT)
    )
  ]);
}

/**
 * Safely execute Firestore operations with retry logic
 */
export async function safeFirestoreOperation<T>(
  operation: (db: ReturnType<typeof getFirestore>) => Promise<T>,
  fallback?: () => T
): Promise<T> {
  // Check if we're online first
  if (!isOnline()) {
    console.log('📱 Offline mode - using fallback');
    if (fallback) return fallback();
    throw new Error('Offline and no fallback provided');
  }

  // If we've had too many connection failures, use fallback
  if (connectionAttempts >= MAX_CONNECTION_ATTEMPTS && fallback) {
    console.log('🔄 Too many connection failures, using fallback');
    return fallback();
  }

  try {
    const db = await getFirestoreInstance();
    return await operation(db);
  } catch (error) {
    const err = error as Error;
    console.warn('Firestore operation failed:', err.message);
    
    // Track connection failures
    if (isNetworkError(err)) {
      connectionAttempts++;
      lastConnectionError = err;
      
      // Wait for network if we're offline
      if (!isOnline()) {
        console.log('🌐 Waiting for network connection...');
        const online = await waitForOnline(5000);
        
        if (online && connectionAttempts < MAX_CONNECTION_ATTEMPTS) {
          console.log('🔄 Network restored, retrying operation...');
          return safeFirestoreOperation(operation, fallback);
        }
      }
    }
    
    // Use fallback if available
    if (fallback) {
      console.log('🔄 Using fallback for failed operation');
      return fallback();
    }
    
    throw err;
  }
}

/**
 * Reset connection state (useful after network recovery)
 */
export function resetFirestoreConnection() {
  connectionAttempts = 0;
  lastConnectionError = null;
  isConnecting = false;
  console.log('🔄 Firestore connection state reset');
}

/**
 * Get connection diagnostics
 */
export function getConnectionStatus() {
  return {
    isConnected: !!firestoreInstance && connectionAttempts === 0,
    connectionAttempts,
    lastError: lastConnectionError?.message,
    isOnline: isOnline(),
    maxAttemptsReached: connectionAttempts >= MAX_CONNECTION_ATTEMPTS
  };
}

/**
 * Check if error is network-related
 */
function isNetworkError(error: Error): boolean {
  const message = error.message.toLowerCase();
  return (
    message.includes('failed to fetch') ||
    message.includes('network') ||
    message.includes('timeout') ||
    message.includes('unavailable') ||
    message.includes('connection') ||
    error.name === 'NetworkError'
  );
}

/**
 * Force enable Firestore network (useful for recovery)
 */
export async function forceEnableFirestore() {
  try {
    const db = await getFirestoreInstance();
    await enableNetwork(db);
    resetFirestoreConnection();
    console.log('✅ Firestore network force-enabled');
  } catch (error) {
    console.warn('⚠️ Failed to force-enable Firestore:', error);
  }
}

// Listen for online/offline events to manage connection
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('🌐 Network online - attempting Firestore reconnection');
    forceEnableFirestore();
  });

  window.addEventListener('offline', () => {
    console.log('📱 Network offline - Firestore will use cache');
  });
}
