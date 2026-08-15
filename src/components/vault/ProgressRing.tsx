import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withTiming, Easing } from 'react-native-reanimated';
import { useThemeColors } from '@/src/theme/useThemeColors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
  size?: number;
  strokeWidth?: number;
  /** 0-100, already clamped by the caller (see toRingPercents in src/lib/progress.ts) */
  savedPercent: number;
  /** 0-100, on top of savedPercent */
  grownPercent: number;
  trackColor?: string;
  savedColor?: string;
  grownColor?: string;
  children?: React.ReactNode;
}

export function ProgressRing({
  size = 160,
  strokeWidth = 14,
  savedPercent,
  grownPercent,
  trackColor,
  savedColor,
  grownColor,
  children,
}: ProgressRingProps) {
  const colors = useThemeColors();
  const resolvedTrackColor = trackColor ?? colors.progress.track;
  const resolvedSavedColor = savedColor ?? colors.progress.saved;
  const resolvedGrownColor = grownColor ?? colors.progress.grown;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const savedProgress = useSharedValue(0);
  const grownProgress = useSharedValue(0);

  useEffect(() => {
    savedProgress.value = withTiming(savedPercent, { duration: 900, easing: Easing.out(Easing.cubic) });
    grownProgress.value = withTiming(grownPercent, { duration: 900, easing: Easing.out(Easing.cubic) });
  }, [savedPercent, grownPercent, savedProgress, grownProgress]);

  const savedAnimatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - savedProgress.value / 100),
  }));

  const grownLength = useAnimatedProps(() => {
    const segment = (circumference * grownProgress.value) / 100;
    return {
      strokeDasharray: `${segment} ${Math.max(circumference - segment, 0)}`,
      strokeDashoffset: -(circumference * savedProgress.value) / 100,
    };
  });

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <G rotation={-90} origin={`${size / 2}, ${size / 2}`}>
          <Circle cx={size / 2} cy={size / 2} r={radius} stroke={resolvedTrackColor} strokeWidth={strokeWidth} fill="none" />
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={resolvedSavedColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            animatedProps={savedAnimatedProps}
          />
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={resolvedGrownColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            animatedProps={grownLength}
          />
        </G>
      </Svg>
      {children}
    </View>
  );
}
