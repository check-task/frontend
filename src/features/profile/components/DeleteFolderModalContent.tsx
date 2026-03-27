'use client';

import { styled } from 'styled-system/jsx';
import { hstack } from 'styled-system/patterns';
import { Button } from '@/components/Button';
import { useModalStore } from '@/stores/modal-store';
import { FolderColor } from '@/types/folder';
import { Modal } from '@/features/profile/components/ModalContent';
import { useDeleteFolder } from '@/hooks/mutations/useDeleteFolder';

interface DeleteFolderModalContentProps {
  folderId: number;
  folderName: string;
  folderColor: FolderColor;
}

export const DeleteFolderModalContent = ({
  folderId,
  folderName,
  folderColor,
}: DeleteFolderModalContentProps) => {
  const closeModal = useModalStore((state) => state.closeModal);
  const deleteFolder = useDeleteFolder();

  const handleDelete = () => {
    deleteFolder.mutate(folderId, {
      onSuccess: () => closeModal(),
    });
  };

  return (
    <>
      <Modal.Container gap='small'>
        {/* 확인 메시지 */}
        <Modal.MessageSection>
          <Modal.TitleInline>
            폴더명
            <FolderBadge>
              <FolderDot color={folderColor} />
              <FolderName color={folderColor}>{folderName}</FolderName>
            </FolderBadge>
            을(를) 삭제하시겠습니까?
          </Modal.TitleInline>
          <Modal.Description>
            삭제된 폴더와 폴더의 과제는 영구 삭제되며 되돌릴 수 없습니다.
          </Modal.Description>
        </Modal.MessageSection>
      </Modal.Container>

      {/* 버튼 */}
      <Modal.ButtonSection marginTop='medium'>
        <Button variant='fillGray' size='xlarge' onClick={closeModal}>
          취소
        </Button>
        <Button variant='fillBlue' size='xlarge' onClick={handleDelete}>
          삭제
        </Button>
      </Modal.ButtonSection>
    </>
  );
};

const FolderBadge = styled('span', {
  base: hstack.raw({
    gap: '0.25rem',
    display: 'inline-flex',
    alignItems: 'center',
  }),
});

const FolderName = styled('span', {
  base: {
    textStyle: 'body1.m',
  },
  variants: {
    color: {
      red: { color: 'sub.01.100' },
      yellow: { color: 'sub.02.100' },
      green: { color: 'sub.03.100' },
      purple: { color: 'sub.04.100' },
      black: { color: 'sub.05.100' },
    },
  },
});

const FolderDot = styled('span', {
  base: {
    width: '1.5rem',
    height: '1.5rem',
    borderRadius: '50%',
    display: 'inline-block',
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
