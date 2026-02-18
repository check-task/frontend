'use client';

import { Button } from '@/components/Button';
import { useModalStore } from '@/stores/modal-store';
import { Modal } from '@/features/profile/components/ModalContent';
import { useWithdraw } from '@/hooks/mutations/useWithdraw';

export const WithdrawalModalContent = () => {
  const closeModal = useModalStore((state) => state.closeModal);
  const withdraw = useWithdraw();

  const handleConfirm = () => {
    closeModal();
    withdraw.mutate();
  };

  return (
    <Modal.Container gap='medium'>
      {/* 경고 메시지 */}
      <Modal.MessageSection>
        <Modal.Title>회원 탈퇴를 진행하시겠습니까?</Modal.Title>
        <Modal.Description>
          탈퇴 시 계정은 즉시 비활성화되며, 회원 정보는 4일간 보관 후 영구
          삭제됩니다. 보관 기간 내에는 계정 복구가 가능합니다.
        </Modal.Description>
      </Modal.MessageSection>

      {/* 버튼 */}
      <Modal.ButtonSection marginTop='medium'>
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
