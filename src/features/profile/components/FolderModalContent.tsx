'use client';

import { useState } from 'react';
import { styled } from 'styled-system/jsx';
import { hstack } from 'styled-system/patterns';
import { css } from 'styled-system/css';
import { Button } from '@/components/Button';
import { Input } from '@/components/TextField';
import { useModalStore } from '@/stores/modal-store';
import { FolderCheckMark } from '@/components/icons/FolderCheckMark';
import { FolderColor, FOLDER_COLORS } from '@/types/folder';
import { Modal } from '@/features/profile/components/ModalContent';

interface FolderModalContentProps {
  mode: 'add' | 'edit';
  initialName?: string;
  initialColor?: FolderColor;
  onSave?: (name: string, color: FolderColor) => void;
}

export const FolderModalContent = ({
  mode,
  initialName = '',
  initialColor,
  onSave,
}: FolderModalContentProps) => {
  const closeModal = useModalStore((state) => state.closeModal);
  const [name, setName] = useState('');
  // 추가는 초기 선택 없음, 수정은 기존 색상 선택
  const [selectedColor, setSelectedColor] = useState<FolderColor | null>(
    mode === 'add' ? null : (initialColor ?? null),
  );

  const handleSave = () => {
    if (selectedColor) {
      onSave?.(name, selectedColor);
    }
    closeModal();
  };

  return (
    <>
      <Modal.Container gap='large'>
        {/* 폴더명 */}
        <Modal.FormField gap='small'>
          <Modal.Label>폴더명</Modal.Label>
          <Input
            size='modal'
            type='text'
            placeholder={mode === 'edit' ? initialName : '폴더명을 입력하세요'}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Modal.FormField>

        {/* 폴더색 */}
        <Modal.FormField gap='medium'>
          <Modal.Label>폴더색</Modal.Label>
          <ColorSection>
            {FOLDER_COLORS.map((color) => (
              <ColorButton
                key={color}
                type='button'
                color={color}
                onClick={() => setSelectedColor(color)}
              >
                {selectedColor === color && <FolderCheckMark />}
              </ColorButton>
            ))}
          </ColorSection>
        </Modal.FormField>
      </Modal.Container>

      {/* 저장 버튼 */}
      <Button
        variant='fillBlue'
        size='xlarge'
        onClick={handleSave}
        className={css({ marginTop: '2.5rem' })}
        disabled={!name.trim() || !selectedColor}
      >
        {mode === 'edit' ? '변경사항 저장' : '저장'}
      </Button>
    </>
  );
};

const ColorSection = styled('div', {
  base: hstack.raw({
    gap: '0.75rem',
  }),
});

const ColorButton = styled('button', {
  base: {
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s ease',
  },
  variants: {
    color: {
      red: { bg: 'sub.01.100' },
      yellow: { bg: 'sub.02.100' },
      green: { bg: 'sub.03.100' },
      purple: { bg: 'sub.04.100' },
      black: { bg: 'sub.05.100' },
    },
  },
});
