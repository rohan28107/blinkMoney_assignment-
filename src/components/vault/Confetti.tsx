import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withDelay, withTiming, Easing } from 'react-native-reanimated';
import { useThemeColors } from '@/src/theme/useThemeColors';

function ConfettiPiece({
  index,
  height,
  particleColors,
}: {
  index: number;
  height: number;
  particleColors: string[];
}) {
  const progress = useSharedValue(0);

  const config = useMemo(
    () => ({
      left: Math.random() * 100,
      color: particleColors[index % particleColors.length],
      delay: Math.random() * 300,
      duration: 1600 + Math.random() * 900,
      rotateStart: Math.random() * 360,
      drift: (Math.random() - 0.5) * 140,
      size: 6 + Math.random() * 6,
    }),
    [index, particleColors]
  );

  useEffect(() => {
    progress.value = withDelay(config.delay, withTiming(1, { duration: config.duration, easing: Easing.out(Easing.quad) }));
  }, [config, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = progress.value * (height + 40) - 20;
    const translateX = progress.value * config.drift;
    const rotate = config.rotateStart + progress.value * 540;
    const opacity = progress.value > 0.8 ? 1 - (progress.value - 0.8) / 0.2 : 1;
    return { transform: [{ translateY }, { translateX }, { rotate: `${rotate}deg` }], opacity };
  });

  return (
    <Animated.View
      style={[
        styles.piece,
        { left: `${config.left}%`, width: config.size, height: config.size * 1.6, backgroundColor: config.color },
        animatedStyle,
      ]}
    />
  );
}

export function Confetti({ count = 36 }: { count?: number }) {
  const { height } = useWindowDimensions();
  const colors = useThemeColors();
  const particleColors = [
    colors.brand.lime,
    colors.brand.forest,
    colors.semantic.warning,
    colors.semantic.info,
    '#FF9B54',
    '#F072B6',
  ];

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {Array.from({ length: count }).map((_, i) => (
        <ConfettiPiece key={i} index={i} height={height} particleColors={particleColors} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  piece: { position: 'absolute', top: -20, borderRadius: 2 },
});
