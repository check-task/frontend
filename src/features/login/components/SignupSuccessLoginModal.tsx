'use client';

import { useEffect, useRef } from 'react';
import { LoginModalContent } from '@/features/login/components/LoginModalContent';
import { useModalStore } from '@/stores/modal-store';

const OPEN_LOGIN_MODAL_AFTER_SIGNUP_KEY = 'openLoginModalAfterSignup';

export const SignupSuccessLoginModal = () => {
  const openModal = useModalStore((state) => state.openModal);
  const opened = useRef(false);

  useEffect(() => {
    if (opened.current) return;

    const shouldOpen =
      window.sessionStorage.getItem(OPEN_LOGIN_MODAL_AFTER_SIGNUP_KEY) ===
      'true';
    if (!shouldOpen) return;

    opened.current = true;
    window.sessionStorage.removeItem(OPEN_LOGIN_MODAL_AFTER_SIGNUP_KEY);

    openModal({
      content: <LoginModalContent />,
      presentation: 'bare',
    });
  }, [openModal]);

  return null;
};
