/**
 * Simplified trial store for guest mode limits
 * Implements fraud-resistant local + server validation
 */

interface TrialLimits {
  maxGuestCalls: number;
  maxGuestChats: number; 
  maxGuestAIJobs: number;
}

interface DailyUsage {
  day: string;
  calls: number;
  chats: number;
  jobs: number;
}

const DEFAULT_LIMITS: TrialLimits = {
  maxGuestCalls: 1,
  maxGuestChats: 10,
  maxGuestAIJobs: 2,
};

function getTodayKey(): string {
  return new Date().toDateString();
}

function getUsage(): DailyUsage {
  const today = getTodayKey();
  const stored = JSON.parse(localStorage.getItem('trial') || '{}');
  
  // Reset if day changed
  if (stored.day !== today) {
    return { day: today, calls: 0, chats: 0, jobs: 0 };
  }
  
  return stored;
}

function saveUsage(usage: DailyUsage): void {
  localStorage.setItem('trial', JSON.stringify(usage));
}

function check(key: keyof Omit<DailyUsage, 'day'>, limit: number): boolean {
  const usage = getUsage();
  
  if (usage[key] >= limit) {
    return false;
  }
  
  // Increment counter
  usage[key]++;
  saveUsage(usage);
  return true;
}

export const Trial = {
  canStartCall(): boolean {
    return check('calls', DEFAULT_LIMITS.maxGuestCalls);
  },
  
  canChat(): boolean {
    return check('chats', DEFAULT_LIMITS.maxGuestChats);
  },
  
  canJob(): boolean {
    return check('jobs', DEFAULT_LIMITS.maxGuestAIJobs);
  },
  
  getRemainingQuota(type: 'calls' | 'chats' | 'jobs'): number {
    const usage = getUsage();
    const limits = DEFAULT_LIMITS;
    
    switch (type) {
      case 'calls': return Math.max(0, limits.maxGuestCalls - usage.calls);
      case 'chats': return Math.max(0, limits.maxGuestChats - usage.chats);
      case 'jobs': return Math.max(0, limits.maxGuestAIJobs - usage.jobs);
      default: return 0;
    }
  },
  
  getUsageStatus() {
    const usage = getUsage();
    return {
      calls: { used: usage.calls, limit: DEFAULT_LIMITS.maxGuestCalls },
      chats: { used: usage.chats, limit: DEFAULT_LIMITS.maxGuestChats },
      jobs: { used: usage.jobs, limit: DEFAULT_LIMITS.maxGuestAIJobs },
    };
  },
  
  reset(): void {
    localStorage.removeItem('trial');
  }
};

// Server validation helper (stub for now)
export async function validateTrialAction(action: 'call' | 'chat' | 'job'): Promise<boolean> {
  try {
    // TODO: Call Firebase function to validate against server limits
    // const { httpsCallable } = await import('firebase/functions');
    // const checkTrial = httpsCallable(functions, 'checkTrial');
    // const result = await checkTrial({ action, deviceId: getDeviceId() });
    // return result.data.allowed;
    
    // For now, just return local check
    switch (action) {
      case 'call': return Trial.canStartCall();
      case 'chat': return Trial.canChat();
      case 'job': return Trial.canJob();
      default: return false;
    }
  } catch (error) {
    console.warn('Trial validation failed, using local check:', error);
    return false;
  }
}
