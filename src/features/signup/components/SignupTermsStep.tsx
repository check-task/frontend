'use client';

import { useState } from 'react';
import Image from 'next/image';
import { css } from 'styled-system/css';
import { hstack, stack } from 'styled-system/patterns';
import { Button } from '@/components/Button';
import { ModalCheckIcon } from '@/components/icons/ModalCheckIcon';
import { PrivacyPolicyContent } from '@/features/profile/components/PrivacyPolicyContent';
import { TermsOfServiceContent } from '@/features/profile/components/TermsOfServiceContent';
import { useModalStore } from '@/stores/modal-store';

type TermKey = 'privacy' | 'terms' | 'age';
type ViewableTermKey = Exclude<TermKey, 'age'>;

const REQUIRED_KEYS: TermKey[] = ['privacy', 'terms', 'age'];

const TERM_MODAL_CONFIG = {
  privacy: {
    title: '개인정보 처리방침',
    content: <PrivacyPolicyContent />,
  },
  terms: {
    title: '서비스 이용 약관',
    content: <TermsOfServiceContent />,
  },
} as const;

interface SignupTermsStepProps {
  onNext: () => void;
}

export const SignupTermsStep = ({ onNext }: SignupTermsStepProps) => {
  const openModal = useModalStore((state) => state.openModal);
  const [agreed, setAgreed] = useState<Record<TermKey, boolean>>({
    privacy: false,
    terms: false,
    age: false,
  });

  const allTermsChecked = REQUIRED_KEYS.every((key) => agreed[key]);

  const toggleAll = () => {
    const next = !allTermsChecked;
    setAgreed({ privacy: next, terms: next, age: next });
  };

  const toggleTerm = (key: TermKey) => {
    setAgreed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const openTermModal = (key: ViewableTermKey) => {
    openModal({
      title: TERM_MODAL_CONFIG[key].title,
      content: TERM_MODAL_CONFIG[key].content,
      headerType: 'withClose',
    });
  };

  return (
    <div className={pageStyle}>
      <div className={cardStyle}>
        <Image
          src='/login-logo.svg'
          alt='채택 로고'
          width={260}
          height={48}
          priority
        />

        <div className={termsFormStyle}>
          <div className={termsBoxStyle}>
            <div className={allAgreeRowStyle}>
              <button
                type='button'
                className={agreementToggleStyle}
                aria-label='전체 동의하기'
                aria-pressed={allTermsChecked}
                onClick={toggleAll}
              >
                <AgreementCheck checked={allTermsChecked} />
              </button>
              <button
                type='button'
                className={allAgreeLabelStyle}
                onClick={toggleAll}
              >
                전체 동의하기
              </button>
            </div>

            <div className={requiredTermsStyle}>
              <TermRow
                label='개인정보 처리방침'
                checked={agreed.privacy}
                onToggle={() => toggleTerm('privacy')}
                onViewAll={() => openTermModal('privacy')}
              />
              <TermRow
                label='서비스 이용 약관'
                checked={agreed.terms}
                onToggle={() => toggleTerm('terms')}
                onViewAll={() => openTermModal('terms')}
              />
              <TermRow
                label='만 14세 이상입니다'
                checked={agreed.age}
                onToggle={() => toggleTerm('age')}
              />
            </div>
          </div>

          <Button
            type='button'
            variant='fillBlue'
            size='xlarge'
            className={nextButtonStyle}
            disabled={!allTermsChecked}
            onClick={onNext}
          >
            다음
          </Button>
        </div>
      </div>
    </div>
  );
};

const TermRow = ({
  label,
  checked,
  onToggle,
  onViewAll,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
  onViewAll?: () => void;
}) => {
  return (
    <div className={onViewAll ? termRowStyle : termToggleStyle}>
      <div className={termToggleStyle}>
        <button
          type='button'
          className={agreementToggleStyle}
          aria-label={`${label} 동의`}
          aria-pressed={checked}
          onClick={onToggle}
        >
          <AgreementCheck checked={checked} />
        </button>
        <button
          type='button'
          className={termLabelButtonStyle}
          onClick={onToggle}
        >
          <span className={requiredTextStyle}>필수</span>
          <span className={termTextStyle}>{label}</span>
        </button>
      </div>
      {onViewAll && (
        <button
          type='button'
          className={viewAllButtonStyle}
          onClick={onViewAll}
        >
          전체보기
        </button>
      )}
    </div>
  );
};

const AgreementCheck = ({ checked }: { checked: boolean }) => {
  return (
    <span
      className={
        checked ? agreementIconCheckedStyle : agreementIconUncheckedStyle
      }
    >
      <ModalCheckIcon />
    </span>
  );
};

const pageStyle = css(
  stack.raw({
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    bg: 'bg',
  }),
);

const cardStyle = css(
  stack.raw({
    alignItems: 'center',
    gap: '3.75rem',
    width: { base: 'calc(100vw - 2rem)', md: '29.125rem' },
    px: { base: '1.25rem', md: '2.5rem' },
    py: { base: '4rem', md: '5rem' },
    borderWidth: '0.0625rem',
    borderColor: 'gray.200',
    borderRadius: '0.75rem',
    bg: 'bg',
  }),
);

const termsFormStyle = css(
  stack.raw({
    alignItems: 'flex-start',
    gap: '2.5rem',
    width: 'full',
    maxWidth: '24.125rem',
  }),
);

const termsBoxStyle = css(
  stack.raw({
    width: 'full',
    gap: '1.75rem',
  }),
);

const requiredTermsStyle = css(
  stack.raw({
    width: 'full',
    gap: '1rem',
  }),
);

const allAgreeRowStyle = css(
  hstack.raw({
    gap: '0.5rem',
    width: 'full',
  }),
);

const allAgreeLabelStyle = css({
  textStyle: 'body1.m',
  color: 'gray.800',
  cursor: 'pointer',
  textAlign: 'left',
});

const termRowStyle = css(
  hstack.raw({
    justifyContent: 'space-between',
    width: 'full',
    gap: '1rem',
    pr: '0.25rem',
  }),
);

const termToggleStyle = css(
  hstack.raw({
    gap: '0.5rem',
    minWidth: 0,
  }),
);

const agreementToggleStyle = css({
  width: '2rem',
  height: '2rem',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
});

const agreementIconCheckedStyle = css({
  width: '1.5rem',
  height: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',

  '& svg': {
    width: '1.5rem',
    height: '1.5rem',
  },
});

const agreementIconUncheckedStyle = css({
  width: '1.5rem',
  height: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  opacity: 0.45,

  '& svg': {
    width: '1.5rem',
    height: '1.5rem',
  },
});

const termLabelButtonStyle = css(
  hstack.raw({
    gap: '0.25rem',
    minWidth: 0,
    cursor: 'pointer',
  }),
);

const requiredTextStyle = css({
  textStyle: 'body3.m',
  color: 'blue.500',
  flexShrink: 0,
});

const termTextStyle = css({
  textStyle: 'body2.m',
  color: 'gray.800',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const viewAllButtonStyle = css({
  textStyle: 'body3.r',
  color: 'gray.600',
  textDecoration: 'underline',
  textUnderlineOffset: '0.125rem',
  flexShrink: 0,
  cursor: 'pointer',
});

const nextButtonStyle = css({
  width: 'full',
});
