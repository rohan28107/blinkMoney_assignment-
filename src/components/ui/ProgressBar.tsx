import React from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { useThemeColors } from '@/src/theme/useThemeColors';

interface ProgressBarProps {
  percent: number;
  color?: string;
  trackColor?: string;
  height?: number;
  style?: ViewStyle;
}

export function ProgressBar({
  percent,
  color,
  trackColor,
  height = 6,
  style,
}: ProgressBarProps) {
  const colors = useThemeColors();
  const resolvedColor = color ?? colors.brand.forest;
  const resolvedTrackColor = trackColor ?? colors.progress.track;

  const styles = StyleSheet.create({
    track: { width: '100%', overflow: 'hidden' },
    fill: { height: '100%' },
  });

  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <View style={[styles.track, { backgroundColor: resolvedTrackColor, height, borderRadius: height / 2 }, style]}>
      <View style={[styles.fill, { width: `${clamped}%`, backgroundColor: resolvedColor, borderRadius: height / 2 }]} />
    </View>
  );
}
