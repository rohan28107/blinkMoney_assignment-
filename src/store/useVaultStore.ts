import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Vault, Member, Contribution, MilestoneEvent, VaultProgress } from '@/src/types/models';
import type { VaultColorToken } from '@/src/theme/tokens';
import { totalGrownAmount } from '@/src/lib/growth';
import { nextUncelebratedTier, tiersCrossed } from '@/src/lib/milestones';
import { findPersona, randomSimulatedAmount } from '@/src/lib/mockFriends';

function makeId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

interface CreateVaultInput {
  name: string;
  emoji: string;
  colorToken: VaultColorToken;
  targetAmount: number;
  targetDate?: string;
}

interface VaultStoreState {
  vaults: Record<string, Vault>;
  members: Record<string, Member>;
  contributions: Record<string, Contribution>;
  milestones: Record<string, MilestoneEvent>;
  hasHydrated: boolean;
}

interface VaultStoreActions {
  setHasHydrated: (v: boolean) => void;
  createVault: (input: CreateVaultInput) => string;
  addContribution: (input: {
    vaultId: string;
    memberId: string;
    amount: number;
    note?: string;
    source?: 'user' | 'simulated';
  }) => void;
  inviteFriend: (vaultId: string, personaId: string) => string | undefined;
  simulateFriendJoin: (memberId: string) => void;
  simulateFriendContribution: (memberId: string) => void;
  markMilestoneCelebrated: (milestoneId: string) => void;
  withdrawFunds: (vaultId: string) => void;
  deleteVault: (vaultId: string) => void;
  resetDemoData: () => void;

  getMembersForVault: (vaultId: string) => Member[];
  getMemberShare: (vaultId: string) => number;
  getContributionsForVault: (vaultId: string) => Contribution[];
  getMilestonesForVault: (vaultId: string) => MilestoneEvent[];
  getVaultProgress: (vaultId: string, nowMs?: number) => VaultProgress;
  ensureMilestonesRecorded: (vaultId: string, nowMs?: number) => void;
  getNextUncelebratedMilestone: (vaultId: string, nowMs?: number) => MilestoneEvent | undefined;
}

export type VaultStore = VaultStoreState & VaultStoreActions;

