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
  openAuthSheet: (action?: () => void, actionType?: string) => void;
  closeAuthSheet: () => void;
  setAuthStep: (step: AuthSheetState['step']) => void;
  executePendingAction: () => void;
  setTrialPaywall: (state: TrialPaywallState) => void;
  closeTrialPaywall: () => void;
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

  setTrialPaywall: (state) => {
    set({ trialPaywall: state });
  },

  closeTrialPaywall: () => {
    set({
      trialPaywall: {
        isOpen: false,
        feature: undefined,
      },
    });
  },
}));
