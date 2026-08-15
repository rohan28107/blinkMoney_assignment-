import React from 'react';
import { View, Pressable, StyleSheet, type ViewStyle } from 'react-native';
import { radii, shadow, spacing } from '@/src/theme/tokens';
import { useThemeColors } from '@/src/theme/useThemeColors';

interface CardProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'flat' | 'outlined';
  tone?: 'light' | 'dark';
  onPress?: () => void;
  style?: ViewStyle;
  padded?: boolean;
}

export function Card({ children, variant = 'elevated', tone = 'light', onPress, style, padded = true }: CardProps) {
  const colors = useThemeColors();
  const styles = StyleSheet.create({
    base: { borderRadius: radii.lg },
    padded: { padding: spacing.lg },
    light: { backgroundColor: colors.surface.card },
    dark: { backgroundColor: colors.surface.cardDark },
    outlined: { borderWidth: 1, borderColor: colors.border },
    pressed: { opacity: 0.85 },
  });

  const containerStyle = [
    styles.base,
    padded && styles.padded,
    tone === 'dark' ? styles.dark : styles.light,
    variant === 'elevated' && shadow.card,
    variant === 'outlined' && styles.outlined,
    style,
  ];

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [...containerStyle, pressed && styles.pressed]}>
        {children}
      </Pressable>
    );
  }

  return <View style={containerStyle}>{children}</View>;
}
