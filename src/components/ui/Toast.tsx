import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { radii, spacing, typography, type ColorPalette } from '@/src/theme/tokens';
import { useThemeColors } from '@/src/theme/useThemeColors';
import { useUiStore, type ToastItem } from '@/src/store/useUiStore';

const ICONS: Record<ToastItem['variant'], string> = {
  success: '✅',
  info: 'ℹ️',
  error: '⚠️',
};

function ToastBubble({ toast, colors }: { toast: ToastItem; colors: ColorPalette }) {
  const dismissToast = useUiStore((s) => s.dismissToast);

  useEffect(() => {
    const timer = setTimeout(() => dismissToast(toast.id), toast.duration ?? 2800);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, dismissToast]);

  const styles = StyleSheet.create({
    bubble: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      backgroundColor: colors.surface.cardDark,
      borderRadius: radii.lg,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
    },
    icon: { fontSize: 16 },
    message: { color: colors.text.inverse, flexShrink: 1 },
  });

  return (
    <Animated.View entering={FadeInDown.springify().damping(16)} exiting={FadeOutUp} style={styles.bubble}>
      <Text style={styles.icon}>{ICONS[toast.variant]}</Text>
      <Text style={[typography.bodyMedium, styles.message]}>{toast.message}</Text>
    </Animated.View>
  );
}

export function ToastHost() {
  const colors = useThemeColors();
  const toasts = useUiStore((s) => s.toasts);
  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    host: { position: 'absolute', left: spacing.lg, right: spacing.lg, gap: spacing.sm, zIndex: 100 },
  });

  if (toasts.length === 0) return null;

  return (
    <View pointerEvents="box-none" style={[styles.host, { top: insets.top + spacing.sm }]}>
      {toasts.map((toast) => (
        <ToastBubble key={toast.id} toast={toast} colors={colors} />
      ))}
    </View>
  );
}
