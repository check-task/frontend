'use client';

import { useModalStore } from '@/stores/modal-store';
import { FolderModalContent } from './FolderModalContent';
import { AddIcon } from '@/components/icons/AddIcon';

export const AddFolderButton = () => {
  const openModal = useModalStore((state) => state.openModal);

  const handleOpen = () => {
    openModal({
      title: '폴더 추가',
      content: <FolderModalContent mode='add' />,
      headerType: 'withClose',
    });
  };

  return (
    <button onClick={handleOpen} style={{ cursor: 'pointer' }}>
      <AddIcon />
    </button>
  );
};
