import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/src/components/ui/Screen';
import { TextField } from '@/src/components/ui/TextField';
import { Button } from '@/src/components/ui/Button';
import { Chip } from '@/src/components/ui/Chip';
import { useVaultStore } from '@/src/store/useVaultStore';
import { useUiStore } from '@/src/store/useUiStore';
import { spacing, typography } from '@/src/theme/tokens';
import { useThemeColors } from '@/src/theme/useThemeColors';
import { clampAmount, formatINR } from '@/src/lib/currency';

const QUICK_AMOUNTS = [100, 500, 1000, 2000];

type SubmitState = 'idle' | 'submitting' | 'error';

export default function ContributeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const vault = useVaultStore((s) => s.vaults[id]);
  const getMembersForVault = useVaultStore((s) => s.getMembersForVault);
  const getMemberShare = useVaultStore((s) => s.getMemberShare);
  const getContributionsForVault = useVaultStore((s) => s.getContributionsForVault);
  const addContribution = useVaultStore((s) => s.addContribution);
  const getNextUncelebratedMilestone = useVaultStore((s) => s.getNextUncelebratedMilestone);
  const markMilestoneCelebrated = useVaultStore((s) => s.markMilestoneCelebrated);
  const presentCelebration = useUiStore((s) => s.presentCelebration);
  const showToast = useUiStore((s) => s.showToast);

  const [amountText, setAmountText] = useState('');
  const [state, setState] = useState<SubmitState>('idle');
  const colors = useThemeColors();

  if (!vault) return null;

  const me = getMembersForVault(vault.id).find((m) => m.isOwner);
  const memberShare = getMemberShare(vault.id);
  const myContributed = me
    ? getContributionsForVault(vault.id)
        .filter((c) => c.memberId === me.id)
        .reduce((sum, c) => sum + c.amount, 0)
    : 0;
  const myShareRemaining = Math.max(0, memberShare - myContributed);
  const amount = clampAmount(Number(amountText.replace(/[^0-9]/g, '')) || 0);
  const isValid = amount > 0;
  const isGoalComplete = vault.status === 'completed';
  const myShareIsMet = memberShare > 0 && myContributed >= memberShare;
  const blockNewContribution = myShareIsMet && !isGoalComplete;

  const finish = () => {
    router.back();
    const pending = getNextUncelebratedMilestone(vault.id);
    if (pending) {
      markMilestoneCelebrated(pending.id);
      setTimeout(() => presentCelebration(vault.id, pending.tier), 450);
    } else {
      showToast({ message: `${formatINR(amount)} added to ${vault.name}`, variant: 'success' });
    }
  };

  const submit = () => {
    if (!me) return;
    setState('submitting');
    setTimeout(() => {
      const failed = Math.random() < 0.2;
      if (failed) {
        setState('error');
        return;
      }
      addContribution({ vaultId: vault.id, memberId: me.id, amount });
      finish();
    }, 900);
  };

  const handleSubmit = () => {
    if (!isValid || !me || blockNewContribution) return;
    if (isGoalComplete) {
      Alert.alert(
        'This goal is already complete',
        `${vault.name} already hit its ${formatINR(vault.targetAmount)} target. Add ${formatINR(amount)} more anyway?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Add anyway', onPress: submit },
        ]
      );
      return;
    }
    submit();
  };

  const styles = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.xl },
    content: { paddingHorizontal: spacing.xl, gap: spacing.lg },
    subtitle: { color: colors.text.secondary },
    completeBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      backgroundColor: colors.semantic.successSoft,
      borderRadius: 14,
      padding: spacing.md,
    },
    completeBannerText: { flex: 1, color: colors.semantic.success },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
    chipRowDisabled: { opacity: 0.5 },
    errorBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      backgroundColor: colors.semantic.dangerSoft,
      borderRadius: 14,
      padding: spacing.md,
    },
    errorText: { flex: 1, color: colors.semantic.danger },
    footer: { padding: spacing.xl, marginTop: 'auto' },
  });

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <Text style={[typography.h2, { color: colors.text.primary }]}>Add Money</Text>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="close" size={26} color={colors.text.primary} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={[typography.body, styles.subtitle]}>
          to {vault.emoji} {vault.name}
        </Text>

        {isGoalComplete && (
          <View style={styles.completeBanner}>
            <Ionicons name="trophy" size={18} color={colors.semantic.success} />
            <Text style={[typography.body, styles.completeBannerText]}>
              This vault already hit its goal — anything added now is a bonus top-up.
            </Text>
          </View>
        )}

        {blockNewContribution && (
          <View style={styles.completeBanner}>
            <Ionicons name="checkmark-circle" size={18} color={colors.semantic.success} />
            <Text style={[typography.body, styles.completeBannerText]}>
              You’ve already covered your {formatINR(memberShare)} share for this vault — nice work! You can add more
              once the vault needs it.
            </Text>
          </View>
        )}

        <TextField
          value={amountText}
          onChangeText={(t) => {
            setAmountText(t);
            setState('idle');
          }}
          placeholder="0"
          prefix="₹"
          keyboardType="number-pad"
          autoFocus={!blockNewContribution}
          editable={!blockNewContribution}
          helperText={
            blockNewContribution
              ? undefined
              : myShareRemaining > 0
                ? `${formatINR(myShareRemaining)} left of your ${formatINR(memberShare)} share`
                : 'Your share is fully covered — this tops up the vault'
          }
        />

        <View style={[styles.chipRow, blockNewContribution && styles.chipRowDisabled]}>
          {QUICK_AMOUNTS.map((a) => (
            <Chip
              key={a}
              label={formatINR(a)}
              selected={amount === a}
              onPress={() => {
                if (blockNewContribution) return;
                setAmountText(String(a));
                setState('idle');
              }}
            />
          ))}
        </View>

        {state === 'error' && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={colors.semantic.danger} />
            <Text style={[typography.body, styles.errorText]}>
              Couldn’t reach BlinkMoney — check your connection and try again.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Button
          label={blockNewContribution ? 'Share complete' : state === 'error' ? 'Try Again' : 'Add Money'}
          onPress={handleSubmit}
          loading={state === 'submitting'}
          disabled={!isValid || blockNewContribution}
          fullWidth
        />
      </View>
    </Screen>
  );
}
