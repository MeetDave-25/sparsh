import themesData from '@/data/themes.json';

export type ThemeId = string;

export interface ThemeColors {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  accent: string;
  accentLight: string;
  background: string;
  backgroundAlt: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textMuted: string;
  textLight: string;
  border: string;
  heroGradientFrom: string;
  heroGradientTo: string;
  heroBadge: string;
}

/**
 * Data-driven decorations for themes without hand-drawn artwork. Christmas,
 * Diwali, Valentine and Monsoon keep their bespoke scenes and omit this.
 */
export interface ThemeDecor {
  /** The full-screen particle layer. */
  particles?: {
    /** fall from the top, rise from the bottom, float gently, drift sideways (kites) or twinkle in place (stars). */
    motion: 'fall' | 'rise' | 'float' | 'drift' | 'twinkle';
    emoji?: string[];
    /** Soft coloured dots. */
    dots?: string[];
    /** Glowing dots as [core, halo] colour pairs. */
    glow?: [string, string][];
    /** Spinning paper confetti. */
    confetti?: string[];
    density?: number;
    max?: number;
    size?: [number, number];
    speed?: [number, number];
    spin?: boolean;
    opacity?: [number, number];
  };
  /** Occasional one-off effects: fireworks, Holi colour clouds, comic-book "POW!"s, shooting stars. */
  bursts?: {
    style: 'firework' | 'powder' | 'comic' | 'shooting';
    colors: string[];
    words?: string[];
    /** Min/max milliseconds between bursts. */
    every?: [number, number];
  };
  /** What hangs beneath the navbar: triangle bunting and/or swinging emoji. */
  garland?: { bunting?: string[]; items?: string[]; string?: string };
  /** Emoji shown in the bottom-left corner. */
  corner?: string[];
  /** Twinkling light colours along the top of the footer. */
  footerLights?: string[];
  footer?: 'snow';
}

export interface Theme {
  id: ThemeId;
  name: string;
  emoji: string;
  season: string;
  /** Heading the theme is listed under in admin. */
  group?: string;
  colors: ThemeColors;
  heroTitle: string;
  heroSubtitle: string;
  heroCTA: string;
  bannerText: string;
  active: boolean;
  decor?: ThemeDecor;
}

export function getAllThemes(): Theme[] {
  return themesData.themes as Theme[];
}

export function getActiveTheme(): Theme {
  const themes = getAllThemes();
  return themes.find(t => t.active) || themes[0];
}

export function getThemeById(id: string): Theme | undefined {
  return getAllThemes().find(t => t.id === id);
}

/** Whether a theme's palette is dark or light, from its background luminance. */
export function themeMode(theme: Theme): 'light' | 'dark' {
  const hex = theme.colors.background.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance < 0.4 ? 'dark' : 'light';
}

type RGB = [number, number, number];
const toRGB = (hex: string): RGB => {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as RGB;
};
const toHex = (c: RGB) => '#' + c.map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('');
const mix = (a: string, b: string, t: number) => {
  const [x, y] = [toRGB(a), toRGB(b)];
  return toHex(x.map((v, i) => v + (y[i] - v) * t) as RGB);
};
const rgba = (hex: string, alpha: number) => `rgba(${toRGB(hex).join(', ')}, ${alpha})`;

/**
 * Homepage, page-hero and navbar colours derived from a data-only theme. The
 * original five seasons have hand-tuned values in globals.css instead.
 */
function derivedPalette(theme: Theme): Record<string, string> {
  const { primary, primaryDark, accent } = theme.colors;
  const night = mix(primaryDark, '#000000', 0.82);
  const maroon = mix(primary, '#000000', 0.42);
  return {
    '--p-ivory': mix(primary, '#FFFFFF', 0.94),
    '--p-sand': mix(primary, '#FFFFFF', 0.8),
    '--p-ink': mix(primary, '#120806', 0.88),
    '--p-muted': mix(primary, '#3A2A24', 0.72),
    '--p-maroon': maroon,
    '--p-night': night,
    '--p-gold': accent,
    '--p-gold-text': mix(accent, '#000000', 0.45),
    '--p-glow': `linear-gradient(120deg, ${accent} 0%, ${primary} 100%)`,
    '--p-hero-bg': [
      `radial-gradient(ellipse 45% 55% at 70% 52%, ${rgba(primary, 0.5)} 0%, transparent 70%)`,
      `radial-gradient(ellipse 60% 60% at 10% 90%, ${rgba(accent, 0.35)} 0%, transparent 70%)`,
      `linear-gradient(180deg, ${mix(primaryDark, '#000000', 0.7)} 0%, ${night} 100%)`,
    ].join(', '),
    '--p-banner': `linear-gradient(90deg, ${maroon}, ${primaryDark} 50%, ${maroon})`,
    '--p-banner-text': mix(accent, '#FFFFFF', 0.75),
    '--page-hero-glow': primaryDark,
    '--page-hero-glow-2': mix(primaryDark, '#000000', 0.45),
    '--page-hero-top': mix(primaryDark, '#000000', 0.7),
    '--page-hero-mid': night,
  };
}

/** Whether the theme's homepage and navbar colours come from derivedPalette. */
export function hasDerivedPalette(theme: Theme) {
  return !!theme.decor;
}

/** The theme's CSS custom properties as a style object for the <html> element. */
export function themeStyle(theme: Theme): Record<string, string> {
  const style: Record<string, string> = hasDerivedPalette(theme) ? derivedPalette(theme) : {};
  for (const declaration of generateCSSVariables(theme).split(';')) {
    const [prop, val] = declaration.split(':').map((s) => s.trim());
    if (prop && val) style[prop] = val;
  }
  return style;
}

export function generateCSSVariables(theme: Theme): string {
  const { colors } = theme;
  return `
    --color-primary: ${colors.primary};
    --color-primary-dark: ${colors.primaryDark};
    --color-primary-light: ${colors.primaryLight};
    --color-accent: ${colors.accent};
    --color-accent-light: ${colors.accentLight};
    --color-bg: ${colors.background};
    --color-bg-alt: ${colors.backgroundAlt};
    --color-surface: ${colors.surface};
    --color-surface-alt: ${colors.surfaceAlt};
    --color-text: ${colors.text};
    --color-text-muted: ${colors.textMuted};
    --color-text-light: ${colors.textLight};
    --color-border: ${colors.border};
    --hero-gradient-from: ${colors.heroGradientFrom};
    --hero-gradient-to: ${colors.heroGradientTo};
    --hero-badge: ${colors.heroBadge};
  `;
}
