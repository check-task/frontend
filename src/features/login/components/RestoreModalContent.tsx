'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { useModalStore } from '@/stores/modal-store';
import { Modal } from '@/features/profile/components/ModalContent';
import { restoreAccount } from '@/services/user';
import { useAuthStore } from '@/stores/auth-store';
import { useAlertStore } from '@/stores/alert-store';
import { restoreLocalAccount } from '@/services/auth';

type RestoreType = 'kakao' | 'local';

interface RestoreModalContentProps {
  token: string;
  restoreType?: RestoreType;
}

export const RestoreModalContent = ({
  token,
  restoreType = 'kakao',
}: RestoreModalContentProps) => {
  const closeModal = useModalStore((state) => state.closeModal);
  const login = useAuthStore((state) => state.login);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { showAlert } = useAlertStore();

  const handleRestore = async () => {
    setIsLoading(true);
    try {
      const restore =
        restoreType === 'local' ? restoreLocalAccount : restoreAccount;
      const { accessToken } = await restore(token);
      login(accessToken);
      closeModal();
      router.replace('/');
    } catch {
      showAlert('계정 복구에 실패했습니다. 다시 시도해주세요.', 'x');
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
