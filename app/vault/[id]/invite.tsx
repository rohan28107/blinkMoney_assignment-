import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/src/components/ui/Screen';
import { Avatar } from '@/src/components/ui/Avatar';
import { Button } from '@/src/components/ui/Button';
import { Chip } from '@/src/components/ui/Chip';
import { useVaultStore } from '@/src/store/useVaultStore';
import { useUiStore } from '@/src/store/useUiStore';
import { FRIEND_CATALOG } from '@/src/lib/mockFriends';
import { spacing, typography } from '@/src/theme/tokens';
import { useThemeColors } from '@/src/theme/useThemeColors';

export default function InviteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const vault = useVaultStore((s) => s.vaults[id]);
  // Subscribed to so this screen re-renders when simulateFriendJoin fires from
  // its own timers below and flips a member from invited -> joined.
  useVaultStore((s) => s.members);
  const getMembersForVault = useVaultStore((s) => s.getMembersForVault);
  const inviteFriend = useVaultStore((s) => s.inviteFriend);
  const simulateFriendJoin = useVaultStore((s) => s.simulateFriendJoin);
  const simulateFriendContribution = useVaultStore((s) => s.simulateFriendContribution);
  const showToast = useUiStore((s) => s.showToast);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const colors = useThemeColors();

  useEffect(
    () => () => {
      Object.values(timers.current).forEach(clearTimeout);
    },
    []
  );

  if (!vault) return null;

  const members = getMembersForVault(vault.id);
  const invitedPersonaIds = new Set(members.map((m) => m.personaId));
  const available = FRIEND_CATALOG.filter((p) => !invitedPersonaIds.has(p.id));
  const invitedMembers = members.filter((m) => !m.isOwner);

  const handleInvite = async (personaId: string, name: string) => {
    const memberId = inviteFriend(vault.id, personaId);
    if (!memberId) return;
    try {
      await Share.share({
        message: `Join my "${vault.name}" Squad Vault on BlinkMoney — let's save toward it together! ${vault.emoji}`,
      });
    } catch {
      // Share sheet dismissed — the invite still stands, friend can be nudged below.
    }
    timers.current[memberId] = setTimeout(() => {
      simulateFriendJoin(memberId);
      showToast({ message: `${name} joined ${vault.name}! 🎉`, variant: 'success' });
      timers.current[memberId] = setTimeout(() => {
        simulateFriendContribution(memberId);
      }, 2500);
    }, 4000);
  };

  const handleForceJoin = (memberId: string, name: string) => {
    clearTimeout(timers.current[memberId]);
    simulateFriendJoin(memberId);
    showToast({ message: `${name} joined ${vault.name}! 🎉`, variant: 'success' });
  };

  const styles = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.xl },
    content: { paddingHorizontal: spacing.xl, gap: spacing['2xl'], paddingBottom: spacing['3xl'] },
    section: { gap: spacing.md },
    sectionLabel: { color: colors.text.secondary },
    row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    rowName: { flex: 1, color: colors.text.primary },
    emptyText: { color: colors.text.tertiary },
  });

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <Text style={[typography.h2, { color: colors.text.primary }]}>Invite Friends</Text>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="close" size={26} color={colors.text.primary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {invitedMembers.length > 0 && (
          <View style={styles.section}>
            <Text style={[typography.caption, styles.sectionLabel]}>In this vault</Text>
            {invitedMembers.map((m) => (
              <View key={m.id} style={styles.row}>
                <Avatar emoji={m.avatarEmoji} size={40} />
                <Text style={[typography.bodyMedium, styles.rowName]}>{m.name}</Text>
                {m.status === 'joined' ? (
                  <Chip label="Joined" variant="success" />
                ) : (
                  <Chip label="Pending — tap to nudge" variant="warning" onPress={() => handleForceJoin(m.id, m.name)} />
                )}
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={[typography.caption, styles.sectionLabel]}>Invite a friend</Text>
          {available.length === 0 ? (
            <Text style={[typography.body, styles.emptyText]}>Everyone’s already in this vault!</Text>
          ) : (
            available.map((p) => (
              <View key={p.id} style={styles.row}>
                <Avatar emoji={p.avatarEmoji} size={40} />
                <Text style={[typography.bodyMedium, styles.rowName]}>{p.name}</Text>
                <Button label="Invite" size="sm" variant="ghost" onPress={() => handleInvite(p.id, p.name)} />
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}
