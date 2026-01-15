'use client';

import { styled } from 'styled-system/jsx';
import { stack, hstack } from 'styled-system/patterns';
import { Button } from '@/components/Button';
import { useModalStore } from '@/stores/modal-store';

type FolderColor = 'red' | 'yellow' | 'green' | 'purple' | 'black';

interface DeleteFolderModalContentProps {
  folderName: string;
  folderColor: FolderColor;
  onDelete?: () => void;
}

export const DeleteFolderModalContent = ({
  folderName,
  folderColor,
  onDelete,
}: DeleteFolderModalContentProps) => {
  const closeModal = useModalStore((state) => state.closeModal);

  const handleDelete = () => {
    onDelete?.();
    closeModal();
  };

  return (
    <>
      <Container>
        {/* 확인 메시지 */}
        <MessageSection>
          <Title>
            폴더명
            <FolderBadge>
              <FolderDot color={folderColor} />
              <FolderName color={folderColor}>{folderName}</FolderName>
            </FolderBadge>
            을(를) 삭제하시겠습니까?
          </Title>
          <Description>
            삭제된 폴더와 폴더의 과제는 영구 삭제되며 되돌릴 수 없습니다.
          </Description>
        </MessageSection>
      </Container>

      {/* 버튼 */}
      <ButtonSection>
        <Button variant='fillGray' size='xlarge' onClick={closeModal}>
          취소
        </Button>
        <Button variant='fillBlue' size='xlarge' onClick={handleDelete}>
          삭제
        </Button>
      </ButtonSection>
    </>
  );
};

const Container = styled('div', {
  base: stack.raw({
    gap: '0.5rem',
    paddingTop: '1.75rem',
  }),
});

const MessageSection = styled('div', {
  base: stack.raw({
    gap: '0.5rem',
  }),
});

const Title = styled('p', {
  base: hstack.raw({
    gap: '0.5rem',
    flexWrap: 'wrap',
    textStyle: 'body2.m',
    color: 'gray.800',
  }),
});

const FolderBadge = styled('span', {
  base: hstack.raw({
    gap: '0.25rem',
    display: 'inline-flex',
    alignItems: 'center',
  }),
});

const FolderName = styled('span', {
  base: {
    textStyle: 'body1.m',
  },
  variants: {
    color: {
      red: { color: 'sub.01.100' },
      yellow: { color: 'sub.02.100' },
      green: { color: 'sub.03.100' },
      purple: { color: 'sub.04.100' },
      black: { color: 'sub.05.100' },
    },
  },
});

const FolderDot = styled('span', {
  base: {
    width: '1rem',
    height: '1rem',
    borderRadius: '50%',
    display: 'inline-block',
  },
  variants: {
    color: {
      red: { bg: 'sub.01.100' },
      yellow: { bg: 'sub.02.100' },
      green: { bg: 'sub.03.100' },
      purple: { bg: 'sub.04.100' },
      black: { bg: 'sub.05.100' },
    },
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
    marginTop: '1.125rem',
    gap: '1rem',
  }),
});
