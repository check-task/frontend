'use client';

import { useState } from 'react';
import { css, cva } from 'styled-system/css';
import { hstack } from 'styled-system/patterns';
import { Button } from '@/components/Button';
import { Input } from '@/components/TextField';
import { useModalStore } from '@/stores/modal-store';
import { FolderCheckMark } from '@/components/icons/FolderCheckMark';
import { FolderColor, FOLDER_COLORS } from '@/types/folder';
import { Modal } from '@/features/profile/components/ModalContent';
import { useCreateFolder } from '@/hooks/mutations/useCreateFolder';
import { useUpdateFolder } from '@/hooks/mutations/useUpdateFolder';
import { useMyInfo } from '@/hooks/queries/useMyInfo';
import { useAlertStore } from '@/stores/alert-store';

interface FolderModalContentProps {
  mode: 'add' | 'edit';
  folderId?: number;
  initialName?: string;
  initialColor?: FolderColor;
}

export const FolderModalContent = ({
  mode,
  folderId,
  initialName = '',
  initialColor,
}: FolderModalContentProps) => {
  const closeModal = useModalStore((state) => state.closeModal);
  const createFolder = useCreateFolder();
  const updateFolder = useUpdateFolder();
  const { data } = useMyInfo();

  // 현재 사용 중인 폴더 색상 목록
  const usedColors = (data?.folders ?? [])
    .filter((f) => f.id !== folderId)
    .map((f) => f.color);

  // 현재 사용 중인 폴더 이름 목록
  const usedNames = (data?.folders ?? [])
    .filter((f) => f.id !== folderId)
    .map((f) => f.name);

  const [name, setName] = useState<string>(mode === 'edit' ? initialName : '');
  // 추가는 초기 선택 없음, 수정은 기존 색상 선택
  const [selectedColor, setSelectedColor] = useState<FolderColor | null>(
    mode === 'add' ? null : (initialColor ?? null),
  );

  const isPending = createFolder.isPending || updateFolder.isPending;
  const { showAlert } = useAlertStore();

  const handleSave = () => {
    if (!selectedColor || !name.trim()) return;

    if (name.trim().length > 10) {
      showAlert('폴더 이름은 최대 10자까지만 가능합니다.', 'x');
      return;
    }

    if (usedNames.includes(name.trim())) {
      showAlert('이미 사용 중인 폴더 이름입니다.', 'x');
      return;
    }

    if (usedColors.includes(selectedColor)) {
      showAlert('이미 사용 중인 폴더 색상입니다.', 'x');
      return;
    }

    if (mode === 'add') {
      createFolder.mutate(
        { folderTitle: name, color: selectedColor },
        { onSuccess: () => closeModal() },
      );
    } else if (mode === 'edit' && folderId) {
      updateFolder.mutate(
        { folderId, body: { folderTitle: name, color: selectedColor } },
        { onSuccess: () => closeModal() },
      );
    }
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
            maxLength={10}
          />
        </Modal.FormField>

        {/* 폴더색 */}
        <Modal.FormField gap='medium'>
          <Modal.Label>폴더색</Modal.Label>
          <div className={colorSectionStyle}>
            {FOLDER_COLORS.filter((color) => color !== 'null').map((color) => (
              <button
                key={color}
                type='button'
                className={colorButtonStyle({ color })}
                onClick={() => setSelectedColor(color)}
              >
                {selectedColor === color && <FolderCheckMark />}
              </button>
            ))}
          </div>
        </Modal.FormField>
      </Modal.Container>

      {/* 저장 버튼 */}
      <Button
        variant='fillBlue'
        size='xlarge'
        onClick={handleSave}
        className={css({ marginTop: '2.5rem' })}
        disabled={!name.trim() || !selectedColor || isPending}
      >
        {mode === 'edit' ? '변경사항 저장' : '저장'}
      </Button>
    </>
  );
};

const colorSectionStyle = css(
  hstack.raw({
    gap: '0.75rem',
  }),
);

const colorButtonStyle = cva({
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
