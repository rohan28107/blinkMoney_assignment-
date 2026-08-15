import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@/src/components/ui/Card';
import { AvatarStack } from '@/src/components/ui/Avatar';
import { Chip } from '@/src/components/ui/Chip';
import { ProgressRing } from './ProgressRing';
import { spacing, typography, vaultThemes } from '@/src/theme/tokens';
import { useThemeColors } from '@/src/theme/useThemeColors';
import { formatINRCompact } from '@/src/lib/currency';
import { daysLeftLabel } from '@/src/lib/dates';
import { toRingPercents } from '@/src/lib/progress';
import type { Vault, VaultProgress, Member } from '@/src/types/models';

interface VaultCardProps {
  vault: Vault;
  progress: VaultProgress;
  members: Member[];
  onPress: () => void;
}

export function VaultCard({ vault, progress, members, onPress }: VaultCardProps) {
  const colors = useThemeColors();
  const theme = vaultThemes[vault.colorToken];
  const { savedPercent, grownPercent } = toRingPercents(progress);
  const nowMs = Date.now();

  const styles = StyleSheet.create({
    card: { gap: spacing.md },
    row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    emojiBadge: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    emoji: { fontSize: 22 },
    info: { flex: 1, gap: 2 },
    name: { color: colors.text.primary },
    amount: { color: colors.text.secondary },
    percentText: { fontFamily: typography.caption.fontFamily, fontSize: 12, color: colors.text.primary },
    footerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  });

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.emojiBadge, { backgroundColor: theme.bg }]}>
          <Text style={styles.emoji}>{vault.emoji}</Text>
        </View>
        <View style={styles.info}>
          <Text style={[typography.h3, styles.name]} numberOfLines={1}>
            {vault.name}
          </Text>
          <Text style={[typography.caption, styles.amount]} numberOfLines={1}>
            {formatINRCompact(progress.totalAmount)} of {formatINRCompact(progress.targetAmount)}
          </Text>
        </View>
        <ProgressRing size={54} strokeWidth={6} savedPercent={savedPercent} grownPercent={grownPercent}>
          <Text style={styles.percentText}>{Math.round(progress.percent)}%</Text>
        </ProgressRing>
      </View>
      <View style={styles.footerRow}>
        <AvatarStack items={members.map((m) => ({ id: m.id, emoji: m.avatarEmoji }))} max={4} size={26} />
        {vault.withdrawnAt ? (
          <Chip label="✓ Withdrawn" variant="success" />
        ) : vault.status === 'completed' ? (
          <Chip label="🏆 Goal complete" variant="success" />
        ) : (
          <Chip label={daysLeftLabel(vault.targetDate, nowMs)} variant="neutral" />
        )}
      </View>
    </Card>
  );
}
