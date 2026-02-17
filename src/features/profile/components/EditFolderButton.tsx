'use client';

import { useModalStore } from '@/stores/modal-store';
import { FolderModalContent } from './FolderModalContent';
import { PencilIcon } from '@/components/icons/PencilIcon';
import { FolderColor } from '@/types/folder';

interface EditFolderButtonProps {
  folderId: number;
  folderName: string;
  folderColor: FolderColor;
}

export const EditFolderButton = ({
  folderId,
  folderName,
  folderColor,
}: EditFolderButtonProps) => {
  const openModal = useModalStore((state) => state.openModal);

  const handleOpen = () => {
    if (folderName === '팀') {
      alert("'팀' 폴더는 수정할 수 없습니다.");
      return;
    }

    openModal({
      title: '폴더 수정',
      content: (
        <FolderModalContent
          mode='edit'
          folderId={folderId}
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
