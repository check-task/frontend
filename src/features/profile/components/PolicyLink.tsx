'use client';

import { styled } from 'styled-system/jsx';
import { useModalStore } from '@/stores/modal-store';
import { PrivacyPolicyContent } from './PrivacyPolicyContent';
import { TermsOfServiceContent } from './TermsOfServiceContent';

interface PolicyLinkProps {
  type: 'privacy' | 'terms';
}

const MODAL_CONFIG = {
  privacy: {
    title: '개인정보 처리방침',
    content: <PrivacyPolicyContent />,
  },
  terms: {
    title: '서비스 이용 약관',
    content: <TermsOfServiceContent />,
  },
} as const;

const LABEL = {
  privacy: '개인정보 처리방침',
  terms: '서비스 이용 약관',
} as const;

export const PolicyLink = ({ type }: PolicyLinkProps) => {
  const openModal = useModalStore((state) => state.openModal);

  const handleClick = () => {
    openModal({
      title: MODAL_CONFIG[type].title,
      content: MODAL_CONFIG[type].content,
      headerType: 'withClose',
    });
  };

  return <LinkButton onClick={handleClick}>{LABEL[type]}</LinkButton>;
};

const LinkButton = styled('button', {
  base: {
    textStyle: 'body4.r',
    color: 'gray.300',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: 0,
  },
});
