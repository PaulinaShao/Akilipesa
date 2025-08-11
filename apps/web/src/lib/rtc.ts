import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';
import { getDeviceToken } from './device';

export interface RTCToken {
  token: string;
  channelName: string;
  uid: number;
  expiryTime: number;
  maxDuration: number;
}

export interface CallConfig {
  video: boolean;
  audio: boolean;
  maxDuration?: number;
  isTrialCall?: boolean;
}

// Request a guest trial call token
export async function requestTrialCall(targetId: string, config: CallConfig = { video: true, audio: true }): Promise<RTCToken> {
  const deviceToken = getDeviceToken();
  
  if (!deviceToken) {
    throw new Error('No trial token available. Please refresh the page.');
  }

  const requestGuestCall = httpsCallable(functions, 'requestGuestCall');
  
  try {
    const result = await requestGuestCall({
      deviceToken,
      targetId,
      config,
    });

    return result.data as RTCToken;
  } catch (error: any) {
    console.error('Failed to request trial call:', error);
    
    if (error.code === 'functions/resource-exhausted') {
      throw new Error('Daily call quota exceeded. Sign up for unlimited calls!');
    } else if (error.code === 'functions/failed-precondition') {
      throw new Error('Trial calls are only available during happy hours or trials are disabled.');
    } else if (error.code === 'functions/permission-denied') {
      throw new Error('Security verification failed. Please try again.');
    }
    
    throw new Error('Failed to start call. Please try again.');
  }
}

// Request authenticated user call token (unlimited)
export async function requestAuthenticatedCall(targetId: string, _config: CallConfig = { video: true, audio: true }): Promise<RTCToken> {
  // This would call a different function for authenticated users
  // For now, return a mock response
  return {
    token: 'auth_rtc_token',
    channelName: `auth_${targetId}_${Date.now()}`,
    uid: Math.floor(Math.random() * 100000),
    expiryTime: Date.now() + (4 * 60 * 60 * 1000), // 4 hours
    maxDuration: 4 * 60 * 60, // 4 hours in seconds
  };
}

// Initialize RTC engine (mock implementation - replace with actual RTC SDK)
export class RTCEngine {
  private channel: string | null = null;
  private uid: number | null = null;
  private maxDuration: number = 0;
  private startTime: number = 0;
  private durationTimer: number | null = null;
  private onCallEnd?: () => void;

  async join(rtcToken: RTCToken, onCallEnd?: () => void): Promise<void> {
    this.channel = rtcToken.channelName;
    this.uid = rtcToken.uid;
    this.maxDuration = rtcToken.maxDuration;
    this.startTime = Date.now();
    this.onCallEnd = onCallEnd;

    console.log('Joining RTC channel:', {
      channel: this.channel,
      uid: this.uid,
      maxDuration: this.maxDuration,
    });

    // Start duration timer for trial calls
    if (this.maxDuration > 0) {
      this.durationTimer = window.setTimeout(() => {
        console.log('Trial call duration limit reached');
        this.leave();
        this.onCallEnd?.();
      }, this.maxDuration * 1000);
    }

    // Mock successful join
    return Promise.resolve();
  }

  async leave(): Promise<void> {
    console.log('Leaving RTC channel:', this.channel);
    
    if (this.durationTimer) {
      window.clearTimeout(this.durationTimer);
      this.durationTimer = null;
    }

    this.channel = null;
    this.uid = null;
    this.maxDuration = 0;
    this.startTime = 0;
    this.onCallEnd = undefined;

    return Promise.resolve();
  }

  getCallDuration(): number {
    if (this.startTime === 0) return 0;
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  getRemainingTime(): number {
    if (this.maxDuration === 0) return Infinity;
    const elapsed = this.getCallDuration();
    return Math.max(0, this.maxDuration - elapsed);
  }

  isActive(): boolean {
    return this.channel !== null;
  }
}

// Singleton RTC engine instance
export const rtcEngine = new RTCEngine();

// Utility function to format duration
export function formatDuration(seconds: number): string {
  if (seconds === Infinity) return '∞';
  
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  if (mins > 0) {
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${secs}s`;
}
