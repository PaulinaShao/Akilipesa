import { create } from 'zustand';
import { debugLog } from '../lib/debug';
import { getDeviceToken, isHappyHour, timeUntilHappyHour } from '../lib/device';

export interface TrialConfig {
  enabled: boolean;
  chatMessagesPerDay: number;
  callsPerDay: number;
  callSeconds: number;
  reactionLimit: number;
  happyHours: Array<{ startMin: number; endMin: number }>;
  requireHappyHour: boolean;
  version: number;
}

export interface TrialUsage {
  dayKey: string;
  chatUsed: number;
  callsUsed: number;
  secondsUsed: number;
  reactionsUsed: number;
  localReactions: string[]; // Stored locally until signup
  lastUpdated: number;
}

export interface TrialStore {
  // Core state
  deviceToken: string | null;
  config: TrialConfig | null;
  usage: TrialUsage | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  
  // Happy hour state
  isHappyHour: boolean;
  nextHappyHour: number;
  
  // Actions
  initializeToken: () => Promise<void>;
  fetchConfig: () => Promise<void>;
  fetchUsage: () => Promise<void>;
  
  // Feature checks
  canUseFeature: (feature: 'chat' | 'call' | 'reaction') => boolean;
  getRemainingQuota: (feature: 'chat' | 'call' | 'reaction') => number;
  
  // Usage tracking
  useChat: () => Promise<boolean>;
  useCall: (targetId: string) => Promise<{ success: boolean; rtcToken?: string; channel?: string; ttl?: number }>;
  useReaction: (itemId: string) => boolean;
  
  // Utilities
  reset: () => void;
  isQuotaExhausted: () => boolean;
  getTrialProgress: () => { chat: number; calls: number; reactions: number };
}

const DEFAULT_CONFIG: TrialConfig = {
  enabled: true,
  chatMessagesPerDay: 5,
  callsPerDay: 2,
  callSeconds: 90,
  reactionLimit: 10,
  happyHours: [
    { startMin: 18 * 60, endMin: 20 * 60 } // 6-8 PM
  ],
  requireHappyHour: false,
  version: 1
};

const createEmptyUsage = (): TrialUsage => ({
  dayKey: new Date().toISOString().slice(0, 10).replace(/-/g, ''),
  chatUsed: 0,
  callsUsed: 0,
  secondsUsed: 0,
  reactionsUsed: 0,
  localReactions: [],
  lastUpdated: Date.now()
});

