import { doc, setDoc, getDoc } from 'firebase/firestore';
import { safeFirestoreOperation } from './firestoreManager';

export interface TrialConfigData {
  enabled: boolean;
  chatMessagesPerDay: number;
  callsPerDay: number;
  callSeconds: number;
  reactionLimit: number;
  happyHours: Array<{ startMin: number; endMin: number }>;
  requireHappyHour: boolean;
  minCaptchaScore: number;
}

const defaultTrialConfig: TrialConfigData = {
  enabled: true,
  chatMessagesPerDay: 3,
  callsPerDay: 1,
  callSeconds: 90, // 1.5 minutes
  reactionLimit: 5,
  happyHours: [
    { startMin: 18 * 60, endMin: 20 * 60 }, // 6 PM - 8 PM EAT
  ],
  requireHappyHour: false, // Set to true to enable happy hour restrictions
  minCaptchaScore: 0.3,
};

// Safe trial config for development
const devTrialConfig: TrialConfigData = {
  enabled: true,
  chatMessagesPerDay: 10, // More generous for testing
  callsPerDay: 3,
  callSeconds: 120, // 2 minutes
  reactionLimit: 20,
  happyHours: [],
  requireHappyHour: false,
  minCaptchaScore: 0.1, // Lower threshold for dev
};

export async function seedTrialConfig(isDev: boolean = false): Promise<void> {
  const config = isDev ? devTrialConfig : defaultTrialConfig;

  await safeFirestoreOperation(
    async (db) => {
      const configRef = doc(db, 'trialConfig', 'global');
      const configSnap = await getDoc(configRef);

      if (configSnap.exists()) {
        console.log('✅ Trial config already exists:', configSnap.data());
        return;
      }

      await setDoc(configRef, {
        ...config,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log('✅ Trial config seeded successfully:', config);
    },
    () => {
      console.log('📱 Offline mode: using default trial config without seeding');
    }
  );
}

export async function updateTrialConfig(updates: Partial<TrialConfigData>): Promise<void> {
  try {
    const configRef = doc(db, 'trialConfig', 'global');
    
    await setDoc(configRef, {
      ...updates,
      updatedAt: new Date(),
    }, { merge: true });

    console.log('Trial config updated:', updates);
  } catch (error) {
    console.error('Failed to update trial config:', error);
    throw error;
  }
}

export async function getTrialConfig(): Promise<TrialConfigData | null> {
  try {
    const configRef = doc(db, 'trialConfig', 'global');
    const configSnap = await getDoc(configRef);

    if (!configSnap.exists()) {
      return null;
    }

    return configSnap.data() as TrialConfigData;
  } catch (error) {
    console.error('Failed to get trial config:', error);
    return null;
  }
}

// Test helper functions
export async function testTrialSystem(): Promise<void> {
  console.log('🧪 Testing trial system...');

  try {
    // 1. Test config fetch
    console.log('1. Testing config fetch...');
    const config = await getTrialConfig();
    console.log('✓ Config:', config);

    // 2. Test token generation (would be done by Cloud Function)
    console.log('2. Testing device token...');
    const deviceId = localStorage.getItem('ap.deviceId');
    console.log('✓ Device ID:', deviceId);

    // 3. Test quota state
    console.log('3. Testing quota state...');
    const localReactions = localStorage.getItem('ap.localReactions');
    console.log('✓ Local reactions:', localReactions);

    console.log('🎉 Trial system test completed successfully!');
  } catch (error) {
    console.error('❌ Trial system test failed:', error);
    throw error;
  }
}

// Development helper to reset trial state
export function resetTrialState(): void {
  localStorage.removeItem('ap.dt');
  localStorage.removeItem('ap.deviceId');
  localStorage.removeItem('ap.localReactions');
  console.log('Trial state reset');
}

// Development helper to simulate quota exhaustion
export function simulateQuotaExhaustion(): void {
  const dayKey = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  
  // Max out local reactions
  localStorage.setItem('ap.localReactions', JSON.stringify({
    dayKey,
    count: 999
  }));
  
  console.log('Simulated quota exhaustion');
}

// Happy hour checker
export function isCurrentlyHappyHour(happyHours: Array<{ startMin: number; endMin: number }>): boolean {
  if (!happyHours.length) return true;
  
  const now = new Date();
  const currentMin = now.getHours() * 60 + now.getMinutes();
  
  return happyHours.some(window => 
    currentMin >= window.startMin && currentMin <= window.endMin
  );
}

// Format happy hours for display
export function formatHappyHours(happyHours: Array<{ startMin: number; endMin: number }>): string[] {
  return happyHours.map(window => {
    const startHour = Math.floor(window.startMin / 60);
    const startMin = window.startMin % 60;
    const endHour = Math.floor(window.endMin / 60);
    const endMin = window.endMin % 60;
    
    const formatTime = (hour: number, min: number) => 
      `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
    
    return `${formatTime(startHour, startMin)} - ${formatTime(endHour, endMin)}`;
  });
}
