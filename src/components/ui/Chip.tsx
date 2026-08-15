import React from 'react';
import { Pressable, Text, View, StyleSheet, type ViewStyle } from 'react-native';
import { radii, spacing, typography } from '@/src/theme/tokens';
import { useThemeColors } from '@/src/theme/useThemeColors';

type ChipVariant = 'neutral' | 'success' | 'warning' | 'danger' | 'lime';

interface ChipProps {
  label: string;
  variant?: ChipVariant;
  selected?: boolean;
  onPress?: () => void;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export function Chip({ label, variant = 'neutral', selected, onPress, icon, style }: ChipProps) {
  const colors = useThemeColors();

  const styles = StyleSheet.create({
    base: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: radii.pill,
      alignSelf: 'flex-start',
    },
    selected: { borderWidth: 1.5, borderColor: colors.brand.forest },
    pressed: { opacity: 0.7 },
  });

  const variantStyles: Record<ChipVariant, { container: ViewStyle; text: { color: string } }> = {
    neutral: { container: { backgroundColor: colors.surface.canvas, borderWidth: 1, borderColor: colors.border }, text: { color: colors.text.secondary } },
    success: { container: { backgroundColor: colors.semantic.successSoft }, text: { color: colors.semantic.success } },
    warning: { container: { backgroundColor: colors.semantic.warningSoft }, text: { color: colors.semantic.warning } },
    danger: { container: { backgroundColor: colors.semantic.dangerSoft }, text: { color: colors.semantic.danger } },
    lime: { container: { backgroundColor: colors.brand.limeSoft }, text: { color: colors.brand.limeDark } },
  };

  const v = variantStyles[variant];
  const content = (
    <View style={[styles.base, v.container, selected && styles.selected, style]}>
      {icon}
      <Text style={[typography.caption, v.text, { fontFamily: typography.caption.fontFamily }]}>{label}</Text>
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      {content}
    </Pressable>
  );
}
