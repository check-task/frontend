'use client';

import { useModalStore } from '@/stores/modal-store';
import { DeleteFolderModalContent } from './DeleteFolderModalContent';
import { CloseIcon } from '@/components/icons/CloseIcon';
import { FolderColor } from '@/types/folder';

interface DeleteFolderButtonProps {
  folderId: number;
  folderName: string;
  folderColor: FolderColor;
}

export const DeleteFolderButton = ({
  folderId,
  folderName,
  folderColor,
}: DeleteFolderButtonProps) => {
  const openModal = useModalStore((state) => state.openModal);

  const handleOpen = () => {
    openModal({
      title: '폴더 삭제',
      content: (
        <DeleteFolderModalContent
          folderId={folderId}
          folderName={folderName}
          folderColor={folderColor}
        />
      ),
      headerType: 'none',
    });
  };

  return (
    <button onClick={handleOpen} style={{ cursor: 'pointer' }}>
      <CloseIcon />
    </button>
  );
};
