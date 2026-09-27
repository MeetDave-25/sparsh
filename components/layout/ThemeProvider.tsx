'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { Theme } from '@/lib/themes';

const ThemeContext = createContext<Theme | null>(null);

/** Exposes the admin-chosen site theme; its colours are applied server-side on <html>. */
export function ThemeProvider({ theme, children }: { theme: Theme; children: ReactNode }) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error('useTheme must be used within ThemeProvider');
  return { activeTheme: theme };
}
