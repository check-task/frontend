'use client';

import { css } from 'styled-system/css';
import { hstack } from 'styled-system/patterns';
import { useModalStore } from '@/stores/modal-store';
import { FolderModalContent } from './FolderModalContent';

interface SettingFolderButtonProps {
  onToggleReorder: () => void;
}

export const SettingFolderButton = ({
  onToggleReorder,
}: SettingFolderButtonProps) => {
  const openModal = useModalStore((state) => state.openModal);

  const handleAddFolder = () => {
    openModal({
      title: '폴더 추가',
      content: <FolderModalContent mode='add' />,
      headerType: 'withClose',
    });
  };

  return (
    <div className={containerStyle}>
      <button className={addButtonStyle} onClick={handleAddFolder}>
        폴더추가
      </button>
      <button className={reorderButtonStyle} onClick={onToggleReorder}>
        순서변경
      </button>
    </div>
  );
};

const containerStyle = css(
  hstack.raw({
    gap: '0.5rem',
    alignItems: 'flex-start',
  }),
);

const buttonBaseStyle = {
  textStyle: 'body4.m',
  paddingX: '0.75rem',
  paddingY: '0.25rem',
  borderRadius: '0.25rem',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
} as const;

const addButtonStyle = css({
  ...buttonBaseStyle,
  bg: 'blue.50',
  color: 'blue.500',
});

const reorderButtonStyle = css({
  ...buttonBaseStyle,
  bg: 'bg',
  color: 'blue.600',
});
