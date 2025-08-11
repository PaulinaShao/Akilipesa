import { create } from 'zustand';
import { getDeviceToken, setDeviceToken, getDeviceInfo } from '../lib/device';

export interface TrialConfig {
  enabled: boolean;
  chatMessagesPerDay: number;
  callsPerDay: number;
  callSeconds: number;
  reactionLimit: number;
  happyHours: Array<{ startMin: number; endMin: number }>;
  requireHappyHour: boolean;
}

export interface TrialUsage {
  dayKey: string;
  chatUsed: number;
  callsUsed: number;
  secondsUsed: number;
  reactionsUsed: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TrialState {
  deviceToken: string | null;
  config: TrialConfig | null;
  usage: TrialUsage | null;
  isLoading: boolean;
  isInHappyHour: boolean;

  // Actions
  initializeToken: () => Promise<void>;
  fetchConfig: () => Promise<void>;
  fetchUsage: () => Promise<void>;
  canUseFeature: (feature: 'chat' | 'call' | 'reaction') => boolean;
  getRemainingQuota: (feature: 'chat' | 'call' | 'reaction') => number;
  incrementLocalReactions: () => void;
  updateLocalUsage: (type: 'chat' | 'call' | 'reaction', increment?: number) => void;
  clearToken: () => void;
}

// Firebase functions
async function issueTrialToken(): Promise<string> {
  try {
    const { httpsCallable } = await import('firebase/functions');
    const { functions } = await import('../lib/firebase');

    const issueToken = httpsCallable(functions, 'issueTrialToken');
    const result = await issueToken({
      deviceInfo: getDeviceInfo(),
      timestamp: Date.now()
    });

    return (result.data as any).deviceToken;
  } catch (error) {
    console.warn('Failed to get server token, using local fallback:', error);
    // Generate a local fallback token for offline mode
    return `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

async function fetchTrialConfig(): Promise<TrialConfig> {
  try {
    const { doc, getDoc } = await import('firebase/firestore');
    const { db } = await import('../lib/firebase');

    const configDoc = await getDoc(doc(db, 'trialConfig', 'global'));

    if (!configDoc.exists()) {
      return getDefaultTrialConfig();
    }

    return configDoc.data() as TrialConfig;
  } catch (error) {
    console.warn('Failed to fetch trial config from server, using defaults:', error);
    return getDefaultTrialConfig();
  }
}

function getDefaultTrialConfig(): TrialConfig {
  return {
    enabled: true, // Enable trials by default in offline mode
    chatMessagesPerDay: 3,
    callsPerDay: 1,
    callSeconds: 90,
    reactionLimit: 5,
    happyHours: [],
    requireHappyHour: false,
  };
}

async function fetchTrialUsage(deviceToken: string): Promise<TrialUsage | null> {
  try {
    const { doc, getDoc } = await import('firebase/firestore');
    const { db } = await import('../lib/firebase');

    const usageDoc = await getDoc(doc(db, 'trials', deviceToken));

    if (!usageDoc.exists()) {
      return getLocalTrialUsage();
    }

    const data = usageDoc.data();
    return {
      dayKey: data.dayKey,
      chatUsed: data.chatUsed || 0,
      callsUsed: data.callsUsed || 0,
      secondsUsed: data.secondsUsed || 0,
      reactionsUsed: data.reactionsUsed || 0,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  } catch (error) {
    console.warn('Failed to fetch trial usage from server, using local fallback:', error);
    return getLocalTrialUsage();
  }
}

function getLocalTrialUsage(): TrialUsage {
  const dayKey = getCurrentDayKey();
  const stored = localStorage.getItem('ap.trialUsage');

  try {
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.dayKey === dayKey) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn('Failed to parse stored trial usage:', error);
  }

  // Return fresh usage for today
  const usage = {
    dayKey,
    chatUsed: 0,
    callsUsed: 0,
    secondsUsed: 0,
    reactionsUsed: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  localStorage.setItem('ap.trialUsage', JSON.stringify(usage));
  return usage;
}

function checkHappyHour(config: TrialConfig): boolean {
  if (!config.happyHours.length) return true;
  
  const now = new Date();
  const currentMin = now.getHours() * 60 + now.getMinutes();
  
  return config.happyHours.some(
    window => currentMin >= window.startMin && currentMin <= window.endMin
  );
}

function getCurrentDayKey(): string {
  return new Date().toISOString().slice(0, 10).replace(/-/g, '');
}

// Local storage for reactions (until user signs up)
const LOCAL_REACTIONS_KEY = 'ap.localReactions';

function getLocalReactions(): number {
  try {
    const data = localStorage.getItem(LOCAL_REACTIONS_KEY);
    if (!data) return 0;
    
    const parsed = JSON.parse(data);
    if (parsed.dayKey !== getCurrentDayKey()) {
      localStorage.removeItem(LOCAL_REACTIONS_KEY);
      return 0;
    }
    
    return parsed.count || 0;
  } catch {
    return 0;
  }
}

function setLocalReactions(count: number): void {
  localStorage.setItem(LOCAL_REACTIONS_KEY, JSON.stringify({
    dayKey: getCurrentDayKey(),
    count
  }));
}

export const useTrialStore = create<TrialState>((set, get) => ({
  deviceToken: getDeviceToken(),
  config: null,
  usage: null,
  isLoading: false,
  isInHappyHour: true,

  initializeToken: async () => {
    const existing = getDeviceToken();
    if (existing) {
      set({ deviceToken: existing });
      return;
    }

    set({ isLoading: true });
    try {
      const token = await issueTrialToken();
      setDeviceToken(token);
      set({ deviceToken: token });
    } catch (error) {
      console.error('Failed to initialize trial token:', error);
      // In offline mode, still set a local token
      const fallbackToken = `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setDeviceToken(fallbackToken);
      set({ deviceToken: fallbackToken });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchConfig: async () => {
    try {
      const config = await fetchTrialConfig();
      const isInHappyHour = checkHappyHour(config);
      set({ config, isInHappyHour });
    } catch (error) {
      console.error('Failed to fetch trial config:', error);
    }
  },

  fetchUsage: async () => {
    const { deviceToken } = get();
    if (!deviceToken) return;

    try {
      const usage = await fetchTrialUsage(deviceToken);
      set({ usage });
    } catch (error) {
      console.error('Failed to fetch trial usage:', error);
    }
  },

  canUseFeature: (feature) => {
    const { config, usage, isInHappyHour } = get();
    
    if (!config?.enabled) return false;
    if (config.requireHappyHour && !isInHappyHour) return false;
    if (!usage) return true; // First time use
    
    // Check if usage is from today
    if (usage.dayKey !== getCurrentDayKey()) return true;
    
    switch (feature) {
      case 'chat':
        return usage.chatUsed < config.chatMessagesPerDay;
      case 'call':
        return usage.callsUsed < config.callsPerDay;
      case 'reaction':
        const localReactions = getLocalReactions();
        return (usage.reactionsUsed + localReactions) < config.reactionLimit;
      default:
        return false;
    }
  },

  getRemainingQuota: (feature) => {
    const { config, usage } = get();
    
    if (!config) return 0;
    if (!usage || usage.dayKey !== getCurrentDayKey()) {
      switch (feature) {
        case 'chat': return config.chatMessagesPerDay;
        case 'call': return config.callsPerDay;
        case 'reaction': return config.reactionLimit - getLocalReactions();
        default: return 0;
      }
    }
    
    switch (feature) {
      case 'chat':
        return Math.max(0, config.chatMessagesPerDay - usage.chatUsed);
      case 'call':
        return Math.max(0, config.callsPerDay - usage.callsUsed);
      case 'reaction':
        const localReactions = getLocalReactions();
        return Math.max(0, config.reactionLimit - usage.reactionsUsed - localReactions);
      default:
        return 0;
    }
  },

  incrementLocalReactions: () => {
    const current = getLocalReactions();
    setLocalReactions(current + 1);

    // Also update local usage tracking
    const { updateLocalUsage } = get();
    updateLocalUsage('reaction', 1);
  },

  // Helper method to update local usage when offline
  updateLocalUsage: (type: 'chat' | 'call' | 'reaction', increment: number = 1) => {
    const { usage } = get();
    if (!usage) return;

    const dayKey = getCurrentDayKey();
    let newUsage = { ...usage };

    // Reset if new day
    if (usage.dayKey !== dayKey) {
      newUsage = {
        dayKey,
        chatUsed: 0,
        callsUsed: 0,
        secondsUsed: 0,
        reactionsUsed: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    // Update usage
    switch (type) {
      case 'chat':
        newUsage.chatUsed += increment;
        break;
      case 'call':
        newUsage.callsUsed += increment;
        break;
      case 'reaction':
        newUsage.reactionsUsed += increment;
        break;
    }

    newUsage.updatedAt = new Date();

    // Save to localStorage and state
    localStorage.setItem('ap.trialUsage', JSON.stringify(newUsage));
    set({ usage: newUsage });
  },

  clearToken: () => {
    localStorage.removeItem(LOCAL_REACTIONS_KEY);
    set({ deviceToken: null, usage: null });
  },
}));
