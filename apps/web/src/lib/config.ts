import { getDoc, doc, Firestore } from 'firebase/firestore';
import { isOnline, retryWithBackoff, isNetworkError } from './connectivity';

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
export async function loadTrialConfig(db: Firestore): Promise<TrialConfig> {
  // Return default config immediately if offline
  if (!isOnline()) {
    console.log('Offline: using default trial config');
    return DEFAULT_TRIAL_CONFIG;
  }

  try {
    return await retryWithBackoff(async () => {
      const snap = await getDoc(doc(db, 'config', 'trial'));
      const config = snap.exists() ? snap.data() as TrialConfig : {};

      // Merge with defaults to ensure all properties exist
      return { ...DEFAULT_TRIAL_CONFIG, ...config };
    }, 2, 1000);
  } catch (error) {
    if (isNetworkError(error)) {
      console.warn('Network error loading trial config, using defaults:', error);
    } else {
      console.warn('Failed to load trial config, using defaults:', error);
    }
    return DEFAULT_TRIAL_CONFIG;
  }
}
