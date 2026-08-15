import type { FriendPersona } from '@/src/types/models';

export const FRIEND_CATALOG: FriendPersona[] = [
  { id: 'f_priya', name: 'Priya Sharma', avatarEmoji: '👩🏽' },
  { id: 'f_rahul', name: 'Rahul Verma', avatarEmoji: '🧑🏽' },
  { id: 'f_ananya', name: 'Ananya Iyer', avatarEmoji: '👩🏻' },
  { id: 'f_karan', name: 'Karan Mehta', avatarEmoji: '🧑🏻' },
  { id: 'f_sneha', name: 'Sneha Reddy', avatarEmoji: '👩🏾' },
];

export function findPersona(id: string): FriendPersona | undefined {
  return FRIEND_CATALOG.find((p) => p.id === id);
}

const SIMULATED_AMOUNTS = [100, 150, 200, 250, 300, 500, 750, 1000];

export function randomSimulatedAmount(): number {
  return SIMULATED_AMOUNTS[Math.floor(Math.random() * SIMULATED_AMOUNTS.length)];
}
