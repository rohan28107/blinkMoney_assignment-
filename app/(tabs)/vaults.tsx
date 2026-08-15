import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/src/components/ui/Screen';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { Skeleton } from '@/src/components/ui/Skeleton';
import { Button } from '@/src/components/ui/Button';
import { VaultCard } from '@/src/components/vault/VaultCard';
import { useVaultStore } from '@/src/store/useVaultStore';
import { radii, spacing, typography } from '@/src/theme/tokens';
import { useThemeColors } from '@/src/theme/useThemeColors';

type TabKey = 'inProgress' | 'completed';

export default function VaultsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('inProgress');
  const vaultsRecord = useVaultStore((s) => s.vaults);
  // Subscribed to (not directly rendered) so this screen re-renders whenever a
  // contribution or membership change would affect getVaultProgress() below —
  // otherwise those derived reads stay frozen at whatever they were on last mount.
  useVaultStore((s) => s.contributions);
  useVaultStore((s) => s.members);
  const getVaultProgress = useVaultStore((s) => s.getVaultProgress);
  const getMembersForVault = useVaultStore((s) => s.getMembersForVault);
  const colors = useThemeColors();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 550);
    return () => clearTimeout(t);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 700);
  }, []);

  const allVaults = Object.values(vaultsRecord).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const inProgressVaults = allVaults.filter((v) => v.status === 'active');
  const completedVaults = allVaults.filter((v) => v.status === 'completed');
  const vaults = activeTab === 'inProgress' ? inProgressVaults : completedVaults;

  const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: spacing.xl,
      paddingBottom: spacing.md,
    },
    tabRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      paddingHorizontal: spacing.xl,
      paddingBottom: spacing.lg,
    },
    tabButton: { flex: 1 },
    tabPill: {
      alignItems: 'center',
      paddingVertical: 10,
      borderRadius: radii.pill,
      backgroundColor: colors.surface.canvas,
      borderWidth: 1,
      borderColor: colors.border,
    },
    tabPillActive: { backgroundColor: colors.brand.forest, borderColor: colors.brand.forest },
    tabText: { color: colors.text.secondary },
    tabTextActive: { color: colors.text.inverse },
    skeletonList: { padding: spacing.xl, gap: spacing.md },
    listContent: { padding: spacing.xl, paddingTop: 0 },
  });

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[typography.h1, { color: colors.text.primary }]}>Squad Vaults</Text>
        <Button label="Create" size="sm" onPress={() => router.push('/vault/create')} />
      </View>

      <View style={styles.tabRow}>
        <Pressable style={styles.tabButton} onPress={() => setActiveTab('inProgress')}>
          <View style={[styles.tabPill, activeTab === 'inProgress' && styles.tabPillActive]}>
            <Text style={[typography.bodyMedium, styles.tabText, activeTab === 'inProgress' && styles.tabTextActive]}>
              In Progress ({inProgressVaults.length})
            </Text>
          </View>
        </Pressable>
        <Pressable style={styles.tabButton} onPress={() => setActiveTab('completed')}>
          <View style={[styles.tabPill, activeTab === 'completed' && styles.tabPillActive]}>
            <Text style={[typography.bodyMedium, styles.tabText, activeTab === 'completed' && styles.tabTextActive]}>
              Completed ({completedVaults.length})
            </Text>
          </View>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.skeletonList}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} height={110} radius={20} />
          ))}
        </View>
      ) : vaults.length === 0 ? (
        activeTab === 'inProgress' ? (
          <EmptyState
            icon="🏝️"
            title="No vaults in progress"
            subtitle="Create a Squad Vault and invite friends to save toward a shared goal together."
            ctaLabel="Create a Vault"
            onCtaPress={() => router.push('/vault/create')}
          />
        ) : (
          <EmptyState
            icon="🏆"
            title="No completed vaults yet"
            subtitle="Vaults show up here once your squad hits the target — keep saving!"
          />
        )
      ) : (
        <FlatList
          data={vaults}
          keyExtractor={(v) => v.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.brand.forest} />
          }
          renderItem={({ item: vault }) => (
            <VaultCard
              vault={vault}
              progress={getVaultProgress(vault.id)}
              members={getMembersForVault(vault.id)}
              onPress={() => router.push({ pathname: '/vault/[id]', params: { id: vault.id } })}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        />
      )}
    </Screen>
  );
}
