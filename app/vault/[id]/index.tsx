import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/src/components/ui/Screen';
import { Button } from '@/src/components/ui/Button';
import { Chip } from '@/src/components/ui/Chip';
import { Avatar } from '@/src/components/ui/Avatar';
import { ProgressBar } from '@/src/components/ui/ProgressBar';
import { ProgressRing } from '@/src/components/vault/ProgressRing';
import { useVaultStore } from '@/src/store/useVaultStore';
import { useUiStore } from '@/src/store/useUiStore';
import { spacing, typography, vaultThemes } from '@/src/theme/tokens';
import { useThemeColors } from '@/src/theme/useThemeColors';
import { formatINR } from '@/src/lib/currency';
import { daysLeftLabel, formatRelativeTime } from '@/src/lib/dates';
import { toRingPercents } from '@/src/lib/progress';
import type { Contribution } from '@/src/types/models';

export default function VaultDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [, setTick] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const interval = setInterval(() => setTick((t) => t + 1), 1500);
      return () => clearInterval(interval);
    }, [])
  );

  const vault = useVaultStore((s) => s.vaults[id]);
  // Subscribed to so this screen re-renders on any contribution/membership change,
  // not just while the tick interval below happens to be running (see vaults.tsx
  // for the same fix — getVaultProgress/getMembersForVault are plain get() reads
  // and don't themselves trigger re-renders when their underlying slices change).
  useVaultStore((s) => s.contributions);
  useVaultStore((s) => s.members);
  const getVaultProgress = useVaultStore((s) => s.getVaultProgress);
  const getMembersForVault = useVaultStore((s) => s.getMembersForVault);
  const getMemberShare = useVaultStore((s) => s.getMemberShare);
  const getContributionsForVault = useVaultStore((s) => s.getContributionsForVault);
  const getMilestonesForVault = useVaultStore((s) => s.getMilestonesForVault);
  const deleteVault = useVaultStore((s) => s.deleteVault);
  const withdrawFunds = useVaultStore((s) => s.withdrawFunds);
  const showToast = useUiStore((s) => s.showToast);
  const colors = useThemeColors();

  const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
    },
    content: { paddingHorizontal: spacing.xl, paddingBottom: spacing['5xl'], gap: spacing['2xl'] },
    hero: { borderRadius: 28, alignItems: 'center', padding: spacing['2xl'] },
    legendRow: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.lg },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    legendDot: { width: 8, height: 8, borderRadius: 4 },
    chipRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
    heroChip: { backgroundColor: 'rgba(255,255,255,0.14)' },
    section: { gap: spacing.md },
    sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    memberRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    memberInfo: { flex: 1, gap: 6 },
    memberSub: { color: colors.text.tertiary },
    memberProgressBar: { marginTop: 2 },
    emptyActivity: { color: colors.text.tertiary },
    activityRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    activityText: { flex: 1, color: colors.text.secondary },
    activityTime: { color: colors.text.tertiary },
    completionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      backgroundColor: colors.semantic.successSoft,
      borderRadius: 14,
      padding: spacing.md,
    },
    completionEmoji: { fontSize: 20 },
    completionText: { flex: 1, color: colors.semantic.success },
    footer: { padding: spacing.xl, borderTopWidth: 1, borderTopColor: colors.border },
    withdrawnFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingVertical: spacing.sm },
    withdrawnFooterText: { color: colors.semantic.success },
    shareMetFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingVertical: spacing.sm },
    shareMetFooterText: { color: colors.semantic.success, textAlign: 'center', flexShrink: 1 },
    notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  });

  if (!vault) {
    return (
      <Screen>
        <View style={styles.notFound}>
          <Text style={[typography.h3, { color: colors.text.primary }]}>Vault not found</Text>
          <Text style={[typography.body, { color: colors.text.secondary, marginTop: spacing.xs }]}>
            It may have been deleted.
          </Text>
          <Button label="Go back" onPress={() => router.back()} variant="ghost" style={{ marginTop: spacing.lg }} />
        </View>
      </Screen>
    );
  }

  const progress = getVaultProgress(vault.id);
  const members = getMembersForVault(vault.id);
  const contributions = getContributionsForVault(vault.id);
  const memberShare = getMemberShare(vault.id);
  const { savedPercent, grownPercent } = toRingPercents(progress);
  const theme = vaultThemes[vault.colorToken];
  const isGoalComplete = vault.status === 'completed';
  const completionMilestone = getMilestonesForVault(vault.id).find((m) => m.tier === 100);

  type ActivityItem =
    | { type: 'contribution'; id: string; createdAt: string; contribution: Contribution }
    | { type: 'completion'; id: string; createdAt: string };

  const activityItems: ActivityItem[] = [
    ...contributions.map(
      (c): ActivityItem => ({ type: 'contribution', id: c.id, createdAt: c.createdAt, contribution: c })
    ),
    ...(completionMilestone
      ? [{ type: 'completion' as const, id: completionMilestone.id, createdAt: completionMilestone.achievedAt }]
      : []),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const isWithdrawn = Boolean(vault.withdrawnAt);
  const me = members.find((m) => m.isOwner);
  const myContributed = me
    ? contributions.filter((c) => c.memberId === me.id).reduce((sum, c) => sum + c.amount, 0)
    : 0;
  const myShareMet = memberShare > 0 && myContributed >= memberShare;

  const handleWithdraw = () => {
    Alert.alert(
      `Withdraw ${formatINR(progress.totalAmount)}?`,
      'This simulates transferring the full amount — savings plus growth — to your bank account. The vault will be marked as withdrawn.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Withdraw',
          onPress: () => {
            withdrawFunds(vault.id);
            showToast({ message: `${formatINR(progress.totalAmount)} withdrawn to your bank account 🎉`, variant: 'success' });
          },
        },
      ]
    );
  };

  const handleOptions = () => {
    Alert.alert(vault.name, undefined, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete vault',
        style: 'destructive',
        onPress: () =>
          Alert.alert('Delete this vault?', "This removes it and all its contribution history. This can't be undone.", [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => {
                deleteVault(vault.id);
                router.back();
              },
            },
          ]),
      },
    ]);
  };

  return (
    <Screen edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={26} color={colors.text.primary} />
        </Pressable>
        <Text style={[typography.h3, { color: colors.text.primary }]} numberOfLines={1}>
          {vault.name}
        </Text>
        <Pressable onPress={handleOptions} hitSlop={12}>
          <Ionicons name="ellipsis-horizontal" size={22} color={colors.text.primary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { backgroundColor: theme.bg }]}>
          <ProgressRing size={188} strokeWidth={16} savedPercent={savedPercent} grownPercent={grownPercent}>
            <Text style={[typography.display, { color: theme.onBg }]}>{Math.round(progress.percent)}%</Text>
            <Text style={[typography.caption, { color: theme.onBg, opacity: 0.7 }]}>
              of {formatINR(progress.targetAmount)}
            </Text>
          </ProgressRing>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.progress.saved }]} />
              <Text style={[typography.caption, { color: theme.onBg }]}>Saved {formatINR(progress.savedAmount)}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.progress.grown }]} />
              <Text style={[typography.caption, { color: theme.onBg }]}>
                Grown {formatINR(progress.grownAmount, { decimals: progress.grownAmount < 10 ? 2 : 0 })}
              </Text>
            </View>
          </View>
          <View style={styles.chipRow}>
            {isWithdrawn ? (
              <Chip label="✓ Withdrawn" variant="success" style={styles.heroChip} />
            ) : isGoalComplete ? (
              <Chip label="🏆 Goal complete" variant="success" style={styles.heroChip} />
            ) : (
              <Chip label={daysLeftLabel(vault.targetDate, Date.now())} variant="neutral" style={styles.heroChip} />
            )}
            <Chip label={`${formatINR(memberShare)} per person`} variant="neutral" style={styles.heroChip} />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[typography.h3, { color: colors.text.primary }]}>Squad ({members.length})</Text>
            <Button
              label="Invite"
              size="sm"
              variant="ghost"
              onPress={() => router.push({ pathname: '/vault/[id]/invite', params: { id: vault.id } })}
            />
          </View>
          {members.map((m) => {
            const memberTotal = contributions
              .filter((c) => c.memberId === m.id)
              .reduce((sum, c) => sum + c.amount, 0);
            const sharePercent = memberShare > 0 ? (memberTotal / memberShare) * 100 : 0;
            const shareMet = m.status === 'joined' && sharePercent >= 100;
            return (
              <View key={m.id} style={styles.memberRow}>
                <Avatar emoji={m.avatarEmoji} size={36} />
                <View style={styles.memberInfo}>
                  <Text style={[typography.bodyMedium, { color: colors.text.primary }]}>
                    {m.name}
                    {m.isOwner ? ' (you)' : ''}
                  </Text>
                  {m.status === 'invited' ? (
                    <Text style={[typography.caption, styles.memberSub]}>Invited — waiting to join</Text>
                  ) : (
                    <>
                      <Text style={[typography.caption, styles.memberSub]}>
                        {formatINR(memberTotal)} of {formatINR(memberShare)} share
                      </Text>
                      <ProgressBar
                        percent={sharePercent}
                        color={shareMet ? colors.semantic.success : colors.brand.forest}
                        style={styles.memberProgressBar}
                      />
                    </>
                  )}
                </View>
                {m.status === 'invited' && <Chip label="Pending" variant="warning" />}
                {shareMet && <Chip label="Share met ✓" variant="success" />}
              </View>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={[typography.h3, { color: colors.text.primary }]}>Activity</Text>
          {activityItems.length === 0 ? (
            <Text style={[typography.body, styles.emptyActivity]}>No contributions yet — be the first!</Text>
          ) : (
            activityItems.slice(0, 8).map((item) => {
              if (item.type === 'completion') {
                return (
                  <View key={item.id} style={styles.completionRow}>
                    <Text style={styles.completionEmoji}>🎉</Text>
                    <Text style={[typography.bodyMedium, styles.completionText]}>Squad goal complete!</Text>
                    <Text style={[typography.caption, styles.activityTime]}>
                      {formatRelativeTime(item.createdAt, Date.now())}
                    </Text>
                  </View>
                );
              }
              const c = item.contribution;
              const member = members.find((m) => m.id === c.memberId);
              return (
                <View key={c.id} style={styles.activityRow}>
                  <Avatar emoji={member?.avatarEmoji ?? '🙂'} size={28} />
                  <Text style={[typography.body, styles.activityText]}>
                    <Text style={[typography.bodyMedium, { color: colors.text.primary }]}>{member?.name ?? 'Someone'}</Text> added{' '}
                    {formatINR(c.amount)}
                  </Text>
                  <Text style={[typography.caption, styles.activityTime]}>
                    {formatRelativeTime(c.createdAt, Date.now())}
                  </Text>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {isWithdrawn ? (
          <View style={styles.withdrawnFooter}>
            <Ionicons name="checkmark-circle" size={18} color={colors.semantic.success} />
            <Text style={[typography.bodyMedium, styles.withdrawnFooterText]}>
              Withdrawn {vault.withdrawnAt ? formatRelativeTime(vault.withdrawnAt, Date.now()) : ''}
            </Text>
          </View>
        ) : isGoalComplete ? (
          <Button
            label={`Withdraw ${formatINR(progress.totalAmount)}`}
            onPress={handleWithdraw}
            variant="secondary"
            fullWidth
            leftIcon={<Ionicons name="wallet-outline" size={18} color={colors.text.inverse} />}
          />
        ) : myShareMet ? (
          <View style={styles.shareMetFooter}>
            <Ionicons name="checkmark-circle" size={18} color={colors.semantic.success} />
            <Text style={[typography.bodyMedium, styles.shareMetFooterText]}>
              Your {formatINR(memberShare)} share is done — waiting on the squad
            </Text>
          </View>
        ) : (
          <Button
            label="Add Money"
            onPress={() => router.push({ pathname: '/vault/[id]/contribute', params: { id: vault.id } })}
            fullWidth
          />
        )}
      </View>
    </Screen>
  );
}
