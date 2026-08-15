import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { Screen } from '@/src/components/ui/Screen';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { useUiStore } from '@/src/store/useUiStore';
import { spacing, typography } from '@/src/theme/tokens';
import { useThemeColors } from '@/src/theme/useThemeColors';
import { formatINR } from '@/src/lib/currency';
import { MOCK_PORTFOLIO } from '@/src/lib/mockPortfolio';

const MAX_BORROW_PERCENT = 0.8;
const INTEREST_RATE = 9.99;

export default function BorrowScreen() {
  const showToast = useUiStore((s) => s.showToast);
  const colors = useThemeColors();
  const availableCredit = Math.round(MOCK_PORTFOLIO.current * MAX_BORROW_PERCENT);

  const styles = StyleSheet.create({
    content: { padding: spacing.xl, gap: spacing.lg, paddingBottom: spacing['5xl'] },
    hero: { gap: 4 },
    heroLabel: { color: colors.text.inverseMuted },
    heroValue: { color: colors.text.inverse },
    heroGain: { color: colors.brand.lime },
    section: { gap: spacing.sm },
    sectionBody: { color: colors.text.secondary },
  });

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[typography.h1, { color: colors.text.primary }]}>Borrow</Text>
        <Card tone="dark" style={styles.hero}>
          <Text style={[typography.caption, styles.heroLabel]}>Available to borrow</Text>
          <Text style={[typography.display, styles.heroValue]}>{formatINR(availableCredit)}</Text>
          <Text style={[typography.bodyMedium, styles.heroGain]}>
            at {INTEREST_RATE}% p.a. · against your portfolio
          </Text>
        </Card>
        <Card variant="outlined" style={styles.section}>
          <Text style={[typography.h3, { color: colors.text.primary }]}>Borrow without selling</Text>
          <Text style={[typography.body, styles.sectionBody]}>
            Get cash instantly against your investments — up to 80% of their value — while they stay invested and keep
            compounding.
          </Text>
        </Card>
        <Button
          label="Explore Loan Against Mutual Funds"
          variant="secondary"
          fullWidth
          onPress={() => showToast({ message: 'Loan against mutual funds — coming soon', variant: 'info' })}
        />
      </ScrollView>
    </Screen>
  );
}
