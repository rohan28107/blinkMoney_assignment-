import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useUiStore } from '@/src/store/useUiStore';
import { useVaultStore } from '@/src/store/useVaultStore';
import { milestoneCopy, formatNameList } from '@/src/lib/milestones';
import { Confetti } from './Confetti';
import { Button } from '@/src/components/ui/Button';
import { spacing, typography } from '@/src/theme/tokens';
import { useThemeColors } from '@/src/theme/useThemeColors';

export function MilestoneCelebration() {
  const activeCelebration = useUiStore((s) => s.activeCelebration);
  const dismissCelebration = useUiStore((s) => s.dismissCelebration);
  const vault = useVaultStore((s) => (activeCelebration ? s.vaults[activeCelebration.vaultId] : undefined));
  const getMembersForVault = useVaultStore((s) => s.getMembersForVault);
  const router = useRouter();
  const colors = useThemeColors();

  if (!activeCelebration || !vault) return null;

  const copy = milestoneCopy[activeCelebration.tier];
  const vaultId = activeCelebration.vaultId;
  const isGoalComplete = activeCelebration.tier === 100;
  const notifiedNames = isGoalComplete
    ? getMembersForVault(vaultId)
        .filter((m) => !m.isOwner && m.status === 'joined')
        .map((m) => m.name)
    : [];

  const handleShare = () => {
    dismissCelebration();
    router.push({ pathname: '/vault/[id]/share-card', params: { id: vaultId } });
  };

  const styles = StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: colors.surface.cardDark,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing['2xl'],
    },
    card: { alignItems: 'center', width: '100%' },
    emoji: { fontSize: 64, marginBottom: spacing.md },
    notifiedPill: {
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: 999,
      paddingVertical: 8,
      paddingHorizontal: spacing.md,
      marginTop: spacing.lg,
    },
    notifiedText: { color: colors.text.inverseMuted },
    tierLabel: { color: colors.brand.lime, marginBottom: spacing.sm },
    title: { color: colors.text.inverse, textAlign: 'center', marginBottom: spacing.sm },
    subtitle: { color: colors.text.inverseMuted, textAlign: 'center' },
    primaryCta: { marginTop: spacing['2xl'] },
    secondaryCta: { marginTop: spacing.sm, backgroundColor: 'transparent', borderColor: colors.borderDark },
  });

  return (
    <Modal visible transparent animationType="fade" statusBarTranslucent onRequestClose={dismissCelebration}>
      <View style={styles.backdrop}>
        <Confetti />
        <View style={styles.card}>
          <Text style={styles.emoji}>{vault.emoji}</Text>
          <Text style={[typography.micro, styles.tierLabel]}>{activeCelebration.tier}% MILESTONE</Text>
          <Text style={[typography.display, styles.title]}>{copy.title}</Text>
          <Text style={[typography.body, styles.subtitle]}>{copy.subtitle}</Text>
          {isGoalComplete && notifiedNames.length > 0 && (
            <View style={styles.notifiedPill}>
              <Text style={[typography.caption, styles.notifiedText]}>
                🔔 {formatNameList(notifiedNames)} {notifiedNames.length === 1 ? 'has' : 'have'} been notified
              </Text>
            </View>
          )}
          <Button label="Share this moment" onPress={handleShare} variant="primary" fullWidth style={styles.primaryCta} />
          <Button label="Keep going" onPress={dismissCelebration} variant="ghost" fullWidth style={styles.secondaryCta} />
        </View>
      </View>
    </Modal>
  );
}