export const useVaultStore = create<VaultStore>()(
  persist(
    (set, get) => ({
      vaults: {},
      members: {},
      contributions: {},
      milestones: {},
      hasHydrated: false,

      setHasHydrated: (v) => set({ hasHydrated: v }),

      createVault: (input) => {
        const id = makeId('vault');
        const now = new Date().toISOString();
        const vault: Vault = {
          id,
          name: input.name.trim(),
          emoji: input.emoji,
          colorToken: input.colorToken,
          targetAmount: Math.max(0, Math.round(input.targetAmount)),
          targetDate: input.targetDate,
          createdAt: now,
          status: 'active',
        };
        const ownerMemberId = makeId('member');
        const owner: Member = {
          id: ownerMemberId,
          vaultId: id,
          personaId: 'me',
          name: 'You',
          avatarEmoji: '🙂',
          isOwner: true,
          status: 'joined',
          invitedAt: now,
          joinedAt: now,
        };
        set((state) => ({
          vaults: { ...state.vaults, [id]: vault },
          members: { ...state.members, [ownerMemberId]: owner },
        }));
        return id;
      },

      addContribution: ({ vaultId, memberId, amount, note, source = 'user' }) => {
        if (!Number.isFinite(amount) || amount <= 0) return;
        const id = makeId('contrib');
        const contribution: Contribution = {
          id,
          vaultId,
          memberId,
          amount: Math.round(amount),
          createdAt: new Date().toISOString(),
          note,
          source,
        };
        set((state) => ({
          contributions: { ...state.contributions, [id]: contribution },
        }));
        get().ensureMilestonesRecorded(vaultId);
      },

      inviteFriend: (vaultId, personaId) => {
        const alreadyInvited = Object.values(get().members).some(
          (m) => m.vaultId === vaultId && m.personaId === personaId
        );
        if (alreadyInvited) return undefined;
        const persona = findPersona(personaId);
        if (!persona) return undefined;
        const id = makeId('member');
        const member: Member = {
          id,
          vaultId,
          personaId,
          name: persona.name,
          avatarEmoji: persona.avatarEmoji,
          isOwner: false,
          status: 'invited',
          invitedAt: new Date().toISOString(),
        };
        set((state) => ({ members: { ...state.members, [id]: member } }));
        return id;
      },

      simulateFriendJoin: (memberId) => {
        set((state) => {
          const member = state.members[memberId];
          if (!member || member.status === 'joined') return state;
          return {
            members: {
              ...state.members,
              [memberId]: { ...member, status: 'joined', joinedAt: new Date().toISOString() },
            },
          };
        });
      },

      simulateFriendContribution: (memberId) => {
        const member = get().members[memberId];
        if (!member || member.status !== 'joined') return;
        get().addContribution({
          vaultId: member.vaultId,
          memberId,
          amount: randomSimulatedAmount(),
          source: 'simulated',
        });
      },

      markMilestoneCelebrated: (milestoneId) => {
        set((state) => {
          const m = state.milestones[milestoneId];
          if (!m) return state;
          return { milestones: { ...state.milestones, [milestoneId]: { ...m, celebrated: true } } };
        });
      },

      withdrawFunds: (vaultId) => {
        set((state) => {
          const vault = state.vaults[vaultId];
          if (!vault || vault.status !== 'completed' || vault.withdrawnAt) return state;
          return { vaults: { ...state.vaults, [vaultId]: { ...vault, withdrawnAt: new Date().toISOString() } } };
        });
      },

      deleteVault: (vaultId) => {
        set((state) => ({
          vaults: Object.fromEntries(Object.entries(state.vaults).filter(([id]) => id !== vaultId)),
          members: Object.fromEntries(Object.entries(state.members).filter(([, m]) => m.vaultId !== vaultId)),
          contributions: Object.fromEntries(
            Object.entries(state.contributions).filter(([, c]) => c.vaultId !== vaultId)
          ),
          milestones: Object.fromEntries(
            Object.entries(state.milestones).filter(([, ms]) => ms.vaultId !== vaultId)
          ),
        }));
      },

      resetDemoData: () => set({ vaults: {}, members: {}, contributions: {}, milestones: {} }),

      getMembersForVault: (vaultId) =>
        Object.values(get().members)
          .filter((m) => m.vaultId === vaultId)
          .sort((a, b) => Number(b.isOwner) - Number(a.isOwner)),

      getMemberShare: (vaultId) => {
        const vault = get().vaults[vaultId];
        if (!vault) return 0;
        const joinedCount = get()
          .getMembersForVault(vaultId)
          .filter((m) => m.status === 'joined').length;
        return joinedCount > 0 ? vault.targetAmount / joinedCount : vault.targetAmount;
      },

      getContributionsForVault: (vaultId) =>
        Object.values(get().contributions)
          .filter((c) => c.vaultId === vaultId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),

      getMilestonesForVault: (vaultId) =>
        Object.values(get().milestones)
          .filter((m) => m.vaultId === vaultId)
          .sort((a, b) => new Date(b.achievedAt).getTime() - new Date(a.achievedAt).getTime()),

      getVaultProgress: (vaultId, nowMs = Date.now()) => {
        const vault = get().vaults[vaultId];
        const contributions = get().getContributionsForVault(vaultId);
        const savedAmount = contributions.reduce((sum, c) => sum + c.amount, 0);
        const grownAmount = totalGrownAmount(contributions, nowMs);
        const targetAmount = vault?.targetAmount ?? 0;
        const totalAmount = savedAmount + grownAmount;
        const percent = targetAmount > 0 ? (totalAmount / targetAmount) * 100 : 0;
        return { savedAmount, grownAmount, totalAmount, targetAmount, percent };
      },

      ensureMilestonesRecorded: (vaultId, nowMs = Date.now()) => {
        const { percent } = get().getVaultProgress(vaultId, nowMs);
        const crossed = tiersCrossed(percent);
        set((state) => {
          const milestones = { ...state.milestones };
          let changed = false;
          for (const tier of crossed) {
            const id = `${vaultId}_${tier}`;
            if (!milestones[id]) {
              milestones[id] = { id, vaultId, tier, achievedAt: new Date().toISOString(), celebrated: false };
              changed = true;
            }
          }
          const vault = state.vaults[vaultId];
          const shouldComplete = crossed.includes(100) && vault && vault.status !== 'completed';
          return {
            ...(changed ? { milestones } : null),
            ...(shouldComplete ? { vaults: { ...state.vaults, [vaultId]: { ...vault, status: 'completed' as const } } } : null),
          };
        });
      },

      getNextUncelebratedMilestone: (vaultId, nowMs = Date.now()) => {
        get().ensureMilestonesRecorded(vaultId, nowMs);
        const { percent } = get().getVaultProgress(vaultId, nowMs);
        const celebratedTiers = Object.values(get().milestones)
          .filter((m) => m.vaultId === vaultId && m.celebrated)
          .map((m) => m.tier);
        const tier = nextUncelebratedTier(percent, celebratedTiers);
        if (!tier) return undefined;
        return get().milestones[`${vaultId}_${tier}`];
      },
    }),
    {
      name: 'blinkmoney-squad-vault',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        vaults: state.vaults,
        members: state.members,
        contributions: state.contributions,
        milestones: state.milestones,
      }),
    }
  )
);
