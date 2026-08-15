import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Screen } from '@/src/components/ui/Screen';
import { Card } from '@/src/components/ui/Card';
import { spacing, typography } from '@/src/theme/tokens';
import { useThemeColors } from '@/src/theme/useThemeColors';
import { formatINR } from '@/src/lib/currency';
import { MOCK_PORTFOLIO, portfolioGain } from '@/src/lib/mockPortfolio';

export default function GrowScreen() {
  const { gain, gainPercent } = portfolioGain();
  const colors = useThemeColors();

  const ALLOCATION = [
    { label: 'Stocks', percent: 45, color: colors.text.secondary },
    { label: 'Gold', percent: 25, color: colors.semantic.warning },
    { label: 'Fixed Deposits', percent: 20, color: colors.semantic.info },
    { label: 'F&O', percent: 10, color: colors.brand.lime },
  ];

  const styles = StyleSheet.create({
    content: { padding: spacing.xl, gap: spacing.lg, paddingBottom: spacing['5xl'] },
    hero: { gap: 4 },
    heroLabel: { color: colors.text.inverseMuted },
    heroValue: { color: colors.text.inverse },
    heroGain: { color: colors.brand.lime },
    section: { gap: spacing.md },
    sectionBody: { color: colors.text.secondary },
    allocationRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    allocationDot: { width: 10, height: 10, borderRadius: 5 },
    allocationLabel: { flex: 1, color: colors.text.secondary },
  });

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[typography.h1, { color: colors.text.primary }]}>Grow</Text>
        <Card tone="dark" style={styles.hero}>
          <Text style={[typography.caption, styles.heroLabel]}>Portfolio value</Text>
          <Text style={[typography.display, styles.heroValue]}>{formatINR(MOCK_PORTFOLIO.current)}</Text>
          <Text style={[typography.bodyMedium, styles.heroGain]}>
            +{formatINR(gain)} ({gainPercent.toFixed(1)}%) all-time
          </Text>
        </Card>

        <Card variant="outlined" style={styles.section}>
          <Text style={[typography.h3, { color: colors.text.primary }]}>Daily SIP</Text>
          <Text style={[typography.body, styles.sectionBody]}>
            Auto-investing {formatINR(MOCK_PORTFOLIO.dailySip)} every day, diversified automatically across stocks, gold and FDs.
          </Text>
        </Card>

        <Card variant="outlined" style={styles.section}>
          <Text style={[typography.h3, { color: colors.text.primary }]}>Allocation</Text>
          {ALLOCATION.map((a) => (
            <View key={a.label} style={styles.allocationRow}>
              <View style={[styles.allocationDot, { backgroundColor: a.color }]} />
              <Text style={[typography.body, styles.allocationLabel]}>{a.label}</Text>
              <Text style={[typography.bodyMedium, { color: colors.text.primary }]}>{a.percent}%</Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    </Screen>
  );
}
