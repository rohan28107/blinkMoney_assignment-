import type { VaultColorToken, MilestoneTier } from '@/src/theme/tokens';

export type { MilestoneTier };

export interface FriendPersona {
  id: string;
  name: string;
  avatarEmoji: string;
}

export interface Member {
  id: string;
  vaultId: string;
  personaId: string | 'me';
  name: string;
  avatarEmoji: string;
  isOwner: boolean;
  status: 'invited' | 'joined';
  invitedAt: string;
  joinedAt?: string;
}

export interface Contribution {
  id: string;
  vaultId: string;
  memberId: string;
  amount: number;
  createdAt: string;
  note?: string;
  source: 'user' | 'simulated';
}

export interface MilestoneEvent {
  id: string;
  vaultId: string;
  tier: MilestoneTier;
  achievedAt: string;
  celebrated: boolean;
}

export type VaultStatus = 'active' | 'completed';

export interface Vault {
  id: string;
  name: string;
  emoji: string;
  colorToken: VaultColorToken;
  targetAmount: number;
  targetDate?: string;
  createdAt: string;
  status: VaultStatus;
  withdrawnAt?: string;
}

export interface VaultProgress {
  savedAmount: number;
  grownAmount: number;
  totalAmount: number;
  targetAmount: number;
  percent: number;
}
