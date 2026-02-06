'use client';

import { useUIStore } from '@/stores/ui-store';
import { hstack } from 'styled-system/patterns';
import { cva } from 'styled-system/css';

interface ProfileFooterProps {
  children: React.ReactNode;
}

export const ProfileFooter = ({ children }: ProfileFooterProps) => {
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);

  return (
    <footer className={footerStyle({ collapsed: !!isSidebarCollapsed })}>
      {children}
    </footer>
  );
};

const footerStyle = cva({
  base: hstack.raw({
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '0.75rem',
    transition: 'width 0.3s ease',
  }),
  variants: {
    collapsed: {
      true: {
        width: '62.25rem',
      },
      false: {
        width: '49.625rem',
      },
    },
  },
});
