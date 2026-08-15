import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { Screen } from '@/src/components/ui/Screen';
import { Button } from '@/src/components/ui/Button';
import { AvatarStack } from '@/src/components/ui/Avatar';
import { ProgressRing } from '@/src/components/vault/ProgressRing';
import { useVaultStore } from '@/src/store/useVaultStore';
import { useUiStore } from '@/src/store/useUiStore';
import { spacing, typography, vaultThemes } from '@/src/theme/tokens';
import { useThemeColors } from '@/src/theme/useThemeColors';
import { formatINR } from '@/src/lib/currency';
import { toRingPercents } from '@/src/lib/progress';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH - 48, 340);
const CARD_HEIGHT = CARD_WIDTH * 1.35;

export default function ShareCardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const vault = useVaultStore((s) => s.vaults[id]);
  useVaultStore((s) => s.contributions);
  useVaultStore((s) => s.members);
  const getVaultProgress = useVaultStore((s) => s.getVaultProgress);
  const getMembersForVault = useVaultStore((s) => s.getMembersForVault);
  const showToast = useUiStore((s) => s.showToast);
  const viewShotRef = useRef<ViewShot>(null);
  const [sharing, setSharing] = useState(false);
  const colors = useThemeColors();

  if (!vault) return null;

  const progress = getVaultProgress(vault.id);
  const members = getMembersForVault(vault.id);
  const { savedPercent, grownPercent } = toRingPercents(progress);
  const theme = vaultThemes[vault.colorToken];

  const handleShare = async () => {
    if (sharing) return;
    setSharing(true);
    try {
      const uri = await viewShotRef.current?.capture?.();
      if (!uri) throw new Error('capture failed');
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, { dialogTitle: `${vault.name} — Squad Vault` });
      } else {
        showToast({ message: 'Sharing is not available on this device', variant: 'error' });
      }
    } catch {
      showToast({ message: "Couldn't create the share card — try again", variant: 'error' });
    } finally {
      setSharing(false);
    }
  };

  const styles = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.xl },
    headerSpacer: { width: 26 },
    cardWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    card: { borderRadius: 28, alignItems: 'center', padding: spacing['2xl'], justifyContent: 'space-between' },
    kicker: { opacity: 0.7 },
    cardEmoji: { fontSize: 40, marginTop: spacing.md },
    cardName: { textAlign: 'center' },
    cardAmount: {},
    cardFooter: { alignItems: 'center', gap: spacing.xs },
    tagline: { opacity: 0.7 },
    footer: { padding: spacing.xl, gap: spacing.sm },
    previewButton: { borderColor: 'transparent' },
  });

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={26} color={colors.text.primary} />
        </Pressable>
        <Text style={[typography.h3, { color: colors.text.primary }]}>Share progress</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.cardWrap}>
        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }}>
          <View style={[styles.card, { width: CARD_WIDTH, height: CARD_HEIGHT, backgroundColor: theme.bg }]}>
            <Text style={[typography.micro, styles.kicker, { color: theme.onBg }]}>BLINKMONEY · SQUAD VAULT</Text>
            <Text style={styles.cardEmoji}>{vault.emoji}</Text>
            <Text style={[typography.h2, styles.cardName, { color: theme.onBg }]} numberOfLines={2}>
              {vault.name}
            </Text>

            <ProgressRing size={124} strokeWidth={11} savedPercent={savedPercent} grownPercent={grownPercent}>
              <Text style={[typography.h1, { color: theme.onBg }]}>{Math.round(progress.percent)}%</Text>
            </ProgressRing>

            <Text style={[typography.bodyMedium, styles.cardAmount, { color: theme.onBg }]}>
              {formatINR(progress.totalAmount)} saved together
            </Text>

            <View style={styles.cardFooter}>
              <AvatarStack items={members.map((m) => ({ id: m.id, emoji: m.avatarEmoji }))} max={5} size={26} />
              <Text style={[typography.caption, styles.tagline, { color: theme.onBg }]}>Grow ✦ Borrow ✦ Still Grow</Text>
            </View>
          </View>
        </ViewShot>
      </View>

      <View style={styles.footer}>
        <Button
          label="Share"
          onPress={handleShare}
          loading={sharing}
          fullWidth
          leftIcon={<Ionicons name="share-outline" size={18} color={colors.text.onLime} />}
        />
        <Button
          label="Preview what your friend sees"
          variant="ghost"
          fullWidth
          style={styles.previewButton}
          onPress={() => router.push({ pathname: '/preview/[id]', params: { id: vault.id } })}
        />
      </View>
    </Screen>
  );
}
