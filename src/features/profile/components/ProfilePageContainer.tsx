'use client';

import { useUIStore } from '@/stores/ui-store';
import { cva } from 'styled-system/css';
import { stack } from 'styled-system/patterns';

interface ProfilePageContainerProps {
  children: React.ReactNode;
}

export const ProfilePageContainer = ({
  children,
}: ProfilePageContainerProps) => {
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);

  return (
    <div className={containerStyle({ collapsed: !!isSidebarCollapsed })}>
      {children}
    </div>
  );
};

const containerStyle = cva({
  base: stack.raw({
    gap: '2.25rem',
    marginX: 'auto',
    marginTop: '3.25rem',
    marginBottom: '3.75rem',
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
  defaultVariants: {
    collapsed: false,
  },
});
