'use client';

import { useState, type ReactNode } from 'react';
import { isAxiosError } from 'axios';
import { css, cva } from 'styled-system/css';
import { stack } from 'styled-system/patterns';
import { Checkbox } from '@/components/Checkbox';
import { ChevronLineDownIcon } from '@/components/icons/ChevronLineDownIcon';
import { PrivacyPolicyContent } from '@/features/profile/components/PrivacyPolicyContent';
import { TermsOfServiceContent } from '@/features/profile/components/TermsOfServiceContent';
import { useSubmitSocialAgreement } from '@/hooks/mutations/useSubmitSocialAgreement';

interface KakaoAgreementModalContentProps {
  onCompleted: () => void;
}

type AgreementKey = 'terms' | 'thirdParty' | 'marketing';

const getAgreementErrorMessage = (error: unknown) => {
  if (!isAxiosError(error)) return '약관 동의 저장에 실패했습니다.';

  const data = error.response?.data as
    | { reason?: string; message?: string; errorCode?: string }
    | undefined;

  return data?.reason ?? data?.message ?? '약관 동의 저장에 실패했습니다.';
};

export const KakaoAgreementModalContent = ({
  onCompleted,
}: KakaoAgreementModalContentProps) => {
  const submitAgreement = useSubmitSocialAgreement();
  const [expanded, setExpanded] = useState<Record<AgreementKey, boolean>>({
    terms: true,
    thirdParty: false,
    marketing: false,
  });
  const [agreed, setAgreed] = useState<Record<AgreementKey, boolean>>({
    terms: false,
    thirdParty: false,
    marketing: false,
  });
  const [submitError, setSubmitError] = useState('');

  const canSubmit =
    agreed.terms && agreed.thirdParty && !submitAgreement.isPending;

  const toggleExpanded = (key: AgreementKey) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAgreed = (key: AgreementKey) => {
    setAgreed((prev) => ({ ...prev, [key]: !prev[key] }));
    setSubmitError('');
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    try {
      setSubmitError('');
      await submitAgreement.mutateAsync({
        isTermsAgreed: agreed.terms,
        isThirdParty: agreed.thirdParty,
        isMarketing: agreed.marketing,
      });
      onCompleted();
    } catch (error) {
      setSubmitError(getAgreementErrorMessage(error));
    }
  };

  return (
    <div className={containerStyle}>
      <AgreementSection
        title='서비스 이용약관 (필수)'
        checkboxLabel='서비스 이용약관에 동의합니다.'
        content={<TermsOfServiceContent embedded />}
        expanded={expanded.terms}
        checked={agreed.terms}
        onToggleExpanded={() => toggleExpanded('terms')}
        onToggleChecked={() => toggleAgreed('terms')}
      />

      <AgreementSection
        title='개인정보 처리방침 (필수)'
        checkboxLabel='개인정보 처리방침에 동의합니다.'
        content={<PrivacyPolicyContent embedded />}
        expanded={expanded.thirdParty}
        checked={agreed.thirdParty}
        onToggleExpanded={() => toggleExpanded('thirdParty')}
        onToggleChecked={() => toggleAgreed('thirdParty')}
      />

      <AgreementSection
        title='마케팅 정보 수신 동의 (선택)'
        checkboxLabel='마케팅 정보 수신에 동의합니다.'
        expanded={false}
        checked={agreed.marketing}
        onToggleChecked={() => toggleAgreed('marketing')}
      />

      {submitError && <p className={errorTextStyle}>{submitError}</p>}

      <button
        type='button'
        className={submitButtonStyle}
        disabled={!canSubmit}
        onClick={handleSubmit}
      >
        {submitAgreement.isPending ? '저장 중...' : '동의하고 채택 시작하기'}
      </button>
    </div>
  );
};

interface AgreementSectionProps {
  title: string;
  checkboxLabel: string;
  content?: ReactNode;
  expanded: boolean;
  checked: boolean;
  onToggleExpanded?: () => void;
  onToggleChecked: () => void;
}

const AgreementSection = ({
  title,
  checkboxLabel,
  content,
  expanded,
  checked,
  onToggleExpanded,
  onToggleChecked,
}: AgreementSectionProps) => {
  return (
    <section className={sectionStyle}>
      <div className={sectionHeaderStyle}>
        <p className={sectionTitleStyle}>{title}</p>
        {content && onToggleExpanded && (
          <button
            type='button'
            className={chevronButtonStyle({ expanded })}
            aria-label={expanded ? `${title} 접기` : `${title} 펼치기`}
            onClick={onToggleExpanded}
          >
            <ChevronLineDownIcon />
          </button>
        )}
      </div>

      {expanded && content && <div className={contentBoxStyle}>{content}</div>}

      <div className={checkboxRowStyle}>
        <Checkbox
          checked={checked}
          checkedVariant='black'
          onChange={onToggleChecked}
        />
        <button
          type='button'
          className={checkboxLabelStyle}
          onClick={onToggleChecked}
        >
          {checkboxLabel}
        </button>
      </div>
    </section>
  );
};

const containerStyle = css(
  stack.raw({
    width: '41rem',
    gap: '1.25rem',
    pt: '1.5rem',
  }),
);

const sectionStyle = css(
  stack.raw({
    width: 'full',
    gap: '0.75rem',
  }),
);

const sectionHeaderStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: 'full',
});

const sectionTitleStyle = css({
  textStyle: 'body2.m',
  color: 'gray.900',
});

const chevronButtonStyle = cva({
  base: {
    width: '1.75rem',
    height: '1.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  variants: {
    expanded: {
      true: { transform: 'rotate(0deg)' },
      false: { transform: 'rotate(180deg)' },
    },
  },
});

const contentBoxStyle = css({
  width: 'full',
  border: '0.0625rem solid',
  borderColor: 'gray.200',
  p: '0.75rem',
  maxHeight: '6.75rem',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  scrollbarGutter: 'stable',
  '&::-webkit-scrollbar': {
    width: '0.25rem',
  },
  '&::-webkit-scrollbar-thumb': {
    bg: 'gray.300',
    borderRadius: '999px',
  },
});

const checkboxRowStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  width: 'fit-content',
});

const checkboxLabelStyle = css({
  textStyle: 'body2.r',
  color: 'gray.900',
  cursor: 'pointer',
});

const submitButtonStyle = css({
  width: 'full',
  height: '3.375rem',
  mt: '1.25rem',
  borderRadius: '0.5rem',
  bg: 'primary',
  color: 'primary-button-text',
  fontSize: '1.125rem',
  fontWeight: 600,
  lineHeight: 1.36,
  cursor: 'pointer',
  _hover: {
    bg: '#1D6BDD',
    transition: 'background-color 0.3s ease-out',
  },
  _disabled: {
    bg: 'gray.200',
    color: 'gray.400',
    cursor: 'not-allowed',
  },
});

const errorTextStyle = css({
  mt: '-0.75rem',
  textStyle: 'body4.r',
  color: 'red.500',
});
