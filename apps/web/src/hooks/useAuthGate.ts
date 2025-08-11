import { useCallback } from 'react';
import { useUIStore } from '../state/uiStore';
import { useAppStore } from '../store';
import { useTrialStore } from '../state/trialStore';

type GatedAction = 'like' | 'comment' | 'follow' | 'share' | 'message' | 'buy' | 'live' | 'call' | 'chat';
type TrialAction = 'reaction' | 'call' | 'chat';

interface UseAuthGateReturn {
  requireAuth: (action: () => void, actionType: GatedAction) => void;
  requireAuthOrTrial: (action: () => Promise<void> | void, actionType: GatedAction) => Promise<void>;
  isAuthenticated: boolean;
}

interface UseTrialGateReturn {
  tryWithTrial: (action: () => Promise<void> | void, trialType: TrialAction) => Promise<boolean>;
  canUseTrial: (trialType: TrialAction) => boolean;
  showTrialPaywall: (trialType: TrialAction) => void;
}

export function useAuthGate(): UseAuthGateReturn {
  const { user } = useAppStore();
  const { openAuthSheet } = useUIStore();

  const requireAuth = useCallback((action: () => void, actionType: GatedAction) => {
    if (user) {
      // User is authenticated, execute action immediately
      action();
    } else {
      // User is not authenticated, open auth sheet with pending action
      openAuthSheet(action, actionType);
    }
  }, [user, openAuthSheet]);

  const requireAuthOrTrial = useCallback(async (action: () => Promise<void> | void, actionType: GatedAction) => {
    if (user) {
      // User is authenticated, execute action immediately
      await action();
    } else {
      // User is not authenticated, open auth sheet with pending action
      openAuthSheet(action, actionType);
    }
  }, [user, openAuthSheet]);

  return {
    requireAuth,
    requireAuthOrTrial,
    isAuthenticated: !!user,
  };
}

export function useTrialGate(): UseTrialGateReturn {
  const { canUseFeature, incrementLocalReactions } = useTrialStore();
  const { setTrialPaywall } = useUIStore();

  const canUseTrial = useCallback((trialType: TrialAction) => {
    return canUseFeature(trialType === 'reaction' ? 'reaction' : trialType);
  }, [canUseFeature]);

  const showTrialPaywall = useCallback((trialType: TrialAction) => {
    setTrialPaywall({ isOpen: true, feature: trialType });
  }, [setTrialPaywall]);

  const tryWithTrial = useCallback(async (action: () => Promise<void> | void, trialType: TrialAction): Promise<boolean> => {
    if (!canUseTrial(trialType)) {
      showTrialPaywall(trialType);
      return false;
    }

    try {
      // Execute the action
      await action();

      // If it's a reaction, increment local counter
      if (trialType === 'reaction') {
        incrementLocalReactions();
      }

      return true;
    } catch (error) {
      console.error(`Trial ${trialType} action failed:`, error);
      
      // Check if it's a quota exceeded error
      if (error instanceof Error && error.message.includes('quota')) {
        showTrialPaywall(trialType);
      }
      
      return false;
    }
  }, [canUseTrial, incrementLocalReactions, showTrialPaywall]);

  return {
    tryWithTrial,
    canUseTrial,
    showTrialPaywall,
  };
}

// Combined hook for seamless auth + trial experience
export function useGatedAction() {
  const { user } = useAuthStore();
  const { openAuthSheet } = useUIStore();
  const { tryWithTrial } = useTrialGate();

  const executeGatedAction = useCallback(async (
    action: () => Promise<void> | void,
    actionType: GatedAction,
    allowTrial: boolean = false,
    trialType?: TrialAction
  ) => {
    if (user) {
      // Authenticated user - execute immediately
      await action();
      return;
    }

    if (allowTrial && trialType) {
      // Try with trial first
      const success = await tryWithTrial(action, trialType);
      if (!success) {
        // Trial failed/exhausted - this will show paywall
        return;
      }
    } else {
      // No trial allowed - require auth
      openAuthSheet(action, actionType);
    }
  }, [user, openAuthSheet, tryWithTrial]);

  return executeGatedAction;
}

// Helper hooks for specific actions with trial support
export function useGatedLike() {
  const executeGatedAction = useGatedAction();
  
  return useCallback((likeAction: () => void) => {
    executeGatedAction(likeAction, 'like', true, 'reaction');
  }, [executeGatedAction]);
}

export function useGatedComment() {
  const { requireAuth } = useAuthGate();
  
  return useCallback((commentAction: () => void) => {
    requireAuth(commentAction, 'comment');
  }, [requireAuth]);
}

export function useGatedFollow() {
  const { requireAuth } = useAuthGate();
  
  return useCallback((followAction: () => void) => {
    requireAuth(followAction, 'follow');
  }, [requireAuth]);
}

export function useGatedShare() {
  const { requireAuth } = useAuthGate();
  
  return useCallback((shareAction: () => void) => {
    requireAuth(shareAction, 'share');
  }, [requireAuth]);
}

export function useGatedMessage() {
  const { requireAuth } = useAuthGate();
  
  return useCallback((messageAction: () => void) => {
    requireAuth(messageAction, 'message');
  }, [requireAuth]);
}

export function useGatedBuy() {
  const { requireAuth } = useAuthGate();
  
  return useCallback((buyAction: () => void) => {
    requireAuth(buyAction, 'buy');
  }, [requireAuth]);
}

export function useGatedLive() {
  const { requireAuth } = useAuthGate();
  
  return useCallback((liveAction: () => void) => {
    requireAuth(liveAction, 'live');
  }, [requireAuth]);
}

// Trial-specific hooks
export function useGatedCall() {
  const executeGatedAction = useGatedAction();
  
  return useCallback(async (callAction: () => Promise<void>) => {
    await executeGatedAction(callAction, 'call', true, 'call');
  }, [executeGatedAction]);
}

export function useGatedChat() {
  const executeGatedAction = useGatedAction();
  
  return useCallback(async (chatAction: () => Promise<void>) => {
    await executeGatedAction(chatAction, 'chat', true, 'chat');
  }, [executeGatedAction]);
}
