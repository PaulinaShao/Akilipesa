import { getDoc, doc, Firestore } from 'firebase/firestore';

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

/**
 * Load trial configuration from public Firestore document
 * Falls back to empty config if read fails
 */
export async function loadTrialConfig(db: Firestore): Promise<TrialConfig> {
  try {
    const snap = await getDoc(doc(db, 'config', 'trial'));
    return (snap.exists() ? snap.data() : {}) as TrialConfig;
  } catch (error) {
    console.warn('Failed to load trial config, using defaults:', error);
    return {};
  }
}
