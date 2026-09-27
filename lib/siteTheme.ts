import { cache } from 'react';
import { prisma } from './prisma';
import { getActiveTheme, getThemeById, type Theme } from './themes';

export const THEME_KEY = 'theme';

/** The seasonal theme the admin has chosen for the whole site. */
export const getSiteTheme = cache(async (): Promise<Theme> => {
  try {
    const row = await prisma.siteContent.findUnique({ where: { key: THEME_KEY } });
    const id = (row?.data as { themeId?: unknown } | null)?.themeId;
    return (typeof id === 'string' && getThemeById(id)) || getActiveTheme();
  } catch (error) {
    console.error('Failed to load site theme, using default', error);
    return getActiveTheme();
  }
});
