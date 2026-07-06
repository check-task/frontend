'use client';

import { css } from 'styled-system/css';
import { hstack } from 'styled-system/patterns';
import { useModalStore } from '@/stores/modal-store';
import { FolderModalContent } from './FolderModalContent';
import { CloseIcon } from '@/components/icons/CloseIcon';
import { SaveIcon } from '@/components/icons/SaveIcon';

interface SettingFolderButtonProps {
  isReorder: boolean;
  onStartReorder: () => void;
  onCancelReorder: () => void;
  onSaveReorder: () => void;
}

export const SettingFolderButton = ({
  isReorder,
  onStartReorder,
  onCancelReorder,
  onSaveReorder,
}: SettingFolderButtonProps) => {
  const openModal = useModalStore((state) => state.openModal);

  const handleAddFolder = () => {
    openModal({
      title: '폴더 추가',
      content: <FolderModalContent mode='add' />,
      headerType: 'withClose',
    });
  };

  if (isReorder) {
    return (
      <div className={containerStyle}>
        <button className={cancelPillStyle} onClick={onCancelReorder}>
          <CloseIcon size='1.25rem' color='gray.600' />
          취소
        </button>
        <button className={savePillStyle} onClick={onSaveReorder}>
          <SaveIcon />
          저장
        </button>
      </div>
    );
  }

  return (
    <div className={containerStyle}>
      <button className={addButtonStyle} onClick={handleAddFolder}>
        폴더추가
      </button>
      <button className={reorderButtonStyle} onClick={onStartReorder}>
        순서변경
      </button>
    </div>
  );
};

const containerStyle = css(
  hstack.raw({
    gap: '0.5rem',
    alignItems: 'center',
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

const pillBaseStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem',
  paddingLeft: '0.5rem',
  paddingRight: '1rem',
  paddingY: '0.5rem',
  borderRadius: '2.5rem',
  borderWidth: '1px',
  borderStyle: 'solid',
  textStyle: 'body3.m',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
} as const;

const cancelPillStyle = css({
  ...pillBaseStyle,
  borderColor: 'gray.600',
  color: 'gray.600',
});

const savePillStyle = css({
  ...pillBaseStyle,
  borderColor: 'blue.500',
  color: 'blue.500',
});
