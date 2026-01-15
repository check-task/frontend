'use client';

import { useUIStore } from '@/stores/ui-store';
import { cva } from 'styled-system/css';
import { stack } from 'styled-system/patterns';

interface NotificationSettingProps {
  children: React.ReactNode;
}

export const NotificationSetting = ({ children }: NotificationSettingProps) => {
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);

  return (
    <div
      className={notificationSettingStyle({ collapsed: !!isSidebarCollapsed })}
    >
      {children}
    </div>
  );
};

const notificationSettingStyle = cva({
  base: stack.raw({
    gap: '1.5rem',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  }),
  variants: {
    collapsed: {
      true: {
        width: '23.25rem',
      },
      false: {
        width: '19rem',
      },
    },
  },
});
