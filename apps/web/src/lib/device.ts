/**
 * Device fingerprinting and trial token management
 */

import { debugLog } from './debug';

/**
 * Generate a device fingerprint for trial tracking
 */
export function generateDeviceFingerprint(): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx?.fillText('AkiliPesa', 10, 10);
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    canvas.toDataURL().slice(-50), // Last 50 chars of canvas fingerprint
    navigator.hardwareConcurrency || 0,
    navigator.deviceMemory || 0,
  ].join('|');
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36);
}

/**
 * Get or create device token for trial tracking
 */
export async function getDeviceToken(): Promise<string> {
  // Check localStorage first
  let deviceToken = localStorage.getItem('ap.dt');
  
  if (deviceToken) {
    // Validate token age (rotate every 24h)
    const tokenData = localStorage.getItem('ap.dt.meta');
    if (tokenData) {
      try {
        const meta = JSON.parse(tokenData);
        const age = Date.now() - meta.created;
        if (age > 24 * 60 * 60 * 1000) { // 24 hours
          debugLog.log('Device token expired, requesting new one');
          deviceToken = null;
        }
      } catch (error) {
        debugLog.warn('Invalid token metadata:', error);
        deviceToken = null;
      }
    }
  }
  
  if (!deviceToken) {
    // Request new token from server
    deviceToken = await requestNewDeviceToken();
  }
  
  return deviceToken;
}

/**
 * Request new device token from Cloud Functions
 */
async function requestNewDeviceToken(): Promise<string> {
  try {
    const deviceHint = generateDeviceFingerprint();
    
    // Call Cloud Function to issue trial token
    const { issueTrialToken } = await import('../modules/api');
    const result = await issueTrialToken({ deviceHint });
    
    if (result?.deviceToken) {
      // Store token and metadata
      localStorage.setItem('ap.dt', result.deviceToken);
      localStorage.setItem('ap.dt.meta', JSON.stringify({
        created: Date.now(),
        fingerprint: deviceHint
      }));
      
      debugLog.log('New device token issued:', result.deviceToken.slice(0, 20) + '...');
      return result.deviceToken;
    }
    
    throw new Error('Invalid token response');
    
  } catch (error) {
    debugLog.error('Failed to get device token:', error);
    
    // Fallback to local-only token for offline mode
    const fallbackToken = `local_${generateDeviceFingerprint()}_${Date.now()}`;
    localStorage.setItem('ap.dt', fallbackToken);
    localStorage.setItem('ap.dt.meta', JSON.stringify({
      created: Date.now(),
      fallback: true
    }));
    
    return fallbackToken;
  }
}

/**
 * Clear device token (for testing or reset)
 */
export function clearDeviceToken(): void {
  localStorage.removeItem('ap.dt');
  localStorage.removeItem('ap.dt.meta');
  debugLog.log('Device token cleared');
}

/**
 * Check if current time is within happy hours
 */
export function isHappyHour(happyHours?: Array<{ startMin: number; endMin: number }>): boolean {
  if (!happyHours || happyHours.length === 0) return true;
  
  const now = new Date();
  const currentMin = now.getHours() * 60 + now.getMinutes();
  
  return happyHours.some(period => 
    currentMin >= period.startMin && currentMin <= period.endMin
  );
}

/**
 * Calculate time until next happy hour
 */
export function timeUntilHappyHour(happyHours?: Array<{ startMin: number; endMin: number }>): number {
  if (!happyHours || happyHours.length === 0) return 0;
  
  const now = new Date();
  const currentMin = now.getHours() * 60 + now.getMinutes();
  
  // Find next happy hour
  const sortedHours = [...happyHours].sort((a, b) => a.startMin - b.startMin);
  
  for (const period of sortedHours) {
    if (currentMin < period.startMin) {
      return (period.startMin - currentMin) * 60 * 1000; // Return in milliseconds
    }
  }
  
  // Next happy hour is tomorrow
  const firstPeriod = sortedHours[0];
  const minutesUntilMidnight = (24 * 60) - currentMin;
  return (minutesUntilMidnight + firstPeriod.startMin) * 60 * 1000;
}
