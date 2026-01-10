'use client';

import {
  type ReactNode,
  createContext,
  useState,
  useContext,
  useEffect,
} from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // 초기 상태를 클라이언트에서 data-theme으로부터 읽어옴
  const [theme, setTheme] = useState<Theme>(() => {
    // SSR 시에는 'light' 반환
    if (typeof window === 'undefined') return 'light';

    // 클라이언트에서는 HTML의 data-theme을 읽어옴 (layout.tsx 스크립트가 설정)
    const htmlTheme = document.documentElement.getAttribute(
      'data-theme',
    ) as Theme | null;
    return htmlTheme === 'dark' ? 'dark' : 'light';
  });

  // 테마 변경 시에만 HTML과 localStorage 업데이트
  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme !== theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

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
