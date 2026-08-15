/**
 * BlinkMoney design tokens — dark palette calibrated against real app screenshots
 * (near-black canvas throughout, lime-green accent, dark elevated cards).
 * Light palette is an original design keeping the same brand accent, since the
 * reference app is dark-only; it exists so the in-app theme toggle has a real
 * second mode to switch to.
 */

export interface ColorPalette {
  brand: {
    forest: string;
    forestDark: string;
    lime: string;
    limeDark: string;
    limeSoft: string;
  };
  surface: {
    canvas: string;
    card: string;
    cardDark: string;
    overlay: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
    inverseMuted: string;
    onLime: string;
  };
  progress: {
    saved: string;
    grown: string;
    track: string;
    trackDark: string;
  };
  semantic: {
    success: string;
    successSoft: string;
    warning: string;
    warningSoft: string;
    danger: string;
    dangerSoft: string;
    info: string;
    infoSoft: string;
  };
  border: string;
  borderDark: string;
}

export const darkColors: ColorPalette = {
  brand: {
    forest: '#1B2E1C',
    forestDark: '#0F1C10',
    lime: '#A6E845',
    limeDark: '#7DBF2E',
    limeSoft: '#22301B',
  },
  surface: {
    canvas: '#0A0F0A',
    card: '#141C15',
    cardDark: '#050805',
    overlay: 'rgba(0,0,0,0.6)',
  },
  text: {
    primary: '#F5F7F2',
    secondary: '#94A294',
    tertiary: '#5E6B5E',
    // "inverse" is for text on surface.cardDark, which is dark in BOTH themes —
    // it must stay light/white here too, not flip to dark like primary did.
    inverse: '#FFFFFF',
    inverseMuted: 'rgba(255,255,255,0.72)',
    onLime: '#12200F',
  },
  progress: {
    saved: '#A6E845',
    grown: '#567b5a',
    track: '#212B22',
    trackDark: 'rgba(255,255,255,0.1)',
  },
  semantic: {
    success: '#6FCF6F',
    successSoft: '#16281A',
    warning: '#E8B84B',
    warningSoft: '#2E2412',
    danger: '#E8685A',
    dangerSoft: '#301616',
    info: '#7FB4E8',
    infoSoft: '#16223A',
  },
  border: 'rgba(255,255,255,0.1)',
  borderDark: 'rgba(255,255,255,0.16)',
};

export const lightColors: ColorPalette = {
  brand: {
    forest: '#0E2B20',
    forestDark: '#081C14',
    lime: '#A6E845',
    limeDark: '#7DBF2E',
    limeSoft: '#E4F9D1',
  },
  surface: {
    canvas: '#F7F9F6',
    card: '#FFFFFF',
    cardDark: '#0E2B20',
    overlay: 'rgba(8,28,20,0.55)',
  },
  text: {
    primary: '#101915',
    secondary: '#5B6B62',
    tertiary: '#93A199',
    inverse: '#FFFFFF',
    inverseMuted: 'rgba(255,255,255,0.72)',
    onLime: '#12200F',
  },
  progress: {
    saved: '#A6E845',
    grown: '#567b5a',
    track: '#E7ECE5',
    trackDark: 'rgba(255,255,255,0.16)',
  },
  semantic: {
    success: '#2FAE60',
    successSoft: '#E3F5E9',
    warning: '#E2A93B',
    warningSoft: '#FBF0DC',
    danger: '#E1543D',
    dangerSoft: '#FBE5E1',
    info: '#3B82C4',
    infoSoft: '#E3EFF9',
  },
  border: '#E3E8E1',
  borderDark: 'rgba(255,255,255,0.14)',
};

// Cover-color themes vaults can pick from — kept identical across light/dark app
// theme since these cards are self-contained brand accents, not app surfaces.
export const vaultThemes = {
  forest: { bg: '#0E2B20', accent: '#8CE84A', onBg: '#FFFFFF' },
  lime: { bg: '#EBFAD6', accent: '#4E9B1F', onBg: '#173316' },
  sunset: { bg: '#3A2115', accent: '#FF9B54', onBg: '#FFFFFF' },
  ocean: { bg: '#0F2A38', accent: '#4FC3E0', onBg: '#FFFFFF' },
  berry: { bg: '#33132A', accent: '#F072B6', onBg: '#FFFFFF' },
} as const;

export type VaultColorToken = keyof typeof vaultThemes;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
} as const;

export const radii = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

export const fontFamily = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semiBold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extraBold: 'PlusJakartaSans_800ExtraBold',
} as const;

export const typography = {
  display: { fontFamily: fontFamily.extraBold, fontSize: 32, lineHeight: 38 },
  h1: { fontFamily: fontFamily.bold, fontSize: 26, lineHeight: 32 },
  h2: { fontFamily: fontFamily.bold, fontSize: 22, lineHeight: 28 },
  h3: { fontFamily: fontFamily.semiBold, fontSize: 18, lineHeight: 24 },
  body: { fontFamily: fontFamily.regular, fontSize: 15, lineHeight: 21 },
  bodyMedium: { fontFamily: fontFamily.medium, fontSize: 15, lineHeight: 21 },
  caption: { fontFamily: fontFamily.medium, fontSize: 13, lineHeight: 18 },
  micro: { fontFamily: fontFamily.semiBold, fontSize: 11, lineHeight: 14, letterSpacing: 0.4 },
} as const;

export const shadow = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.24,
    shadowRadius: 16,
    elevation: 3,
  },
  floating: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.32,
    shadowRadius: 24,
    elevation: 8,
  },
} as const;

export const milestoneTiers = [25, 50, 75, 100] as const;
export type MilestoneTier = (typeof milestoneTiers)[number];
