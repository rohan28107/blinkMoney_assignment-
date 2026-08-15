import { useEffect } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';

import { useVaultStore } from '@/src/store/useVaultStore';
import { useThemeStore } from '@/src/store/useThemeStore';
import { useThemeColors } from '@/src/theme/useThemeColors';
import { ToastHost } from '@/src/components/ui/Toast';
import { MilestoneCelebration } from '@/src/components/vault/MilestoneCelebration';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });
  const vaultHydrated = useVaultStore((s) => s.hasHydrated);
  const themeHydrated = useThemeStore((s) => s.hasHydrated);
  const mode = useThemeStore((s) => s.mode);
  const colors = useThemeColors();
  const ready = Boolean((fontsLoaded || fontError) && vaultHydrated && themeHydrated);

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: colors.surface.canvas }}>
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.surface.canvas } }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="vault/create" options={{ presentation: 'modal' }} />
            <Stack.Screen name="vault/[id]/index" />
            <Stack.Screen name="vault/[id]/contribute" options={{ presentation: 'modal' }} />
            <Stack.Screen name="vault/[id]/invite" options={{ presentation: 'modal' }} />
            <Stack.Screen name="vault/[id]/share-card" />
            <Stack.Screen name="preview/[id]" />
          </Stack>
          <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
          <ToastHost />
          <MilestoneCelebration />
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
