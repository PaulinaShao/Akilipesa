import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

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
    participants: string[];
    status: 'connecting' | 'connected' | 'ended';
  } | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setStoriesVisible: (visible: boolean) => void;
  setBalanceBannerVisible: (visible: boolean) => void;
  startCall: (params: { type: 'audio' | 'video'; agentId?: string; targetId?: string }) => void;
  endCall: () => void;
  updateBalance: (amount: number) => void;
  updateEarnings: (amount: number) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
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
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setLoading: (isLoading) => set({ isLoading }),
      setStoriesVisible: (storiesVisible) => set({ storiesVisible }),
      setBalanceBannerVisible: (balanceBannerVisible) => set({ balanceBannerVisible }),
      
      startCall: (params) => {
        const callId = `call-${Date.now()}`;
        const activeCall = {
          id: callId,
          type: params.type,
          participants: [params.agentId || params.targetId || 'unknown'],
          status: 'connecting' as const,
        };
        set({ activeCall });
        
        // Navigate to call page (this would be handled by the component)
        console.log('Starting call:', params);
      },
      
      endCall: () => set({ activeCall: null }),
      
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
    { name: 'akilipesa-store' }
  )
);
