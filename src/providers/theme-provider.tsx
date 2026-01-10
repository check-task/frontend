'use client';

import { type ReactNode, createContext, useContext } from 'react';
import { useUIStore } from '@/stores/ui-store';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export interface ThemeProviderProps {
  children: ReactNode;
}

// ThemeProvider - Zustand UI Store를 래핑하는 Context Provider
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // Zustand store에서 테마 상태와 액션을 가져옴
  const theme = useUIStore((state) => state.theme);
  const toggleTheme = useUIStore((state) => state.toggleTheme);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
