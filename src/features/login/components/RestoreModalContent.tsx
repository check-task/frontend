'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { useModalStore } from '@/stores/modal-store';
import { Modal } from '@/features/profile/components/ModalContent';
import { restoreAccount } from '@/services/user';
import { useAuthStore } from '@/stores/auth-store';

interface RestoreModalContentProps {
  token: string;
}

export const RestoreModalContent = ({ token }: RestoreModalContentProps) => {
  const closeModal = useModalStore((state) => state.closeModal);
  const login = useAuthStore((state) => state.login);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleRestore = async () => {
    setIsLoading(true);
    try {
      const { accessToken } = await restoreAccount(token);
      login(accessToken);
      closeModal();
      router.replace('/');
    } catch {
      alert('계정 복구에 실패했습니다. 다시 시도해주세요.');
      closeModal();
      router.replace('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    closeModal();
    router.replace('/login');
  };

  return (
    <Modal.Container>
      <Modal.MessageSection>
        <Modal.Title>
          탈퇴 처리된 계정입니다. 계정을 복구하시겠습니까?
        </Modal.Title>
      </Modal.MessageSection>

      <Modal.ButtonSection marginTop='medium'>
        <Button
          variant='fillBlue'
          size='xlarge'
          onClick={handleRestore}
          disabled={isLoading}
        >
          {isLoading ? '복구 중...' : '계정 복구'}
        </Button>
        <Button
          variant='fillGray'
          size='xlarge'
          onClick={handleCancel}
          disabled={isLoading}
        >
          취소
        </Button>
      </Modal.ButtonSection>
    </Modal.Container>
  );
};
