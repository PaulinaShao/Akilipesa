import { create } from 'zustand';

interface AuthSheetState {
  isOpen: boolean;
  step: 'phone' | 'code' | 'success';
  pendingAction?: () => void; // Action to execute after successful auth
  pendingActionType?: 'like' | 'comment' | 'follow' | 'share' | 'message' | 'buy' | 'live';
}

interface TrialPaywallState {
  isOpen: boolean;
  feature?: 'reaction' | 'call' | 'chat';
}

interface UIStore {
  authSheet: AuthSheetState;
  trialPaywall: TrialPaywallState;

  // Auth sheet actions
  openAuthSheet: (action?: () => void, actionType?: string) => void;
  closeAuthSheet: () => void;
  setAuthStep: (step: AuthSheetState['step']) => void;
  executePendingAction: () => void;

  // Trial paywall actions
  isTrialPaywallOpen: boolean;
  openTrialPaywall: (feature?: 'reaction' | 'call' | 'chat') => void;
  closeTrialPaywall: () => void;
  setTrialPaywall: (state: TrialPaywallState) => void;
}

export const useUIStore = create<UIStore>()((set, get) => ({
  authSheet: {
    isOpen: false,
    step: 'phone',
    pendingAction: undefined,
    pendingActionType: undefined,
  },

  trialPaywall: {
    isOpen: false,
    feature: undefined,
  },

  isTrialPaywallOpen: false,

  openAuthSheet: (action, actionType) => {
    set({
      authSheet: {
        isOpen: true,
        step: 'phone',
        pendingAction: action,
        pendingActionType: actionType as any,
      },
    });
  },

  closeAuthSheet: () => {
    set({
      authSheet: {
        isOpen: false,
        step: 'phone',
        pendingAction: undefined,
        pendingActionType: undefined,
      },
    });
  },

  setAuthStep: (step) => {
    set((state) => ({
      authSheet: {
        ...state.authSheet,
        step,
      },
    }));
  },

  executePendingAction: () => {
    const { authSheet } = get();
    if (authSheet.pendingAction) {
      authSheet.pendingAction();
    }
  },

  openTrialPaywall: (feature) => {
    set({
      isTrialPaywallOpen: true,
      trialPaywall: {
        isOpen: true,
        feature,
      },
    });
  },

  closeTrialPaywall: () => {
    set({
      isTrialPaywallOpen: false,
      trialPaywall: {
        isOpen: false,
        feature: undefined,
      },
    });
  },

  setTrialPaywall: (state) => {
    set({
      trialPaywall: state,
      isTrialPaywallOpen: state.isOpen
    });
  },
}));
