'use client';

import { Button } from '@/components/Button';
import { useModalStore } from '@/stores/modal-store';
import { EditProfileModalContent } from './EditProfileModalContent';

export const EditProfileButton = () => {
  const openModal = useModalStore((state) => state.openModal);

  const handleOpen = () => {
    openModal({
      title: '프로필 변경',
      content: <EditProfileModalContent />,
      headerType: 'withClose',
    });
  };

  return (
    <Button variant='strokeBlue' size='tiny' onClick={handleOpen}>
      수정
    </Button>
  );
};
