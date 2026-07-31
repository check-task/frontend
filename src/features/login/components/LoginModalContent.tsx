'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { isAxiosError } from 'axios';
import { z } from 'zod';
import { css, cx } from 'styled-system/css';
import { hstack, stack } from 'styled-system/patterns';
import { Button } from '@/components/Button';
import { Input } from '@/components/TextField';
import { AppleLoginButton } from '@/features/login/components/AppleLoginButton';
import { KakaoLoginButton } from '@/features/login/components/KakaoLoginButton';
import { EyeIcon } from '@/components/icons/EyeIcon';
import { EyeOffIcon } from '@/components/icons/EyeOffIcon';
import { useModalStore } from '@/stores/modal-store';
import { PasswordResetModalContent } from '@/features/login/components/PasswordResetModalContent';
import { signin } from '@/services/auth';
import { useAuthStore } from '@/stores/auth-store';
import { RestoreModalContent } from '@/features/login/components/RestoreModalContent';
import { PrivacyPolicyContent } from '@/features/profile/components/PrivacyPolicyContent';
import { TermsOfServiceContent } from '@/features/profile/components/TermsOfServiceContent';

const INSTAGRAM_URL = 'https://www.instagram.com/checktask_/';

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

const loginSchema = z.object({
  email: z.email('올바른 이메일 형식으로 입력해 주세요.'),
  password: z.string().min(1, '비밀번호를 입력해 주세요.'),
});

const getLoginErrorMessage = (error: unknown) => {
  if (!isAxiosError(error)) return '로그인에 실패했습니다.';

  const data = error.response?.data as
    | { reason?: string; message?: string; errorCode?: string }
    | undefined;

  if (data?.errorCode === 'INVALID_CREDENTIALS') {
    return '이메일 또는 비밀번호가 올바르지 않습니다.';
  }

  return data?.reason ?? data?.message ?? '로그인에 실패했습니다.';
};

