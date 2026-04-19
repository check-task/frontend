'use client';

import { useUIStore } from '@/stores/ui-store';
import { cva } from 'styled-system/css';

interface CardProps {
  children: React.ReactNode;
  type: 'profile' | 'management';
}

export const Card = ({ children, type }: CardProps) => {
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);

  return (
    <div className={cardStyle({ type, collapsed: !!isSidebarCollapsed })}>
      {children}
    </div>
  );
};

const cardStyle = cva({
  base: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: '0.75rem',
    bg: 'gray.0',
    shadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.16)',
    transition: 'width 0.3s ease, padding 0.3s ease, gap 0.3s ease',
  },
  variants: {
    collapsed: {
      true: {
        width: '62.25rem',
      },
      false: {
        width: '49.625rem',
      },
    },
    type: {
      profile: {
        paddingY: '2.5rem',
      },
      management: {
        padding: '2.5rem',
        justifyContent: 'space-between',
      },
    },
  },
  compoundVariants: [
    {
      type: 'profile',
      collapsed: true,
      css: { paddingX: '5rem', gap: '5rem' },
    },
    {
      type: 'profile',
      collapsed: false,
      css: { paddingX: '2.5rem', gap: '2.5rem' },
    },
  ],
});
