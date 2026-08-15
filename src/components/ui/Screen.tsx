import React from 'react';
import { Keyboard, StyleSheet, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { useThemeColors } from '@/src/theme/useThemeColors';

interface ScreenProps {
  children: React.ReactNode;
  tone?: 'canvas' | 'dark';
  edges?: readonly Edge[];
  style?: ViewStyle;
  /** Tap anywhere outside a focused input to dismiss the keyboard. On by default. */
  dismissKeyboardOnTap?: boolean;
}

export function Screen({
  children,
  tone = 'canvas',
  edges = ['top', 'left', 'right'],
  style,
  dismissKeyboardOnTap = true,
}: ScreenProps) {
  const colors = useThemeColors();
  const styles = StyleSheet.create({
    container: { flex: 1 },
  });

  const content = dismissKeyboardOnTap ? (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>{children}</View>
    </TouchableWithoutFeedback>
  ) : (
    children
  );

  return (
    <SafeAreaView
      edges={edges as Edge[]}
      style={[
        styles.container,
        { backgroundColor: tone === 'dark' ? colors.surface.cardDark : colors.surface.canvas },
        style,
      ]}
    >
      {content}
    </SafeAreaView>
  );
}
