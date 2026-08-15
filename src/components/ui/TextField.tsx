import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, type KeyboardTypeOptions } from 'react-native';
import { radii, spacing, typography } from '@/src/theme/tokens';
import { useThemeColors } from '@/src/theme/useThemeColors';

interface TextFieldProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  keyboardType?: KeyboardTypeOptions;
  prefix?: string;
  multiline?: boolean;
  maxLength?: number;
  autoFocus?: boolean;
  editable?: boolean;
}

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  helperText,
  keyboardType,
  prefix,
  multiline,
  maxLength,
  autoFocus,
  editable = true,
}: TextFieldProps) {
  const colors = useThemeColors();
  const [focused, setFocused] = useState(false);

  const styles = StyleSheet.create({
    container: { gap: spacing.xs },
    label: { color: colors.text.secondary },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface.card,
      borderRadius: radii.md,
      borderWidth: 1.5,
      borderColor: colors.border,
      paddingHorizontal: spacing.lg,
    },
    inputRowFocused: { borderColor: colors.brand.forest },
    inputRowError: { borderColor: colors.semantic.danger },
    inputRowMultiline: { paddingVertical: spacing.md },
    inputRowDisabled: { opacity: 0.5 },
    prefix: { color: colors.text.secondary, marginRight: spacing.xs },
    input: { flex: 1, paddingVertical: 14, color: colors.text.primary },
    inputMultiline: { paddingVertical: 0, minHeight: 80, textAlignVertical: 'top' },
    errorText: { color: colors.semantic.danger },
    helperText: { color: colors.text.tertiary },
  });

  return (
    <View style={styles.container}>
      {label && <Text style={[typography.caption, styles.label]}>{label}</Text>}
      <View
        style={[
          styles.inputRow,
          focused && styles.inputRowFocused,
          error && styles.inputRowError,
          multiline && styles.inputRowMultiline,
          !editable && styles.inputRowDisabled,
        ]}
      >
        {prefix && <Text style={[typography.h3, styles.prefix]}>{prefix}</Text>}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.text.tertiary}
          keyboardType={keyboardType}
          multiline={multiline}
          maxLength={maxLength}
          autoFocus={autoFocus}
          editable={editable}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[typography.h3, styles.input, multiline && styles.inputMultiline]}
        />
      </View>
      {(error || helperText) && (
        <Text style={[typography.caption, error ? styles.errorText : styles.helperText]}>{error ?? helperText}</Text>
      )}
    </View>
  );
}
