'use client';

import { Button } from '@/components/Button';
import { useModalStore } from '@/stores/modal-store';
import Link from 'next/link';
import { styled } from 'styled-system/jsx';
import { hstack } from 'styled-system/patterns';
import { JoinAssignmentModalContent } from './JoinAssignmentModalContent';

export const ButtonGroup = () => {
  const openModal = useModalStore((state) => state.openModal);

  const handleOpen = () => {
    openModal({
      title: '과제 참여',
      content: <JoinAssignmentModalContent />,
      headerType: 'withClose',
    });
  };
  return (
    <Container>
      <Button variant='strokeBlue' size='small' onClick={handleOpen}>
        과제참여
      </Button>
      <Link href='/assignment/create'>
        <Button variant='fillBlue' size='small'>
          과제등록
        </Button>
      </Link>
    </Container>
  );
};

const Container = styled('div', {
  base: hstack.raw({
    gap: '1.25rem',
  }),
});
