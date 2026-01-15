'use client';

import { useUIStore } from '@/stores/ui-store';
import { cva } from 'styled-system/css';
import { stack } from 'styled-system/patterns';

interface FolderSettingProps {
  children: React.ReactNode;
}

export const FolderSetting = ({ children }: FolderSettingProps) => {
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);

  return (
    <div className={folderSettingStyle({ collapsed: !!isSidebarCollapsed })}>
      {children}
    </div>
  );
};

const folderSettingStyle = cva({
  base: stack.raw({
    gap: '1.5rem',
  }),
  variants: {
    collapsed: {
      true: {
        width: '26.75rem',
      },
      false: {
        width: '22rem',
      },
    },
  },
});
