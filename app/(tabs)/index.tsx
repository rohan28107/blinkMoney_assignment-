import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/src/components/ui/Screen';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { VaultCard } from '@/src/components/vault/VaultCard';
import { useVaultStore } from '@/src/store/useVaultStore';
import { spacing, typography } from '@/src/theme/tokens';
import { useThemeColors } from '@/src/theme/useThemeColors';
import { formatINR } from '@/src/lib/currency';
import { formatRelativeTime } from '@/src/lib/dates';
import { MOCK_PORTFOLIO, portfolioGain } from '@/src/lib/mockPortfolio';

export default function HomeScreen() {
  const router = useRouter();
  const vaultsRecord = useVaultStore((s) => s.vaults);
  const membersRecord = useVaultStore((s) => s.members);
  const contributionsRecord = useVaultStore((s) => s.contributions);
  const getVaultProgress = useVaultStore((s) => s.getVaultProgress);
  const getMembersForVault = useVaultStore((s) => s.getMembersForVault);
  const colors = useThemeColors();

  const vaults = Object.values(vaultsRecord).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const recentActivity = Object.values(contributionsRecord)
    .filter((c) => c.source === 'simulated')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  const { gain, gainPercent } = portfolioGain();

  const styles = StyleSheet.create({
    content: { padding: spacing.xl, paddingBottom: spacing['5xl'], gap: spacing.lg },
    greeting: { color: colors.text.primary },
    portfolioCard: { gap: 4 },
    portfolioLabel: { color: colors.text.inverseMuted },
    portfolioValue: { color: colors.text.inverse },
    portfolioGain: { color: colors.brand.lime },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm },
    sectionHeading: { color: colors.text.primary },
    vaultList: { gap: spacing.md },
  });

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[typography.h2, styles.greeting]}>Good to see you 👋</Text>

        <Card tone="dark" style={styles.portfolioCard}>
          <Text style={[typography.caption, styles.portfolioLabel]}>Your BlinkMoney</Text>
          <Text style={[typography.display, styles.portfolioValue]}>{formatINR(MOCK_PORTFOLIO.current)}</Text>
          <Text style={[typography.bodyMedium, styles.portfolioGain]}>
            +{formatINR(gain)} ({gainPercent.toFixed(1)}%) · Grow ✦ Borrow ✦ Still Grow
          </Text>
        </Card>

        {recentActivity && (
          <Card variant="outlined">
            <Text style={[typography.body, { color: colors.text.secondary }]}>
              {membersRecord[recentActivity.memberId]?.name ?? 'A friend'} added{' '}
              {formatINR(recentActivity.amount)} to {vaultsRecord[recentActivity.vaultId]?.name ?? 'a vault'} ·{' '}
              {formatRelativeTime(recentActivity.createdAt, Date.now())}
            </Text>
          </Card>
        )}

        <View style={styles.sectionHeader}>
          <Text style={[typography.h3, styles.sectionHeading]}>Your Squad Vaults</Text>
          <Button label="+ New" variant="ghost" size="sm" onPress={() => router.push('/vault/create')} />
        </View>

        {vaults.length === 0 ? (
          <EmptyState
            icon="🏝️"
            title="Start a Squad Vault"
            subtitle="Save toward something with friends — everyone chips in, and it keeps growing even between contributions."
            ctaLabel="Create your first Vault"
            onCtaPress={() => router.push('/vault/create')}
          />
        ) : (
          <View style={styles.vaultList}>
            {vaults.map((vault) => (
              <VaultCard
                key={vault.id}
                vault={vault}
                progress={getVaultProgress(vault.id)}
                members={getMembersForVault(vault.id)}
                onPress={() => router.push({ pathname: '/vault/[id]', params: { id: vault.id } })}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}
