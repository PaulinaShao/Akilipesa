import { useTrialStore } from '../state/trialStore';
import { useUIStore } from '../state/uiStore';
import { useAppStore } from '../store';

/**
 * Hook for gating features behind trial quotas
 */
export function useTrialGate() {
  const { user } = useAppStore();
  const { canUseFeature, useChat, useCall, useReaction } = useTrialStore();
  const { openTrialPaywall, openAuthSheet } = useUIStore();

  /**
   * Check if action can proceed or should be gated
   */
  const checkAndUseFeature = async (
    feature: 'chat' | 'call' | 'reaction',
    action?: () => void | Promise<void>
  ): Promise<boolean> => {
    // Authenticated users have unlimited access
    if (user) {
      if (action) await action();
      return true;
    }

    // Check trial quota
    if (!canUseFeature(feature)) {
      // Quota exhausted - show paywall
      openTrialPaywall(feature);
      return false;
    }

    // Consume quota based on feature
    let success = false;
    switch (feature) {
      case 'chat':
        success = await useChat();
        break;
      case 'call':
        // For calls, we need target ID which should be provided in action
        if (action) {
          await action();
          success = true;
        }
        break;
      case 'reaction':
        if (action) {
          await action();
          success = true;
        }
        break;
    }

    if (!success) {
      // Quota was exhausted on server - show paywall
      openTrialPaywall(feature);
      return false;
    }

    return true;
  };

  /**
   * Gate chat actions
   */
  const gateChat = async (action?: () => void | Promise<void>) => {
    return checkAndUseFeature('chat', action);
  };

  /**
   * Gate call actions
   */
  const gateCall = async (targetId?: string) => {
    if (user) return true;

    if (!canUseFeature('call')) {
      openTrialPaywall('call');
      return false;
    }

    if (targetId) {
      const result = await useCall(targetId);
      if (!result.success) {
        openTrialPaywall('call');
        return false;
      }
      return result;
    }

    return true;
  };

  /**
   * Gate reaction actions (like, save, bookmark)
   */
  const gateReaction = async (itemId?: string, action?: () => void | Promise<void>) => {
    if (user) {
      if (action) await action();
      return true;
    }

    if (!canUseFeature('reaction')) {
      openTrialPaywall('reaction');
      return false;
    }

    if (itemId) {
      const success = useReaction(itemId);
      if (!success) {
        openTrialPaywall('reaction');
        return false;
      }
    }

    if (action) {
      await action();
    }

    return true;
  };

  /**
   * Gate any action that requires authentication
   */
  const gateAuth = (action?: () => void, actionType?: string) => {
    if (user) {
      if (action) action();
      return true;
    }

    // Show auth sheet for non-trial features
    openAuthSheet(action, actionType);
    return false;
  };

  return {
    // Core gating functions
    gateChat,
    gateCall,
    gateReaction,
    gateAuth,
    
    // Utility functions
    checkAndUseFeature,
    canUseFeature: (feature: 'chat' | 'call' | 'reaction') => 
      user ? true : canUseFeature(feature),
    
    // Quick checks
    isAuthenticated: !!user,
    hasTrialQuota: (feature: 'chat' | 'call' | 'reaction') => canUseFeature(feature)
  };
}
