import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, View, type ViewStyle, type TextStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { radii, spacing, typography } from '@/src/theme/tokens';
import { useThemeColors } from '@/src/theme/useThemeColors';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  haptic?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  fullWidth,
  leftIcon,
  rightIcon,
  style,
  haptic = true,
}: ButtonProps) {
  const colors = useThemeColors();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const isDisabled = Boolean(disabled || loading);

  const handlePress = () => {
    if (isDisabled) return;
    if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  const variantStyles: Record<Variant, { container: ViewStyle; text: TextStyle }> = {
    primary: { container: { backgroundColor: colors.brand.lime }, text: { color: colors.text.onLime } },
    secondary: { container: { backgroundColor: colors.brand.forest }, text: { color: colors.text.inverse } },
    ghost: {
      container: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.border },
      text: { color: colors.text.primary },
    },
    danger: { container: { backgroundColor: colors.semantic.dangerSoft }, text: { color: colors.semantic.danger } },
  };

  const v = variantStyles[variant];
  const s = sizeStyles[size];

  const styles = StyleSheet.create({
    base: { borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center' },
    content: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    disabled: { opacity: 0.5 },
    fullWidth: { alignSelf: 'stretch' },
  });

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={() => {
        scale.value = withTiming(0.96, { duration: 100 });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 150 });
      }}
      disabled={isDisabled}
      style={[
        styles.base,
        v.container,
        s.container,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        animatedStyle,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.text.color} />
      ) : (
        <View style={styles.content}>
          {leftIcon}
          <Text style={[s.text, v.text]}>{label}</Text>
          {rightIcon}
        </View>
      )}
    </AnimatedPressable>
  );
}

const sizeStyles: Record<Size, { container: ViewStyle; text: TextStyle }> = {
  sm: {
    container: { paddingVertical: 8, paddingHorizontal: 16 },
    text: { ...typography.caption, fontFamily: typography.bodyMedium.fontFamily },
  },
  md: { container: { paddingVertical: 14, paddingHorizontal: 22 }, text: typography.bodyMedium },
  lg: { container: { paddingVertical: 17, paddingHorizontal: 28 }, text: typography.h3 },
};
