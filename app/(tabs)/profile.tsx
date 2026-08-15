import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/src/components/ui/Screen';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Avatar } from '@/src/components/ui/Avatar';
import { useVaultStore } from '@/src/store/useVaultStore';
import { useUiStore } from '@/src/store/useUiStore';
import { useThemeStore } from '@/src/store/useThemeStore';
import { useThemeColors } from '@/src/theme/useThemeColors';
import { spacing, typography, radii } from '@/src/theme/tokens';

export default function ProfileScreen() {
  const resetDemoData = useVaultStore((s) => s.resetDemoData);
  const showToast = useUiStore((s) => s.showToast);
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  const colors = useThemeColors();

  const handleReset = () => {
    Alert.alert('Reset demo data?', 'This clears all Squad Vaults, contributions, and milestones on this device.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: () => {
          resetDemoData();
          showToast({ message: 'Demo data reset', variant: 'info' });
        },
      },
    ]);
  };

  const styles = StyleSheet.create({
    content: { padding: spacing.xl, gap: spacing.lg, paddingBottom: spacing['5xl'] },
    heading: { color: colors.text.primary },
    profileCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    name: { color: colors.text.primary },
    email: { color: colors.text.tertiary },
    aboutCard: { gap: spacing.sm },
    aboutTitle: { color: colors.text.primary },
    aboutBody: { color: colors.text.secondary },
    themeCard: { gap: spacing.md },
    themeRow: { flexDirection: 'row', gap: spacing.sm },
    themeOption: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      paddingVertical: 12,
      borderRadius: radii.md,
      borderWidth: 1.5,
      borderColor: colors.border,
      backgroundColor: colors.surface.canvas,
    },
    themeOptionActive: { backgroundColor: colors.brand.lime, borderColor: colors.brand.lime },
    themeOptionText: { color: colors.text.secondary },
    themeOptionTextActive: { color: colors.text.onLime },
  });

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[typography.h1, styles.heading]}>Profile</Text>
        <Card style={styles.profileCard}>
          <Avatar emoji="🙂" size={56} />
          <View>
            <Text style={[typography.h3, styles.name]}>You</Text>
            <Text style={[typography.caption, styles.email]}>demo@blinkmoney.in</Text>
          </View>
        </Card>

        <Card variant="outlined" style={styles.themeCard}>
          <Text style={[typography.h3, styles.aboutTitle]}>Appearance</Text>
          <View style={styles.themeRow}>
            <Pressable style={[styles.themeOption, mode === 'light' && styles.themeOptionActive]} onPress={() => setMode('light')}>
              <Ionicons name="sunny-outline" size={16} color={mode === 'light' ? colors.text.onLime : colors.text.secondary} />
              <Text style={[typography.bodyMedium, styles.themeOptionText, mode === 'light' && styles.themeOptionTextActive]}>
                Light
              </Text>
            </Pressable>
            <Pressable style={[styles.themeOption, mode === 'dark' && styles.themeOptionActive]} onPress={() => setMode('dark')}>
              <Ionicons name="moon-outline" size={16} color={mode === 'dark' ? colors.text.onLime : colors.text.secondary} />
              <Text style={[typography.bodyMedium, styles.themeOptionText, mode === 'dark' && styles.themeOptionTextActive]}>
                Dark
              </Text>
            </Pressable>
          </View>
        </Card>

        <Card variant="outlined" style={styles.aboutCard}>
          <Text style={[typography.h3, styles.aboutTitle]}>About this build</Text>
          <Text style={[typography.body, styles.aboutBody]}>
            Squad Vaults is a prototype feature built for BlinkMoney’s frontend assignment. All data is stored locally
            on this device — nothing is sent anywhere.
          </Text>
        </Card>

        <Button label="Reset demo data" variant="danger" fullWidth onPress={handleReset} />
      </ScrollView>
    </Screen>
  );
}
