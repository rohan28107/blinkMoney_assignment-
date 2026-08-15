import { useThemeStore } from '@/src/store/useThemeStore';
import { darkColors, lightColors, type ColorPalette } from './tokens';

export function useThemeColors(): ColorPalette {
  const mode = useThemeStore((s) => s.mode);
  return mode === 'dark' ? darkColors : lightColors;
}
