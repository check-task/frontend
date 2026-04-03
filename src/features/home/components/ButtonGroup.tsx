'use client';

import Link from 'next/link';
import { css } from 'styled-system/css';
import { hstack } from 'styled-system/patterns';
import { Button } from '@/components/Button';
import { useModalStore } from '@/stores/modal-store';
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
    <div className={containerStyle}>
      <Button variant='strokeBlue' size='small' onClick={handleOpen}>
        과제참여
      </Button>
      <Link href='/assignment/create'>
        <Button variant='fillBlue' size='small'>
          과제등록
        </Button>
      </Link>
    </div>
  );
};

const containerStyle = css(
  hstack.raw({
    gap: '1.25rem',
  }),
);
