'use client';

import { useEffect, useRef } from 'react';
import { useModalStore } from '@/stores/modal-store';
import { RestoreModalContent } from './RestoreModalContent';

interface WithdrawnAlertProps {
  token: string;
}

export const WithdrawnAlert = ({ token }: WithdrawnAlertProps) => {
  const openModal = useModalStore((state) => state.openModal);
  const opened = useRef(false);

  useEffect(() => {
    if (opened.current) return;
    opened.current = true;

    openModal({
      title: '계정 복구 안내',
      content: <RestoreModalContent token={token} restoreType='kakao' />,
      headerType: 'none',
    });
  }, [openModal, token]);

  return null;
};
