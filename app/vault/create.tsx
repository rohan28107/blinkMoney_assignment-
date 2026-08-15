import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, Platform, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Screen } from '@/src/components/ui/Screen';
import { TextField } from '@/src/components/ui/TextField';
import { Button } from '@/src/components/ui/Button';
import { Chip } from '@/src/components/ui/Chip';
import { useVaultStore } from '@/src/store/useVaultStore';
import { spacing, typography, radii, vaultThemes, type VaultColorToken } from '@/src/theme/tokens';
import { useThemeColors } from '@/src/theme/useThemeColors';
import { clampAmount } from '@/src/lib/currency';
import { formatShortDate } from '@/src/lib/dates';

const SCREEN_WIDTH = Dimensions.get('window').width;

const EMOJI_OPTIONS = ['🏖️', '✈️', '🎉', '📱', '🎮', '🏠', '💍', '🎓', '🚗', '🎁'];
const COLOR_OPTIONS: VaultColorToken[] = ['forest', 'lime', 'sunset', 'ocean', 'berry'];
const DEADLINE_OPTIONS: { label: string; months: number | null }[] = [
  { label: '1 month', months: 1 },
  { label: '3 months', months: 3 },
  { label: '6 months', months: 6 },
  { label: 'No deadline', months: null },
];

function monthsFromNow(months: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toISOString();
}

