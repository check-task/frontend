'use client';

import { Button } from '@/components/Button';
import { useModalStore } from '@/stores/modal-store';
import { Modal } from '@/features/profile/components/ModalContent';

interface WithdrawalModalContentProps {
  onConfirm?: () => void;
}

export const WithdrawalModalContent = ({
  onConfirm,
}: WithdrawalModalContentProps) => {
  const closeModal = useModalStore((state) => state.closeModal);

  const handleConfirm = () => {
    onConfirm?.();
    closeModal();
  };

  return (
    <Modal.Container gap='medium'>
      {/* 경고 메시지 */}
      <Modal.MessageSection>
        <Modal.Title>정말 회원 탈퇴를 진행하시겠습니까?</Modal.Title>
        <Modal.Description>
          탈퇴 시 등록한 정보가 모두 삭제되며 되돌릴 수 없습니다.
        </Modal.Description>
      </Modal.MessageSection>

      {/* 버튼 */}
      <Modal.ButtonSection>
        <Button variant='fillBlue' size='xlarge' onClick={handleConfirm}>
          예
        </Button>
        <Button variant='fillGray' size='xlarge' onClick={closeModal}>
          아니오
        </Button>
      </Modal.ButtonSection>
    </Modal.Container>
  );
};
