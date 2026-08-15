import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacing, typography } from '@/src/theme/tokens';
import { useThemeColors } from '@/src/theme/useThemeColors';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  onCtaPress?: () => void;
}

export function EmptyState({ icon = '✨', title, subtitle, ctaLabel, onCtaPress }: EmptyStateProps) {
  const colors = useThemeColors();
  const styles = StyleSheet.create({
    container: { alignItems: 'center', justifyContent: 'center', padding: spacing['3xl'], gap: spacing.sm },
    icon: { fontSize: 48, marginBottom: spacing.sm },
    title: { color: colors.text.primary, textAlign: 'center' },
    subtitle: { color: colors.text.secondary, textAlign: 'center' },
    cta: { marginTop: spacing.lg },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[typography.h2, styles.title]}>{title}</Text>
      {subtitle && <Text style={[typography.body, styles.subtitle]}>{subtitle}</Text>}
      {ctaLabel && onCtaPress && (
        <Button label={ctaLabel} onPress={onCtaPress} variant="primary" style={styles.cta} />
      )}
    </View>
  );
}
