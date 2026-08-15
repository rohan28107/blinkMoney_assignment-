import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/src/components/ui/Screen';
import { Button } from '@/src/components/ui/Button';
import { AvatarStack } from '@/src/components/ui/Avatar';
import { useVaultStore } from '@/src/store/useVaultStore';
import { spacing, typography, vaultThemes } from '@/src/theme/tokens';
import { useThemeColors } from '@/src/theme/useThemeColors';

export default function VaultPreviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const vault = useVaultStore((s) => s.vaults[id]);
  useVaultStore((s) => s.contributions);
  useVaultStore((s) => s.members);
  const getMembersForVault = useVaultStore((s) => s.getMembersForVault);
  const getVaultProgress = useVaultStore((s) => s.getVaultProgress);
  const colors = useThemeColors();

  if (!vault) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={[typography.h3, { color: colors.text.primary }]}>This vault link has expired</Text>
          <Button label="Go back" variant="ghost" onPress={() => router.back()} style={{ marginTop: spacing.lg }} />
        </View>
      </Screen>
    );
  }

  const members = getMembersForVault(vault.id);
  const progress = getVaultProgress(vault.id);
  const theme = vaultThemes[vault.colorToken];

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']} style={{ backgroundColor: theme.bg }}>
      <View style={styles.badgeRow}>
        <Text style={[typography.micro, styles.badgeText, { color: theme.onBg }]}>YOU’VE BEEN INVITED</Text>
      </View>

      <View style={styles.hero}>
        <Text style={styles.emoji}>{vault.emoji}</Text>
        <Text style={[typography.display, styles.name, { color: theme.onBg }]}>{vault.name}</Text>
        <AvatarStack items={members.map((m) => ({ id: m.id, emoji: m.avatarEmoji }))} max={5} size={32} />
        <Text style={[typography.body, styles.subtitle, { color: theme.onBg }]}>
          {members.length} {members.length === 1 ? 'person has' : 'people have'} already started saving together.
        </Text>

        <View style={styles.statBlock}>
          <Text style={[typography.display, { color: theme.onBg }]}>{Math.round(progress.percent)}%</Text>
          <Text style={[typography.caption, styles.statCaption, { color: theme.onBg }]}>
            saved so far — install to see the full picture
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button label="Get BlinkMoney to join" variant="primary" fullWidth onPress={() => router.back()} />
        <Text style={[typography.caption, styles.disclaimer, { color: theme.onBg }]}>
          Preview only — this is what a friend without the app would see from your invite link.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  badgeRow: { alignItems: 'center', paddingTop: spacing.xl },
  badgeText: { opacity: 0.7 },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing['2xl'], gap: spacing.md },
  emoji: { fontSize: 56 },
  name: { textAlign: 'center' },
  subtitle: { textAlign: 'center', opacity: 0.85, marginTop: spacing.sm },
  statBlock: { alignItems: 'center', marginTop: spacing.xl },
  statCaption: { opacity: 0.6, marginTop: spacing.xs, textAlign: 'center' },
  footer: { padding: spacing.xl, gap: spacing.sm },
  disclaimer: { textAlign: 'center', opacity: 0.6 },
});
