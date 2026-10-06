import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { playTokyoLightsOn, playTokyoLightsDim } from '../utils/audio';

export type Theme = 'dark' | 'light';
export type LightingState = 'idle' | 'igniting' | 'dimming';

interface ThemeContextType {
  theme: Theme;
  lightingState: LightingState;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [lightingState, setLightingState] = useState<LightingState>('idle');

  useEffect(() => {
    const saved = localStorage.getItem('kuro_theme') as Theme | null;
    const initialTheme = saved === 'light' ? 'light' : 'dark';
    setTheme(initialTheme);
    applyThemeClasses(initialTheme);
  }, []);

  const applyThemeClasses = (newTheme: Theme) => {
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  };

  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    const root = document.documentElement;

    if (next === 'light') {
      // Tokyo Lights Turning On (Electric Ignition Arc + Warm Daylight Bloom)
      playTokyoLightsOn();
      setLightingState('igniting');
      root.classList.add('tokyo-igniting');
      root.classList.remove('tokyo-dimming');

      setTimeout(() => {
        setTheme('light');
        applyThemeClasses('light');
      }, 70); // Brief ignition pre-spark before daylight breaks

      setTimeout(() => {
        setLightingState('idle');
        root.classList.remove('tokyo-igniting');
      }, 750);
    } else {
      // Tokyo Nocturnal Dimming (Smooth Ambient Fade + Neon Afterglow)
      playTokyoLightsDim();
      setLightingState('dimming');
      root.classList.add('tokyo-dimming');
      root.classList.remove('tokyo-igniting');

      setTheme('dark');
      applyThemeClasses('dark');

      setTimeout(() => {
        setLightingState('idle');
        root.classList.remove('tokyo-dimming');
      }, 680);
    }

    localStorage.setItem('kuro_theme', next);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, lightingState, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
