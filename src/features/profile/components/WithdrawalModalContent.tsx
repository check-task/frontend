'use client';

import { styled } from 'styled-system/jsx';
import { stack } from 'styled-system/patterns';
import { Button } from '@/components/Button';
import { useModalStore } from '@/stores/modal-store';

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
    <Container>
      {/* 경고 메시지 */}
      <MessageSection>
        <Title>정말 회원 탈퇴를 진행하시겠습니까?</Title>
        <Description>
          탈퇴 시 등록한 정보가 모두 삭제되며 되돌릴 수 없습니다.
        </Description>
      </MessageSection>

      {/* 버튼 */}
      <ButtonSection>
        <Button variant='fillBlue' size='xlarge' onClick={handleConfirm}>
          예
        </Button>
        <Button variant='fillGray' size='xlarge' onClick={closeModal}>
          아니오
        </Button>
      </ButtonSection>
    </Container>
  );
};

const Container = styled('div', {
  base: stack.raw({
    gap: '1.125rem',
    paddingTop: '1.75rem',
  }),
});

const MessageSection = styled('div', {
  base: stack.raw({
    gap: '0.5rem',
  }),
});

const Title = styled('p', {
  base: {
    textStyle: 'body2.m',
    color: 'gray.800',
  },
});

const Description = styled('p', {
  base: {
    textStyle: 'body3.m',
    color: 'gray.600',
  },
});

const ButtonSection = styled('div', {
  base: stack.raw({
    gap: '1rem',
  }),
});
