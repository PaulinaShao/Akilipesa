import { create } from 'zustand';
import { TrialConfig } from '@/lib/config';

interface TrialConfigStore {
  config: TrialConfig | null;
  isLoaded: boolean;
  setConfig: (config: TrialConfig) => void;
}

export const useTrialConfigStore = create<TrialConfigStore>((set) => ({
  config: null,
  isLoaded: false,
  setConfig: (config) => set({ config, isLoaded: true }),
}));
