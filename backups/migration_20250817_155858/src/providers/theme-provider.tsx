'use client';

import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from 'next-themes';
import * as React from 'react';

type Theme = 'default' | 'compass-peak' | 'fireweed-path';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = React.useContext(ThemeContext);
  const nextTheme = useNextTheme();

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return {
    ...context,
    mode: nextTheme.theme as 'light' | 'dark' | 'system',
    setMode: (mode: 'light' | 'dark' | 'system') => nextTheme.setTheme(mode),
    systemTheme: nextTheme.systemTheme,
    resolvedTheme: nextTheme.resolvedTheme,
  };
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'default',
  storageKey = 'heh-ui-theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme);

  // Load saved theme preference
  React.useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const savedTheme = JSON.parse(saved);
        if (savedTheme && ['default', 'compass-peak', 'fireweed-path'].includes(savedTheme)) {
          setThemeState(savedTheme);
        }
      } catch (e) {
        console.error('Failed to parse saved theme:', e);
      }
    }
  }, [storageKey]);

  // Save theme preference
  const setTheme = React.useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      localStorage.setItem(storageKey, JSON.stringify(newTheme));

      // Update body classes
      document.body.classList.remove('default', 'compass-peak', 'fireweed-path');
      document.body.classList.add(newTheme);
    },
    [storageKey]
  );

  // Apply theme class on mount and changes
  React.useEffect(() => {
    document.body.classList.remove('default', 'compass-peak', 'fireweed-path');
    document.body.classList.add(theme);
  }, [theme]);

  const value = React.useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </NextThemesProvider>
    </ThemeContext.Provider>
  );
}