export const useTrialStore = create<TrialStore>((set, get) => ({
  // Initial state
  deviceToken: null,
  config: null,
  usage: null,
  isLoading: false,
  isInitialized: false,
  error: null,
  isHappyHour: true,
  nextHappyHour: 0,

  // Initialize device token
  initializeToken: async () => {
    try {
      set({ isLoading: true, error: null });
      const token = await getDeviceToken();
      set({ deviceToken: token });
      debugLog.log('Trial token initialized:', token.slice(0, 20) + '...');
    } catch (error: any) {
      debugLog.error('Failed to initialize trial token:', error);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch trial configuration
  fetchConfig: async () => {
    try {
      const { db } = await import('../lib/firebase');
      const { doc, getDoc } = await import('firebase/firestore');

      const configDoc = await getDoc(doc(db, 'trialConfig', 'global'));
      const config = configDoc.exists() ? configDoc.data() as TrialConfig : DEFAULT_CONFIG;

      if (config) {
        set({ config });
        
        // Update happy hour status
        const happyHour = isHappyHour(config.happyHours);
        const nextHappy = timeUntilHappyHour(config.happyHours);
        set({ isHappyHour: happyHour, nextHappyHour: nextHappy });
        
        debugLog.log('Trial config loaded:', config);
      }
    } catch (error: any) {
      debugLog.warn('Failed to fetch trial config:', error);
      set({ config: DEFAULT_CONFIG, error: null }); // Always provide a working config
    }
  },

  // Fetch usage data
  fetchUsage: async () => {
    try {
      const { deviceToken } = get();
      if (!deviceToken) return;

      const { db } = await import('../lib/firebase');
      const { doc, getDoc } = await import('firebase/firestore');

      const usageDoc = await getDoc(doc(db, 'trials', deviceToken));
      const usage = usageDoc.exists() ? usageDoc.data() : null;

      if (usage) {
        // Check if day has changed
        const currentDay = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        if (usage.dayKey !== currentDay) {
          // Reset daily counters but keep local reactions
          const resetUsage: TrialUsage = {
            ...createEmptyUsage(),
            localReactions: usage.localReactions || []
          };
          set({ usage: resetUsage });
        } else {
          set({ usage: usage as TrialUsage });
        }
      } else {
        // Create new usage record
        set({ usage: createEmptyUsage() });
      }
    } catch (error: any) {
      debugLog.warn('Failed to fetch trial usage:', error);
      // Always provide usage data, even if fetch fails
      set({ usage: createEmptyUsage() });
    }
  },

  // Check if feature can be used
  canUseFeature: (feature: 'chat' | 'call' | 'reaction') => {
    const { config, usage, isHappyHour: happyHour } = get();
    
    if (!config || !usage) return false;
    if (!config.enabled) return false;
    if (config.requireHappyHour && !happyHour) return false;

    switch (feature) {
      case 'chat':
        return usage.chatUsed < config.chatMessagesPerDay;
      case 'call':
        return usage.callsUsed < config.callsPerDay;
      case 'reaction':
        return usage.reactionsUsed < config.reactionLimit;
      default:
        return false;
    }
  },

  // Get remaining quota for feature
  getRemainingQuota: (feature: 'chat' | 'call' | 'reaction') => {
    const { config, usage } = get();
    
    if (!config || !usage) return 0;

    switch (feature) {
      case 'chat':
        return Math.max(0, config.chatMessagesPerDay - usage.chatUsed);
      case 'call':
        return Math.max(0, config.callsPerDay - usage.callsUsed);
      case 'reaction':
        return Math.max(0, config.reactionLimit - usage.reactionsUsed);
      default:
        return 0;
    }
  },

  // Use chat feature
  useChat: async () => {
    const { deviceToken, canUseFeature } = get();

    if (!canUseFeature('chat')) {
      debugLog.warn('Chat quota exhausted');
      return false;
    }

    try {
      // Call Cloud Function
      const { guestChat } = await import('../modules/api');
      await guestChat({ deviceToken: deviceToken!, text: 'ping' }); // Will increment server counter
      
      // Update local state
      set(state => ({
        usage: state.usage ? {
          ...state.usage,
          chatUsed: state.usage.chatUsed + 1,
          lastUpdated: Date.now()
        } : null
      }));
      
      return true;
    } catch (error: any) {
      debugLog.error('Chat usage failed:', error);
      
      // If quota exhausted on server, update local state
      if (error.code === 'resource-exhausted') {
        set(state => ({
          usage: state.usage ? {
            ...state.usage,
            chatUsed: state.config?.chatMessagesPerDay || 999
          } : null
        }));
      }
      
      return false;
    }
  },

  // Use call feature
  useCall: async (targetId: string) => {
    const { deviceToken, canUseFeature } = get();

    if (!canUseFeature('call')) {
      debugLog.warn('Call quota exhausted');
      return { success: false };
    }

    try {
      // Call Cloud Function
      const { requestGuestCall } = await import('../modules/api');
      const result = await requestGuestCall({ deviceToken: deviceToken!, targetId });
      
      // Update local state
      set(state => ({
        usage: state.usage ? {
          ...state.usage,
          callsUsed: state.usage.callsUsed + 1,
          lastUpdated: Date.now()
        } : null
      }));
      
      return { success: true, ...result };
    } catch (error: any) {
      debugLog.error('Call usage failed:', error);
      
      // If quota exhausted on server, update local state
      if (error.code === 'resource-exhausted') {
        set(state => ({
          usage: state.usage ? {
            ...state.usage,
            callsUsed: state.config?.callsPerDay || 999
          } : null
        }));
      }
      
      return { success: false };
    }
  },

  // Use reaction feature (local only until signup)
  useReaction: (itemId: string) => {
    const { canUseFeature } = get();
    
    if (!canUseFeature('reaction')) {
      debugLog.warn('Reaction quota exhausted');
      return false;
    }

    set(state => ({
      usage: state.usage ? {
        ...state.usage,
        reactionsUsed: state.usage.reactionsUsed + 1,
        localReactions: [...state.usage.localReactions, itemId],
        lastUpdated: Date.now()
      } : null
    }));

    // Store locally
    const reactions = JSON.parse(localStorage.getItem('ap.localReactions') || '[]');
    reactions.push({ itemId, timestamp: Date.now() });
    localStorage.setItem('ap.localReactions', JSON.stringify(reactions));

    debugLog.log('Reaction added locally:', itemId);
    return true;
  },

  // Check if any quota is exhausted
  isQuotaExhausted: () => {
    const { canUseFeature } = get();
    return !canUseFeature('chat') && !canUseFeature('call') && !canUseFeature('reaction');
  },

  // Get trial progress (0-1)
  getTrialProgress: () => {
    const { config, usage } = get();
    
    if (!config || !usage) return { chat: 0, calls: 0, reactions: 0 };

    return {
      chat: usage.chatUsed / config.chatMessagesPerDay,
      calls: usage.callsUsed / config.callsPerDay,
      reactions: usage.reactionsUsed / config.reactionLimit
    };
  },

  // Reset trial state
  reset: () => {
    localStorage.removeItem('ap.dt');
    localStorage.removeItem('ap.dt.meta');
    localStorage.removeItem('ap.localReactions');
    set({
      deviceToken: null,
      config: null,
      usage: null,
      isLoading: false,
      error: null
    });
  }
}));

// Initialize trial system on module load (with delay to avoid conflicts with App.tsx)
if (typeof window !== 'undefined') {
  // Delay initialization to let App.tsx handle auth and primary config loading first
  setTimeout(() => {
    const store = useTrialStore.getState();

    // Only auto-initialize if not already initialized
    if (!store.isInitialized && !store.isLoading) {
      Promise.all([
        store.initializeToken(),
        store.fetchConfig()
      ]).then(() => {
        store.fetchUsage();
      }).catch(error => {
        debugLog.warn('Trial system initialization failed (will retry later):', error);
      });
    }
  }, 1000); // 1 second delay
}
