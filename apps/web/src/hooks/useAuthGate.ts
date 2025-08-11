import { useCallback } from 'react';
import { useUIStore } from '@/state/uiStore';
import { useAppStore } from '@/store';

type GatedAction = 'like' | 'comment' | 'follow' | 'share' | 'message' | 'buy' | 'live';

interface UseAuthGateReturn {
  requireAuth: (action: () => void, actionType: GatedAction) => void;
  isAuthenticated: boolean;
}

export function useAuthGate(): UseAuthGateReturn {
  const { isAuthenticated } = useAppStore();
  const { openAuthSheet } = useUIStore();

  const requireAuth = useCallback((action: () => void, actionType: GatedAction) => {
    if (isAuthenticated) {
      // User is authenticated, execute action immediately
      action();
    } else {
      // User is not authenticated, open auth sheet with pending action
      openAuthSheet(action, actionType);
    }
  }, [isAuthenticated, openAuthSheet]);

  return {
    requireAuth,
    isAuthenticated,
  };
}

// Helper hooks for specific actions
export function useGatedLike() {
  const { requireAuth } = useAuthGate();
  
  return useCallback((likeAction: () => void) => {
    requireAuth(likeAction, 'like');
  }, [requireAuth]);
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
