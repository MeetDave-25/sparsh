import themesData from '@/data/themes.json';

export type ThemeId = 'romantic' | 'diwali' | 'christmas' | 'valentine' | 'monsoon';

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

export interface Theme {
  id: ThemeId;
  name: string;
  emoji: string;
  season: string;
  colors: ThemeColors;
  heroTitle: string;
  heroSubtitle: string;
  heroCTA: string;
  bannerText: string;
  active: boolean;
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

/** The theme's CSS custom properties as a style object for the <html> element. */
export function themeStyle(theme: Theme): Record<string, string> {
  const style: Record<string, string> = {};
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
