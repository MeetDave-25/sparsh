'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Theme, getActiveTheme, getAllThemes, generateCSSVariables } from '@/lib/themes';

type DarkMode = 'light' | 'dark';

interface ThemeContextValue {
  activeTheme: Theme;
  allThemes: Theme[];
  darkMode: DarkMode;
  setTheme: (themeId: string) => void;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [activeTheme, setActiveTheme] = useState<Theme>(getActiveTheme());
  const [allThemes] = useState<Theme[]>(getAllThemes());
  const [darkMode, setDarkMode] = useState<DarkMode>('dark');

  useEffect(() => {
    // Load saved theme & dark mode from localStorage
    const savedThemeId = localStorage.getItem('sparsh_theme');
    const savedMode = localStorage.getItem('sparsh_mode') as DarkMode;

    if (savedThemeId) {
      const found = allThemes.find(t => t.id === savedThemeId);
      if (found) setActiveTheme(found);
    }
    if (savedMode) setDarkMode(savedMode);
  }, [allThemes]);

  useEffect(() => {
    // Apply CSS variables to :root
    const root = document.documentElement;
    const cssVars = generateCSSVariables(activeTheme);
    
    // Parse and apply each variable
    cssVars.split(';').forEach(declaration => {
      const [prop, val] = declaration.split(':').map(s => s.trim());
      if (prop && val) {
        root.style.setProperty(prop, val);
      }
    });

    // Apply dark mode attribute
    root.setAttribute('data-mode', darkMode);

    // Save to localStorage
    localStorage.setItem('sparsh_theme', activeTheme.id);
    localStorage.setItem('sparsh_mode', darkMode);
  }, [activeTheme, darkMode]);

  const setTheme = (themeId: string) => {
    const found = allThemes.find(t => t.id === themeId);
    if (found) setActiveTheme(found);
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ activeTheme, allThemes, darkMode, setTheme, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
