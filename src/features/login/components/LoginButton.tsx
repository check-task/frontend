'use client';

import { Button } from '@/components/Button';
import { LoginModalContent } from '@/features/login/components/LoginModalContent';
import { useModalStore } from '@/stores/modal-store';

export const LoginButton = () => {
  const openModal = useModalStore((state) => state.openModal);

  const handleClick = () => {
    openModal({
      content: <LoginModalContent />,
      presentation: 'bare',
    });
  };

  return (
    <Button variant='fillBlue' size='small' onClick={handleClick}>
      로그인
    </Button>
  );
};
