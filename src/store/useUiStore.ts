import { create } from 'zustand';
import type { MilestoneTier } from '@/src/theme/tokens';

export interface ToastItem {
  id: string;
  message: string;
  variant: 'success' | 'info' | 'error';
  duration?: number;
}

interface ActiveCelebration {
  vaultId: string;
  tier: MilestoneTier;
}

interface UiStore {
  toasts: ToastItem[];
  activeCelebration: ActiveCelebration | null;
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
  dismissToast: (id: string) => void;
  presentCelebration: (vaultId: string, tier: MilestoneTier) => void;
  dismissCelebration: () => void;
}

function makeToastId(): string {
  return `toast_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export const useUiStore = create<UiStore>((set) => ({
  toasts: [],
  activeCelebration: null,
  showToast: (toast) => {
    const id = makeToastId();
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
  },
  dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  presentCelebration: (vaultId, tier) => set({ activeCelebration: { vaultId, tier } }),
  dismissCelebration: () => set({ activeCelebration: null }),
}));
