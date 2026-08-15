import React, { useEffect } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { radii } from '@/src/theme/tokens';
import { useThemeColors } from '@/src/theme/useThemeColors';

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  radius?: number;
  circle?: boolean;
  style?: ViewStyle;
}

export function Skeleton({ width = '100%', height = 16, radius = radii.sm, circle, style }: SkeletonProps) {
  const colors = useThemeColors();
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(withSequence(withTiming(1, { duration: 700 }), withTiming(0.5, { duration: 700 })), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const styles = StyleSheet.create({
    base: { backgroundColor: colors.border },
  });

  return (
    <Animated.View
      style={[
        styles.base,
        { width, height, borderRadius: circle ? height / 2 : radius },
        animatedStyle,
        style,
      ]}
    />
  );
}

export function SkeletonRow({ style }: { style?: ViewStyle }) {
  return (
    <View style={[rowStyles.row, style]}>
      <Skeleton circle width={48} height={48} />
      <View style={rowStyles.rowText}>
        <Skeleton width="60%" height={14} />
        <Skeleton width="40%" height={12} style={{ marginTop: 8 }} />
      </View>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  rowText: { flex: 1 },
});
