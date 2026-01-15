'use client';

import { useModalStore } from '@/stores/modal-store';
import { FolderModalContent } from './FolderModalContent';
import { PencilIcon } from '@/components/icons/PencilIcon';

type FolderColor = 'red' | 'yellow' | 'green' | 'purple' | 'black';

interface EditFolderButtonProps {
  folderName: string;
  folderColor: FolderColor;
}

export const EditFolderButton = ({
  folderName,
  folderColor,
}: EditFolderButtonProps) => {
  const openModal = useModalStore((state) => state.openModal);

  const handleOpen = () => {
    openModal({
      title: '폴더 수정',
      content: (
        <FolderModalContent
          mode='edit'
          initialName={folderName}
          initialColor={folderColor}
        />
      ),
      headerType: 'withClose',
    });
  };

  return (
    <button onClick={handleOpen} style={{ cursor: 'pointer' }}>
      <PencilIcon />
    </button>
  );
};
