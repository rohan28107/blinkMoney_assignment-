import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { HapticTab } from '@/components/haptic-tab';
import { useThemeColors } from '@/src/theme/useThemeColors';
import { typography, type ColorPalette } from '@/src/theme/tokens';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

function TabIcon({
  focused,
  iconName,
  iconNameOutline,
  label,
  colors,
}: {
  focused: boolean;
  iconName: IoniconName;
  iconNameOutline: IoniconName;
  label: string;
  colors: ColorPalette;
}) {
  if (focused) {
    return (
      <View style={[styles.tabPillActive, { backgroundColor: colors.brand.lime }]}>
        <Ionicons name={iconName} size={15} color={colors.text.onLime} />
        <Text
          style={[typography.caption, styles.tabLabelActive, { color: colors.text.onLime }]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.75}
        >
          {label}
        </Text>
      </View>
    );
  }
  return (
    <View style={styles.tabStackInactive}>
      <Ionicons name={iconNameOutline} size={22} color={colors.text.secondary} />
      <Text
        style={[typography.micro, styles.tabLabelInactive, { color: colors.text.secondary }]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  const colors = useThemeColors();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: false,
        tabBarStyle: { backgroundColor: colors.surface.card, borderTopColor: colors.border },
        tabBarItemStyle: { paddingTop: 6 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="home" iconNameOutline="home-outline" label="Home" colors={colors} />
          ),
        }}
      />
      <Tabs.Screen
        name="vaults"
        options={{
          title: 'Vaults',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="people" iconNameOutline="people-outline" label="Vaults" colors={colors} />
          ),
        }}
      />
      <Tabs.Screen
        name="grow"
        options={{
          title: 'Grow',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="trending-up" iconNameOutline="trending-up-outline" label="Grow" colors={colors} />
          ),
        }}
      />
      <Tabs.Screen
        name="borrow"
        options={{
          title: 'Borrow',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="wallet" iconNameOutline="wallet-outline" label="Borrow" colors={colors} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="person" iconNameOutline="person-outline" label="Profile" colors={colors} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabPillActive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderRadius: 999,
    maxWidth: '100%',
  },
  tabLabelActive: { fontSize: 12, flexShrink: 1 },
  tabStackInactive: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  tabLabelInactive: { fontSize: 10 },
});
