import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark';

interface ThemeStore {
  mode: ThemeMode;
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      mode: 'dark',
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),
      setMode: (mode) => set({ mode }),
      toggleMode: () => set({ mode: get().mode === 'dark' ? 'light' : 'dark' }),
    }),
    {
      name: 'blinkmoney-theme',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({ mode: state.mode }),
    }
  )
);