export const LoginModalContent = () => {
  const router = useRouter();
  const closeModal = useModalStore((state) => state.closeModal);
  const openModal = useModalStore((state) => state.openModal);
  const login = useAuthStore((state) => state.login);
  const [mode, setMode] = useState<'login' | 'passwordReset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');
  const canSubmit = email.trim().length > 0 && password.length > 0;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || isSubmitting) return;

    const parsed = loginSchema.safeParse({
      email: email.trim(),
      password,
    });

    if (!parsed.success) {
      setLoginError(
        parsed.error.issues[0]?.message ?? '로그인 정보를 확인해 주세요.',
      );
      return;
    }

    setIsSubmitting(true);
    setLoginError('');

    try {
      const data = await signin(parsed.data);

      if ('withdrawnUser' in data) {
        openModal({
          title: '계정 복구 안내',
          content: (
            <RestoreModalContent
              token={data.restoreToken}
              restoreType='local'
            />
          ),
          headerType: 'none',
        });
        return;
      }

      login(data.accessToken);
      closeModal();
      router.replace('/');
    } catch (error) {
      setLoginError(getLoginErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupClick = () => {
    closeModal();
    router.push('/signup');
  };

  const handleTermClick = (type: keyof typeof TERM_MODAL_CONFIG) => {
    openModal({
      title: TERM_MODAL_CONFIG[type].title,
      content: TERM_MODAL_CONFIG[type].content,
      headerType: 'withBack',
      onLeftClick: () => {
        openModal({
          content: <LoginModalContent />,
          presentation: 'bare',
        });
      },
    });
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setLoginError('');
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setLoginError('');
  };

  if (mode === 'passwordReset') {
    return <PasswordResetModalContent onBackToLogin={() => setMode('login')} />;
  }

  return (
    <form className={containerStyle} onSubmit={handleSubmit} noValidate>
      <div className={introStyle}>
        <Image
          src='/login-logo.svg'
          alt='채택 로고'
          width={208}
          height={38.4}
          priority
        />
        <div className={introTextStyle}>
          <h2 className={titleStyle}>경량 과제 관리 서비스, 채택</h2>
          <p className={descriptionStyle}>
            이메일이나 SNS 간편 로그인으로 사용할 수 있어요
          </p>
        </div>
      </div>

      <div className={formAreaStyle}>
        <div className={inputGroupStyle}>
          <Input
            className={emailInputStyle}
            type='email'
            size='basic'
            value={email}
            placeholder='이메일을 입력하세요.'
            onChange={handleEmailChange}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
          />
          <div className={passwordFieldStyle}>
            <Input
              className={cx(
                passwordInputStyle,
                emailFocused && css({ borderTopColor: 'gray.600!' }),
              )}
              type={showPassword ? 'text' : 'password'}
              size='basic'
              value={password}
              placeholder='비밀번호를 입력하세요.'
              onChange={handlePasswordChange}
            />
            {password.length > 0 && (
              <button
                type='button'
                className={eyeButtonStyle}
                aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            )}
          </div>
        </div>

        <div className={linkRowStyle}>
          <button
            type='button'
            className={subLinkStyle}
            onClick={handleSignupClick}
          >
            회원가입
          </button>
          <button
            type='button'
            className={subLinkStyle}
            onClick={() => setMode('passwordReset')}
          >
            비밀번호 찾기
          </button>
        </div>
      </div>

      {loginError && <p className={loginErrorStyle}>{loginError}</p>}

      <Button
        type='submit'
        variant='fillBlue'
        size='xlarge'
        disabled={!canSubmit || isSubmitting}
      >
        {isSubmitting ? '로그인 중...' : '로그인'}
      </Button>

      <div className={dividerRowStyle}>
        <span className={horizontalDividerStyle} />
        <span className={orTextStyle}>OR</span>
        <span className={horizontalDividerStyle} />
      </div>

      <div className={socialLoginGroupStyle}>
        <KakaoLoginButton />
        <AppleLoginButton />
      </div>

      <p className={consentStyle}>
        로그인 시{' '}
        <button
          type='button'
          className={consentLinkStyle}
          onClick={() => handleTermClick('terms')}
        >
          이용약관
        </button>
        {' 및 '}
        <button
          type='button'
          className={consentLinkStyle}
          onClick={() => handleTermClick('privacy')}
        >
          개인정보 처리방침
        </button>
        에 동의한 것으로 간주됩니다.
        <br />
        {'이메일 찾기 문의는 DM('}
        <a
          href={INSTAGRAM_URL}
          className={instagramLinkStyle}
          target='_blank'
          rel='noreferrer'
        >
          @checktask_
        </a>
        {')로 부탁드립니다.'}
      </p>
    </form>
  );
};

const containerStyle = css(
  stack.raw({
    width: '36.25rem',
    alignItems: 'center',
    overflow: 'hidden',
    pt: '3rem',
    pb: '2.5rem',
  }),
);

const introStyle = css(
  stack.raw({
    alignItems: 'center',
    gap: '0.75rem',
  }),
);

const introTextStyle = css(
  stack.raw({
    alignItems: 'center',
    gap: '0.5rem',
    textAlign: 'center',
  }),
);

const titleStyle = css({
  textStyle: 'h3',
  color: 'blue.700',
});

const descriptionStyle = css({
  textStyle: 'body3.r',
  color: 'gray.600',
});

const formAreaStyle = css(
  stack.raw({
    width: '24.125rem',
    gap: '0.75rem',
    mt: '2.375rem',
  }),
);

const inputGroupStyle = css(
  stack.raw({
    gap: 0,
  }),
);

const emailInputStyle = css({
  width: 'full',
  height: '3rem',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderBottomWidth: 0,
  borderRadius: 0,
  borderTopRadius: '0.25rem',
});

const passwordFieldStyle = css({
  position: 'relative',
  width: 'full',
});

const passwordInputStyle = css({
  width: 'full',
  height: '3rem',
  pr: '3rem',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderRadius: 0,
  borderBottomRadius: '0.25rem',
});

const eyeButtonStyle = css({
  position: 'absolute',
  top: '50%',
  right: '0.75rem',
  transform: 'translateY(-50%)',
  width: '1.5rem',
  height: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'gray.600',
  cursor: 'pointer',
});

const linkRowStyle = css(
  hstack.raw({
    justifyContent: 'space-between',
    width: 'full',
    mb: '1.25rem',
  }),
);

const subLinkStyle = css({
  textStyle: 'body4.r',
  color: 'gray.400',
  cursor: 'pointer',
});

const loginErrorStyle = css({
  width: '24.125rem',
  mt: '0.5rem',
  mb: '0.75rem',
  textStyle: 'body3.r',
  color: 'sub.01.100',
});

const dividerRowStyle = css(
  hstack.raw({
    gap: '0.5rem',
    width: '24.125rem',
    my: '0.75rem',
  }),
);

const horizontalDividerStyle = css({
  flex: 1,
  height: '0.0625rem',
  bg: 'gray.200',
});

const orTextStyle = css({
  textStyle: 'body3.r',
  color: 'gray.400',
});

const socialLoginGroupStyle = css(
  stack.raw({
    gap: '1rem',
  }),
);

const consentStyle = css({
  mt: '2rem',
  textStyle: 'body4.r',
  color: 'gray.500',
  textAlign: 'center',
});

const instagramLinkStyle = css({
  color: 'blue.500',
  textDecoration: 'underline',
});

const consentLinkStyle = css({
  textDecoration: 'underline',
  cursor: 'pointer',
});
