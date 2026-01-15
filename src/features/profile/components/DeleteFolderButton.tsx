'use client';

import { useModalStore } from '@/stores/modal-store';
import { DeleteFolderModalContent } from './DeleteFolderModalContent';
import { CloseIcon } from '@/components/icons/CloseIcon';

type FolderColor = 'red' | 'yellow' | 'green' | 'purple' | 'black';

interface DeleteFolderButtonProps {
  folderName: string;
  folderColor: FolderColor;
}

export const DeleteFolderButton = ({
  folderName,
  folderColor,
}: DeleteFolderButtonProps) => {
  const openModal = useModalStore((state) => state.openModal);

  const handleOpen = () => {
    openModal({
      title: '폴더 삭제',
      content: (
        <DeleteFolderModalContent
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
