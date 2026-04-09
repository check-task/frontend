'use client';

import { css, cx } from 'styled-system/css';
import { CheckMark } from '@/components/icons/CheckMark';
import type { Folder } from '@/types/folder';

// profile 폴더 색과 동일한 토큰 매핑 (ManagementSection Folder.Color와 일치)
const FOLDER_COLOR_TOKEN: Record<Folder['color'], string> = {
  red: 'sub.01.100',
  yellow: 'sub.02.100',
  green: 'sub.03.100',
  purple: 'sub.04.100',
  black: 'sub.05.100',
  null: 'sub.null.100',
};

interface FolderSelectProps {
  folders: Folder[];
  selectedFolderId: number | null;
  onFolderChange: (folderId: number) => void;
}

export const FolderSelect = ({
  folders,
  selectedFolderId,
  onFolderChange,
}: FolderSelectProps) => {
  return (
    <div className={containerStyle}>
      {folders
        .filter((folder) => folder.name !== '지정안함')
        .map((folder) => {
          const token = FOLDER_COLOR_TOKEN[folder.color];
          const isSelected = selectedFolderId === folder.id;
          return (
            <label key={folder.id} className={labelStyle}>
              <input
                type='radio'
                name='folder'
                checked={isSelected}
                onChange={() => onFolderChange(folder.id)}
                className={cx('peer', hiddenInputStyle)}
              />
              <div
                className={css({
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  bg: token,
                  transition: 'transform 0.2s ease',
                  '& svg': {
                    opacity: 0,
                    transform: 'scale(0.5)',
                    transition: 'all 0.1s ease-in-out',
                  },
                  _peerChecked: {
                    '& svg': {
                      opacity: 1,
                      transform: 'scale(1)',
                    },
                  },
                })}
                title={folder.name}
              >
                <CheckMark variant='white' />
              </div>
            </label>
          );
        })}
    </div>
  );
};

const containerStyle = css({
  display: 'flex',
  gap: '1rem',
  alignItems: 'center',
});

const labelStyle = css({
  cursor: 'pointer',
  display: 'inline-block',
});

const hiddenInputStyle = css({
  srOnly: true,
});
