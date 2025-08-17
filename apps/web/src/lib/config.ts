import { getDoc, doc } from 'firebase/firestore';
import { safeFirestoreOperation } from './firestoreManager';

export type TrialConfig = {
  uiShowIncomingDemo?: boolean;
  callsEnabled?: boolean;
  guestLikes?: number;
  chatMessagesPerDay?: number;
  callsPerDay?: number;
  callSeconds?: number;
  reactionLimit?: number;
  enabled?: boolean;
  requireHappyHour?: boolean;
  minCaptchaScore?: number;
};

// Default configuration for offline mode
const DEFAULT_TRIAL_CONFIG: TrialConfig = {
  enabled: true,
  callsEnabled: true,
  chatMessagesPerDay: 3,
  callsPerDay: 1,
  callSeconds: 90,
  reactionLimit: 5,
  guestLikes: 5,
  requireHappyHour: false,
  minCaptchaScore: 0.3,
  uiShowIncomingDemo: true
};

/**
 * Load trial configuration from public Firestore document
 * Falls back to default config if read fails or offline
 */
export async function loadTrialConfig(): Promise<TrialConfig> {
  return safeFirestoreOperation(
    async (db) => {
      const snap = await getDoc(doc(db, 'config', 'trial'));
      const config = snap.exists() ? snap.data() as TrialConfig : {};

      // Merge with defaults to ensure all properties exist
      const mergedConfig = { ...DEFAULT_TRIAL_CONFIG, ...config };
      console.log('✅ Trial config loaded from Firestore:', mergedConfig);
      return mergedConfig;
    },
    () => {
      console.log('📱 Using default trial config (fallback)');
      return DEFAULT_TRIAL_CONFIG;
    }
  );
}
