'use client';

import { css } from 'styled-system/css';
import { useModalStore } from '@/stores/modal-store';
import { PrivacyPolicyContent } from '@/features/profile/components/PrivacyPolicyContent';
import { TermsOfServiceContent } from '@/features/profile/components/TermsOfServiceContent';

export const LoginConsentText = () => {
  const openModal = useModalStore((state) => state.openModal);

  const openTerms = () => {
    openModal({
      title: '서비스 이용 약관',
      content: <TermsOfServiceContent />,
      headerType: 'withClose',
    });
  };

  const openPrivacy = () => {
    openModal({
      title: '개인정보 처리방침',
      content: <PrivacyPolicyContent />,
      headerType: 'withClose',
    });
  };

  return (
    <div className={consentStyle}>
      로그인 시{' '}
      <button className={linkStyle} onClick={openTerms}>
        이용약관
      </button>{' '}
      및{' '}
      <button className={linkStyle} onClick={openPrivacy}>
        개인정보 처리방침
      </button>
      에 동의한 것으로 간주됩니다.
    </div>
  );
};

const consentStyle = css({
  textStyle: 'body4.r',
  color: 'gray.500',
});

const linkStyle = css({
  textStyle: 'body4.r',
  color: 'gray.500',
  textDecoration: 'underline',
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  padding: 0,
});
