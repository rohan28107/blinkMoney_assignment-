import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { typography } from '@/src/theme/tokens';
import { useThemeColors } from '@/src/theme/useThemeColors';

interface AvatarProps {
  emoji: string;
  size?: number;
  ringColor?: string;
}

export function Avatar({ emoji, size = 40, ringColor }: AvatarProps) {
  const colors = useThemeColors();
  const styles = StyleSheet.create({
    base: { backgroundColor: colors.brand.limeSoft, alignItems: 'center', justifyContent: 'center' },
  });

  return (
    <View
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: ringColor ? 2 : 0,
          borderColor: ringColor,
        },
      ]}
    >
      <Text style={{ fontSize: size * 0.5 }}>{emoji}</Text>
    </View>
  );
}

interface AvatarStackProps {
  items: { id: string; emoji: string }[];
  max?: number;
  size?: number;
}

export function AvatarStack({ items, max = 4, size = 32 }: AvatarStackProps) {
  const colors = useThemeColors();
  const styles = StyleSheet.create({
    stack: { flexDirection: 'row', alignItems: 'center' },
    overflowBadge: {
      backgroundColor: colors.brand.forest,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: colors.surface.card,
    },
    overflowText: { color: colors.text.inverse, fontSize: 11 },
  });

  const visible = items.slice(0, max);
  const overflow = items.length - visible.length;

  return (
    <View style={styles.stack}>
      {visible.map((item, index) => (
        <View key={item.id} style={{ marginLeft: index === 0 ? 0 : -size * 0.35, zIndex: visible.length - index }}>
          <Avatar emoji={item.emoji} size={size} ringColor={colors.surface.card} />
        </View>
      ))}
      {overflow > 0 && (
        <View
          style={[
            styles.overflowBadge,
            { width: size, height: size, borderRadius: size / 2, marginLeft: -size * 0.35 },
          ]}
        >
          <Text style={[typography.caption, styles.overflowText]}>+{overflow}</Text>
        </View>
      )}
    </View>
  );
}