function startOfTomorrow(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function CreateVaultScreen() {
  const router = useRouter();
  const createVault = useVaultStore((s) => s.createVault);
  const colors = useThemeColors();

  const [name, setName] = useState('');
  const [amountText, setAmountText] = useState('');
  const [emoji, setEmoji] = useState(EMOJI_OPTIONS[0]);
  const [colorToken, setColorToken] = useState<VaultColorToken>('forest');
  const [deadlineIdx, setDeadlineIdx] = useState<number | null>(1);
  const [customDate, setCustomDate] = useState<Date | null>(null);
  const [draftDate, setDraftDate] = useState<Date>(() => startOfTomorrow());
  const [pickerVisible, setPickerVisible] = useState(false);
  const [touched, setTouched] = useState(false);

  const tomorrow = useMemo(() => startOfTomorrow(), []);
  const amount = clampAmount(Number(amountText.replace(/[^0-9]/g, '')) || 0);
  const isValid = name.trim().length > 0 && amount > 0;

  const selectPreset = (idx: number) => {
    setDeadlineIdx(idx);
    setCustomDate(null);
  };

  const openCustomPicker = () => {
    setDraftDate(customDate ?? tomorrow);
    setPickerVisible(true);
  };

  const confirmCustomDate = () => {
    setCustomDate(draftDate);
    setDeadlineIdx(null);
    setPickerVisible(false);
  };

  const handleAndroidChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setPickerVisible(false);
    if (event.type === 'set' && selectedDate) {
      setCustomDate(selectedDate);
      setDeadlineIdx(null);
    }
  };

  const handleCreate = () => {
    setTouched(true);
    if (!isValid) return;
    const targetDate = customDate
      ? customDate.toISOString()
      : deadlineIdx !== null && DEADLINE_OPTIONS[deadlineIdx].months
        ? monthsFromNow(DEADLINE_OPTIONS[deadlineIdx].months as number)
        : undefined;
    const id = createVault({ name, emoji, colorToken, targetAmount: amount, targetDate });
    router.replace({ pathname: '/vault/[id]', params: { id } });
  };

  const styles = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.xl },
    content: { paddingHorizontal: spacing.xl, gap: spacing.lg, paddingBottom: spacing['3xl'] },
    section: { gap: spacing.sm },
    sectionLabel: { color: colors.text.secondary },
    emojiRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
    emojiOption: {
      width: 48,
      height: 48,
      borderRadius: radii.md,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface.canvas,
      borderWidth: 1.5,
      borderColor: 'transparent',
    },
    emojiOptionSelected: { borderColor: colors.brand.forest, backgroundColor: colors.brand.limeSoft },
    emojiText: { fontSize: 22 },
    colorRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
    colorSwatch: {
      width: 36,
      height: 36,
      borderRadius: 18,
      borderWidth: 2,
      borderColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
    },
    colorSwatchSelected: { borderColor: colors.brand.lime, borderWidth: 3 },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
    footer: { padding: spacing.xl, borderTopWidth: 1, borderTopColor: colors.border },
    pickerBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: colors.surface.overlay },
    pickerSheet: { backgroundColor: colors.surface.card, borderTopLeftRadius: radii.xl, borderTopRightRadius: radii.xl, paddingBottom: spacing['2xl'] },
    pickerHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    pickerCancel: { color: colors.text.secondary },
    pickerDone: { color: colors.brand.lime },
    pickerContainer: { width: '100%', alignItems: 'center' },
    picker: { width: SCREEN_WIDTH, height: 216 },
  });

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <Text style={[typography.h2, { color: colors.text.primary }]}>New Squad Vault</Text>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="close" size={26} color={colors.text.primary} />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TextField
          label="What are you saving for?"
          value={name}
          onChangeText={setName}
          placeholder="e.g. Goa Trip 2026"
          error={touched && name.trim().length === 0 ? 'Give your vault a name' : undefined}
          maxLength={40}
        />
        <TextField
          label="Target amount"
          value={amountText}
          onChangeText={setAmountText}
          placeholder="0"
          prefix="₹"
          keyboardType="number-pad"
          error={touched && amount <= 0 ? 'Enter an amount greater than ₹0' : undefined}
        />

        <View style={styles.section}>
          <Text style={[typography.caption, styles.sectionLabel]}>Cover</Text>
          <View style={styles.emojiRow}>
            {EMOJI_OPTIONS.map((e) => (
              <Pressable
                key={e}
                onPress={() => setEmoji(e)}
                style={[styles.emojiOption, emoji === e && styles.emojiOptionSelected]}
              >
                <Text style={styles.emojiText}>{e}</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.colorRow}>
            {COLOR_OPTIONS.map((c) => (
              <Pressable
                key={c}
                onPress={() => setColorToken(c)}
                style={[styles.colorSwatch, { backgroundColor: vaultThemes[c].bg }, colorToken === c && styles.colorSwatchSelected]}
              >
                {colorToken === c && <Ionicons name="checkmark" size={16} color={vaultThemes[c].onBg} />}
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[typography.caption, styles.sectionLabel]}>Deadline</Text>
          <View style={styles.chipRow}>
            {DEADLINE_OPTIONS.map((opt, idx) => (
              <Chip key={opt.label} label={opt.label} selected={deadlineIdx === idx} onPress={() => selectPreset(idx)} />
            ))}
            <Chip
              label={customDate ? formatShortDate(customDate.toISOString()) : 'Custom date'}
              selected={customDate !== null}
              icon={<Ionicons name="calendar-outline" size={14} color={customDate ? colors.text.primary : colors.text.secondary} />}
              onPress={openCustomPicker}
            />
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button label="Create Vault" onPress={handleCreate} fullWidth disabled={touched && !isValid} />
      </View>

      {Platform.OS === 'android' && pickerVisible && (
        <DateTimePicker value={draftDate} mode="date" display="default" minimumDate={tomorrow} onChange={handleAndroidChange} />
      )}

      {Platform.OS === 'ios' && (
        <Modal visible={pickerVisible} transparent animationType="slide" onRequestClose={() => setPickerVisible(false)}>
          <View style={styles.pickerBackdrop}>
            <View style={styles.pickerSheet}>
              <View style={styles.pickerHeader}>
                <Pressable onPress={() => setPickerVisible(false)} hitSlop={8}>
                  <Text style={[typography.bodyMedium, styles.pickerCancel]}>Cancel</Text>
                </Pressable>
                <Text style={[typography.h3, { color: colors.text.primary }]}>Pick a deadline</Text>
                <Pressable onPress={confirmCustomDate} hitSlop={8}>
                  <Text style={[typography.bodyMedium, styles.pickerDone]}>Done</Text>
                </Pressable>
              </View>
              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={draftDate}
                  mode="date"
                  display="spinner"
                  minimumDate={tomorrow}
                  textColor={colors.text.primary}
                  onChange={(_event, selectedDate) => {
                    if (selectedDate) setDraftDate(selectedDate);
                  }}
                  style={styles.picker}
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </Screen>
  );
}
