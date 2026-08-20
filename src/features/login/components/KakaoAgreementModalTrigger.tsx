'use client';

import { useEffect, useRef } from 'react';
import { KakaoAgreementModalContent } from '@/features/login/components/KakaoAgreementModalContent';
import { SOCIAL_AGREEMENT_REQUIRED_KEY } from '@/features/login/constants/socialAgreement';
import { useModalStore } from '@/stores/modal-store';

export const KakaoAgreementModalTrigger = () => {
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);
  const hasOpenedRef = useRef(false);

  useEffect(() => {
    if (hasOpenedRef.current) return;
    if (typeof window === 'undefined') return;

    const shouldOpen =
      window.sessionStorage.getItem(SOCIAL_AGREEMENT_REQUIRED_KEY) === 'true';

    if (!shouldOpen) return;

    hasOpenedRef.current = true;
    openModal({
      title: '서비스 이용 약관',
      content: (
        <KakaoAgreementModalContent
          onCompleted={() => {
            window.sessionStorage.removeItem(SOCIAL_AGREEMENT_REQUIRED_KEY);
            closeModal();
          }}
        />
      ),
      headerType: 'none',
      closeOnOverlay: false,
      closeOnEsc: false,
    });
  }, [openModal, closeModal]);

  return null;
};
