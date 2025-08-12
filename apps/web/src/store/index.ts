import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { callService, type StartCallParams, type CallMetrics, type CallParticipant } from '@/lib/callService';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  verified: boolean;
  plan: 'free' | 'starter' | 'premium' | 'business';
  balance: number;
  earnings: number;
}

export interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  
  // UI state
  isLoading: boolean;
  stories: any[];
  storiesVisible: boolean;
  balanceBannerVisible: boolean;
  
  // Call state
  activeCall: {
    id: string;
    type: 'audio' | 'video';
    channel: string;
    participants: CallParticipant[];
    metrics: CallMetrics | null;
    status: 'connecting' | 'connected' | 'ended';
  } | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setStoriesVisible: (visible: boolean) => void;
  setBalanceBannerVisible: (visible: boolean) => void;
  startCall: (params: StartCallParams) => Promise<void>;
  endCall: () => Promise<void>;
  updateCallMetrics: (metrics: CallMetrics) => void;
  updateCallParticipants: (participants: CallParticipant[]) => void;
  updateBalance: (amount: number) => void;
  updateEarnings: (amount: number) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      stories: [],
      storiesVisible: true,
      balanceBannerVisible: true,
      activeCall: null,
      
      // Actions
      setUser: (user) => {
        // Persist user to localStorage for auth guard compatibility
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          localStorage.removeItem('user');
        }
        set({ user, isAuthenticated: !!user });
      },
      setLoading: (isLoading) => set({ isLoading }),
      setStoriesVisible: (storiesVisible) => set({ storiesVisible }),
      setBalanceBannerVisible: (balanceBannerVisible) => set({ balanceBannerVisible }),
      
      startCall: async (params) => {
        const { user } = get();
        if (!user) {
          throw new Error('User must be authenticated to start a call');
        }

        try {
          const callId = `call-${Date.now()}`;
          const activeCall = {
            id: callId,
            type: params.type,
            channel: '',
            participants: [],
            metrics: null,
            status: 'connecting' as const,
          };
          set({ activeCall });

          // Set up call service callbacks
          callService.setCallbacks({
            onMetricsUpdate: (metrics) => {
              const { updateCallMetrics } = get();
              updateCallMetrics(metrics);
            },
            onParticipantUpdate: (participants) => {
              const { updateCallParticipants } = get();
              updateCallParticipants(participants);
            },
            onCallEnd: () => {
              const { endCall } = get();
              endCall();
            },
          });

          // Start the call
          const callConfig = await callService.startCall(params, user.balance);

          // Update call state with connection info
          set({
            activeCall: {
              ...activeCall,
              channel: callConfig.channel,
              status: 'connected',
            }
          });

          console.log('Call started successfully:', callConfig);
        } catch (error) {
          console.error('Failed to start call:', error);
          set({ activeCall: null });
          throw error;
        }
      },

      endCall: async () => {
        try {
          await callService.endCall();
          set({ activeCall: null });
        } catch (error) {
          console.error('Error ending call:', error);
          set({ activeCall: null });
        }
      },

      updateCallMetrics: (metrics) => {
        const { activeCall } = get();
        if (activeCall) {
          set({
            activeCall: {
              ...activeCall,
              metrics,
            }
          });
        }
      },

      updateCallParticipants: (participants) => {
        const { activeCall } = get();
        if (activeCall) {
          set({
            activeCall: {
              ...activeCall,
              participants,
            }
          });
        }
      },
      
      updateBalance: (amount) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, balance: user.balance + amount } });
        }
      },
      
      updateEarnings: (amount) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, earnings: user.earnings + amount } });
        }
      },
    }),
      {
        name: 'akilipesa-store',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          storiesVisible: state.storiesVisible,
          balanceBannerVisible: state.balanceBannerVisible,
        }),
      }
    ),
    { name: 'akilipesa-store' }
  )
);
