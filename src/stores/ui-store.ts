import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { cookieStorage } from '@/lib/cookie-storage';

type Theme = 'light' | 'dark';

interface UIState {
  theme: Theme;
  isSidebarCollapsed: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'light',
      isSidebarCollapsed: false,

      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';

          // DOM 업데이트
          if (typeof window !== 'undefined') {
            document.documentElement.setAttribute('data-theme', newTheme);
          }

          return { theme: newTheme };
        }),

      setTheme: (theme) =>
        set(() => {
          // DOM 업데이트
          if (typeof window !== 'undefined') {
            document.documentElement.setAttribute('data-theme', theme);
          }

          return { theme };
        }),

      toggleSidebar: () =>
        set((state) => {
          const newCollapsed = !state.isSidebarCollapsed;

          // DOM 업데이트
          if (typeof window !== 'undefined') {
            document.documentElement.setAttribute(
              'data-sidebar-collapsed',
              String(newCollapsed),
            );
          }

          return { isSidebarCollapsed: newCollapsed };
        }),

      setSidebarCollapsed: (collapsed) =>
        set(() => {
          // DOM 업데이트
          if (typeof window !== 'undefined') {
            document.documentElement.setAttribute(
              'data-sidebar-collapsed',
              String(collapsed),
            );
          }

          return { isSidebarCollapsed: collapsed };
        }),
    }),
    {
      name: 'ui-storage', // 쿠키 이름
      storage: createJSONStorage(() => cookieStorage),
      // 상태가 복원될 때 DOM도 업데이트
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== 'undefined') {
          document.documentElement.setAttribute('data-theme', state.theme);
          document.documentElement.setAttribute(
            'data-sidebar-collapsed',
            String(state.isSidebarCollapsed),
          );
        }
      },
    },
  ),
);
